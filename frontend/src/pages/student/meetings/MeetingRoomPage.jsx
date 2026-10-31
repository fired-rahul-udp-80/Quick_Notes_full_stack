import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Copy,
  Users,
  ShieldCheck,
  Lock,
  ArrowLeft,
  BookOpen,
  Radio,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { meetingApi } from '../../../services/meetingApi';
import { useWebRTC } from '../../../hooks/useWebRTC';
import { VideoTile } from '../../../components/student/meeting/VideoTile';
import { MeetingControls } from '../../../components/student/meeting/MeetingControls';
import { MeetingChat } from '../../../components/student/meeting/MeetingChat';

export const MeetingRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [meeting, setMeeting] = useState(null);
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Passcode protection
  const [passcodeNeeded, setPasscodeNeeded] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [verifyingPasscode, setVerifyingPasscode] = useState(false);

  // In-call UI states
  const [chatOpen, setChatOpen] = useState(false);
  const [spotlightSocketId, setSpotlightSocketId] = useState(null); // 'local' or peer's socketId

  // Fetch meeting metadata
  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        setLoadingMeeting(true);
        const res = await meetingApi.getMeetingByCode(roomId);
        if (res.success && res.data?.meeting && isMounted) {
          setMeeting(res.data.meeting);
          if (res.data.meeting.hasPasscode && !res.data.meeting.isHost) {
            setPasscodeNeeded(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load meeting room');
        }
      } finally {
        if (isMounted) {
          setLoadingMeeting(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  // WebRTC Hook
  const {
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
  } = useWebRTC(passcodeNeeded ? null : roomId, user);

  // Copy Code Helper
  const handleCopyCode = () => {
    if (meeting?.roomCode) {
      navigator.clipboard.writeText(meeting.roomCode);
      setCopiedCode(true);
      toast.success('Room code copied!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Passcode verification
  const handleVerifyPasscode = async (e) => {
    e.preventDefault();
    setVerifyingPasscode(true);
    try {
      const res = await meetingApi.verifyPasscode(roomId, passcodeInput);
      if (res.success) {
        setPasscodeNeeded(false);
        toast.success('Passcode verified! Entering room...');
      }
    } catch (err) {
      toast.error(err.message || 'Incorrect passcode');
    } finally {
      setVerifyingPasscode(false);
    }
  };

  // Leave Call
  const handleLeaveCall = () => {
    leaveRoom();
    navigate('/student/meetings');
  };

  // End Call for Everyone (Host)
  const handleEndMeetingForAll = async () => {
    if (!window.confirm('Are you sure you want to end this study session for all participants?')) {
      return;
    }
    try {
      endMeetingForAll();
      await meetingApi.endMeeting(roomId);
      toast.success('Meeting ended');
    } catch (err) {
      console.warn('Error ending meeting:', err);
    } finally {
      leaveRoom();
      navigate('/student/meetings');
    }
  };

  if (loadingMeeting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Connecting to study room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Cannot Join Room</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={() => navigate('/student/meetings')}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Return to Study Rooms
          </button>
        </div>
      </div>
    );
  }

  // Passcode Entry Screen
  if (passcodeNeeded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Private Study Room</h2>
            <p className="text-xs text-slate-400 mt-1">
              Please enter the host's passcode to join this session.
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter room passcode"
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={verifyingPasscode || !passcodeInput.trim()}
              className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {verifyingPasscode ? 'Verifying...' : 'Unlock & Join Room'}
            </button>
          </form>

          <button
            onClick={() => navigate('/student/meetings')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Back to Study Rooms
          </button>
        </div>
      </div>
    );
  }

  const totalParticipants = peers.length + 1;
  const isHost = meeting?.isHost;

  // Compute Grid Layout Class based on participant count when not in spotlight
  const getGridClass = () => {
    if (spotlightSocketId) {
      return 'hidden'; // Spotlight mode renders customized layout
    }
    if (totalParticipants === 1) return 'grid-cols-1 max-w-4xl mx-auto';
    if (totalParticipants === 2) return 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto';
    if (totalParticipants <= 4) return 'grid-cols-1 sm:grid-cols-2 max-w-6xl mx-auto';
    if (totalParticipants <= 6) return 'grid-cols-2 md:grid-cols-3 max-w-7xl mx-auto';
    return 'grid-cols-2 md:grid-cols-4 max-w-7xl mx-auto';
  };

  // Spotlight participant object
  const spotlightPeer = spotlightSocketId === 'local'
    ? null
    : peers.find((p) => p.socketId === spotlightSocketId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 z-30 shrink-0">
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleLeaveCall}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Return to lobby"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">
                {meeting?.title || 'Study Session'}
              </h1>
              {meeting?.isPrivate && (
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Private session" />
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              {meeting?.subjectName && (
                <span className="flex items-center gap-1 text-slate-300">
                  <BookOpen className="w-3 h-3 text-primary" />
                  <span>{meeting.subjectName}</span>
                </span>
              )}
              <span>•</span>
              <span>Host: {meeting?.hostName}</span>
            </div>
          </div>
        </div>

        {/* Center: Live status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">P2P Encrypted Mesh</span>
        </div>

        {/* Right: Room code copy & Participants */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Room Code Badge */}
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
            title="Click to copy room code"
          >
            <span>{meeting?.roomCode}</span>
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Participant count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs font-semibold text-slate-300">
            <Users className="w-4 h-4 text-primary" />
            <span>{totalParticipants}</span>
          </div>
        </div>
      </header>

      {/* Main Video Presentation Canvas */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-24 flex flex-col justify-center items-center">
        {/* Spotlight Mode View */}
        {spotlightSocketId && (
          <div className="w-full h-full max-w-7xl flex flex-col gap-4">
            {/* Featured Big Tile */}
            <div className="flex-1 w-full min-h-[300px] max-h-[70vh]">
              {spotlightSocketId === 'local' ? (
                <VideoTile
                  stream={localStream}
                  name={user?.name || 'You'}
                  isLocal={true}
                  isAudioMuted={isAudioMuted}
                  isVideoOff={isVideoOff}
                  isScreenSharing={isScreenSharing}
                  isHandRaised={isHandRaised}
                  isSpotlight={true}
                  onClick={() => setSpotlightSocketId(null)}
                />
              ) : spotlightPeer ? (
                <VideoTile
                  stream={spotlightPeer.stream}
                  name={spotlightPeer.user?.name || 'Student'}
                  isLocal={false}
                  isAudioMuted={spotlightPeer.isAudioMuted}
                  isVideoOff={spotlightPeer.isVideoOff}
                  isScreenSharing={spotlightPeer.isScreenSharing}
                  isHandRaised={spotlightPeer.isHandRaised}
                  isSpotlight={true}
                  onClick={() => setSpotlightSocketId(null)}
                />
              ) : null}
            </div>

            {/* Horizontal Filmstrip of other participants */}
            <div className="flex items-center gap-3 overflow-x-auto py-2 shrink-0 max-h-36">
              {spotlightSocketId !== 'local' && (
                <div className="w-44 h-28 shrink-0">
                  <VideoTile
                    stream={localStream}
                    name={user?.name || 'You'}
                    isLocal={true}
                    isAudioMuted={isAudioMuted}
                    isVideoOff={isVideoOff}
                    isScreenSharing={isScreenSharing}
                    isHandRaised={isHandRaised}
                    onClick={() => setSpotlightSocketId('local')}
                  />
                </div>
              )}
              {peers
                .filter((p) => p.socketId !== spotlightSocketId)
                .map((peer) => (
                  <div key={peer.socketId} className="w-44 h-28 shrink-0">
                    <VideoTile
                      stream={peer.stream}
                      name={peer.user?.name || 'Student'}
                      isLocal={false}
                      isAudioMuted={peer.isAudioMuted}
                      isVideoOff={peer.isVideoOff}
                      isScreenSharing={peer.isScreenSharing}
                      isHandRaised={peer.isHandRaised}
                      onClick={() => setSpotlightSocketId(peer.socketId)}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Regular Responsive Grid Layout */}
        {!spotlightSocketId && (
          <div className={`w-full grid gap-4 auto-rows-fr ${getGridClass()}`}>
            {/* Local Video Tile */}
            <VideoTile
              stream={localStream}
              name={user?.name || 'You'}
              isLocal={true}
              isAudioMuted={isAudioMuted}
              isVideoOff={isVideoOff}
              isScreenSharing={isScreenSharing}
              isHandRaised={isHandRaised}
              onClick={() => setSpotlightSocketId('local')}
            />

            {/* Remote Peer Tiles */}
            {peers.map((peer) => (
              <VideoTile
                key={peer.socketId}
                stream={peer.stream}
                name={peer.user?.name || 'Student'}
                isLocal={false}
                isAudioMuted={peer.isAudioMuted}
                isVideoOff={peer.isVideoOff}
                isScreenSharing={peer.isScreenSharing}
                isHandRaised={peer.isHandRaised}
                onClick={() => setSpotlightSocketId(peer.socketId)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Control Bar */}
      <MeetingControls
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isHandRaised={isHandRaised}
        chatOpen={chatOpen}
        unreadChatCount={0}
        participantCount={totalParticipants}
        isHost={isHost}
        roomCode={meeting?.roomCode}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleRaiseHand={toggleRaiseHand}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onLeaveCall={handleLeaveCall}
        onEndMeetingForAll={handleEndMeetingForAll}
      />

      {/* In-Meeting Chat Drawer */}
      <MeetingChat
        messages={chatMessages}
        currentUserId={user?._id || user?.id}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onSendMessage={sendChatMessage}
      />
    </div>
  );
};

export default MeetingRoomPage;
