import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket, connectSocket } from '../services/socket';
import toast from 'react-hot-toast';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export const useWebRTC = (roomId, currentUser) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [mediaError, setMediaError] = useState(null);

  // Refs to avoid stale closures in socket callbacks
  const localStreamRef = useRef(null);
  const screenTrackRef = useRef(null);
  const peersRef = useRef({}); // socketId -> { pc, user, stream, info }
  const socketRef = useRef(null);

  // Helper to safely update peer info in state
  const updatePeerState = useCallback((socketId, updater) => {
    setPeers((prevPeers) =>
      prevPeers.map((p) => (p.socketId === socketId ? { ...p, ...updater } : p))
    );
  }, []);

  // Create a peer connection with all handlers
  const createPeerConnection = useCallback((targetSocketId, targetUser) => {
    if (peersRef.current[targetSocketId]?.pc) {
      return peersRef.current[targetSocketId].pc;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    const remoteStream = new MediaStream();

    peersRef.current[targetSocketId] = {
      pc,
      user: targetUser || { name: 'Student' },
      stream: remoteStream,
      isAudioMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      isHandRaised: false,
    };

    // Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('send-ice-candidate', {
          toSocketId: targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming remote media tracks
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });

      // Update state to trigger re-render
      setPeers((prev) => {
        const existing = prev.find((p) => p.socketId === targetSocketId);
        if (existing) {
          return prev.map((p) =>
            p.socketId === targetSocketId
              ? { ...p, stream: remoteStream }
              : p
          );
        }
        return [
          ...prev,
          {
            socketId: targetSocketId,
            user: targetUser || { name: 'Student' },
            stream: remoteStream,
            isAudioMuted: false,
            isVideoOff: false,
            isScreenSharing: false,
            isHandRaised: false,
          },
        ];
      });
    };

    pc.onconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        removePeer(targetSocketId);
      }
    };

    return pc;
  }, []);

  // Remove peer cleanly
  const removePeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) {
      try {
        peersRef.current[socketId].pc.close();
      } catch (e) {
        // Safe close
      }
      delete peersRef.current[socketId];
    }
    setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
  }, []);

  // Initialize Local Media & Socket Signaling
  useEffect(() => {
    if (!roomId) return;

    let mounted = true;
    const socket = connectSocket();
    socketRef.current = socket;

    const startCall = async () => {
      try {
        // Request camera and microphone
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
          });
        } catch (mediaErr) {
          console.warn('Full media acquisition failed, trying audio-only:', mediaErr);
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsVideoOff(true);
            toast('Camera unavailable, joined with microphone only.', { icon: '🎙️' });
          } catch (audioErr) {
            console.error('Microphone also unavailable:', audioErr);
            setMediaError('Could not access microphone or camera. Please check browser permissions.');
            toast.error('Microphone and camera permissions denied.');
            stream = new MediaStream();
          }
        }

        if (!mounted) {
          stream?.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Join room once socket connects
        const emitJoin = () => {
          socket.emit('join-room', {
            roomId,
            user: {
              userId: currentUser?._id || currentUser?.id,
              name: currentUser?.name || 'Student',
              avatar: currentUser?.avatar,
            },
          });
          setIsConnected(true);
        };

        if (socket.connected) {
          emitJoin();
        } else {
          socket.once('connect', emitJoin);
        }
      } catch (err) {
        console.error('Error starting video call:', err);
      }
    };

    startCall();

    // ==========================================
    // SOCKET SIGNALING LISTENERS
    // ==========================================

    // Receive existing participants: we will initiate offer to each
    socket.on('existing-participants', async ({ participants }) => {
      if (!mounted) return;

      for (const participant of participants) {
        const pc = createPeerConnection(participant.socketId, participant);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('send-offer', {
            toSocketId: participant.socketId,
            offer,
            callerInfo: {
              userId: currentUser?._id || currentUser?.id,
              name: currentUser?.name || 'Student',
            },
          });
        } catch (err) {
          console.error('Error creating offer for peer:', err);
        }
      }
    });

    // Receive offer from a new peer
    socket.on('receive-offer', async ({ fromSocketId, offer, callerInfo }) => {
      if (!mounted) return;

      const pc = createPeerConnection(fromSocketId, callerInfo);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('send-answer', {
          toSocketId: fromSocketId,
          answer,
        });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    // Receive answer from peer
    socket.on('receive-answer', async ({ fromSocketId, answer }) => {
      const peer = peersRef.current[fromSocketId];
      if (peer && peer.pc) {
        try {
          await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error('Error setting remote description from answer:', err);
        }
      }
    });

    // Receive ICE candidate
    socket.on('receive-ice-candidate', async ({ fromSocketId, candidate }) => {
      const peer = peersRef.current[fromSocketId];
      if (peer && peer.pc) {
        try {
          await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    // Remote user toggled audio
    socket.on('user-audio-toggle', ({ socketId, isMuted }) => {
      updatePeerState(socketId, { isAudioMuted: isMuted });
    });

    // Remote user toggled video
    socket.on('user-video-toggle', ({ socketId, isVideoOff: remoteVideoOff }) => {
      updatePeerState(socketId, { isVideoOff: remoteVideoOff });
    });

    // Remote user toggled screen share
    socket.on('user-screen-toggle', ({ socketId, isSharing }) => {
      updatePeerState(socketId, { isScreenSharing: isSharing });
    });

    // Remote user toggled raise hand
    socket.on('user-hand-toggle', ({ socketId, isRaised }) => {
      updatePeerState(socketId, { isHandRaised: isRaised });
      if (isRaised) {
        const peer = peersRef.current[socketId];
        toast(`${peer?.user?.name || 'A student'} raised their hand ✋`, { icon: '✋' });
      }
    });

    // In-call chat message
    socket.on('receive-chat-message', (chatMessage) => {
      setChatMessages((prev) => [...prev, chatMessage]);
    });

    // User left room
    socket.on('user-left', ({ socketId, name }) => {
      removePeer(socketId);
      toast(`${name || 'A student'} left the meeting.`, { icon: '👋' });
    });

    // Host ended meeting for everyone
    socket.on('meeting-ended-by-host', () => {
      toast('The host has ended this meeting.', { icon: '🛑' });
      leaveRoom();
    });

    return () => {
      mounted = false;
      // Stop all local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
      // Close all peer connections
      Object.keys(peersRef.current).forEach((sockId) => {
        try {
          peersRef.current[sockId].pc.close();
        } catch (e) {}
      });
      peersRef.current = {};

      // Notify server we left
      socket.emit('leave-room', { roomId });
      socket.off('existing-participants');
      socket.off('receive-offer');
      socket.off('receive-answer');
      socket.off('receive-ice-candidate');
      socket.off('user-audio-toggle');
      socket.off('user-video-toggle');
      socket.off('user-screen-toggle');
      socket.off('user-hand-toggle');
      socket.off('receive-chat-message');
      socket.off('user-left');
      socket.off('meeting-ended-by-host');
    };
  }, [roomId, currentUser, createPeerConnection, removePeer, updatePeerState]);

  // Toggle Local Microphone
  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      const nextMuted = !audioTrack.enabled;
      setIsAudioMuted(nextMuted);

      socketRef.current?.emit('toggle-audio', {
        roomId,
        isMuted: nextMuted,
      });

      toast(nextMuted ? 'Microphone muted' : 'Microphone on', {
        icon: nextMuted ? '🔇' : '🎙️',
      });
    }
  }, [roomId]);

  // Toggle Local Camera
  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      const nextOff = !videoTrack.enabled;
      setIsVideoOff(nextOff);

      socketRef.current?.emit('toggle-video', {
        roomId,
        isVideoOff: nextOff,
      });

      toast(nextOff ? 'Camera turned off' : 'Camera turned on', {
        icon: nextOff ? '📷' : '📹',
      });
    }
  }, [roomId]);

  // Toggle Screen Sharing
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Revert back to webcam track
      stopScreenShare();
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true,
      });

      const screenVideoTrack = displayStream.getVideoTracks()[0];
      screenTrackRef.current = screenVideoTrack;

      // Replace video track across all peer connections
      Object.values(peersRef.current).forEach(({ pc }) => {
        const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenVideoTrack);
        }
      });

      setIsScreenSharing(true);
      socketRef.current?.emit('toggle-screen-share', {
        roomId,
        isSharing: true,
      });

      // Browser UI "Stop Sharing" button listener
      screenVideoTrack.onended = () => {
        stopScreenShare();
      };

      toast.success('Screen sharing started');
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        console.error('Error starting screen share:', err);
        toast.error('Failed to share screen');
      }
    }
  }, [isScreenSharing, roomId]);

  const stopScreenShare = useCallback(() => {
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    const cameraVideoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (cameraVideoTrack) {
      Object.values(peersRef.current).forEach(({ pc }) => {
        const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(cameraVideoTrack);
        }
      });
    }

    setIsScreenSharing(false);
    socketRef.current?.emit('toggle-screen-share', {
      roomId,
      isSharing: false,
    });
    toast('Screen sharing stopped', { icon: '🖥️' });
  }, [roomId]);

  // Toggle Raise Hand
  const toggleRaiseHand = useCallback(() => {
    const nextRaised = !isHandRaised;
    setIsHandRaised(nextRaised);
    socketRef.current?.emit('toggle-raise-hand', {
      roomId,
      isRaised: nextRaised,
    });
    toast(nextRaised ? 'Hand raised ✋' : 'Hand lowered', { icon: '✋' });
  }, [isHandRaised, roomId]);

  // Send In-Meeting Chat Message
  const sendChatMessage = useCallback(
    (text) => {
      if (!text || !text.trim() || !socketRef.current) return;
      socketRef.current.emit('send-chat-message', {
        roomId,
        message: text.trim(),
      });
    },
    [roomId]
  );

  // End Meeting for All (Host)
  const endMeetingForAll = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('end-meeting-for-all', { roomId });
    }
  }, [roomId]);

  // Leave Room
  const leaveRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
    }
  }, [roomId]);

  return {
    localStream,
    peers,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised,
    isConnected,
    chatMessages,
    mediaError,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleRaiseHand,
    sendChatMessage,
    endMeetingForAll,
    leaveRoom,
  };
};

export default useWebRTC;
