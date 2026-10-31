import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Video,
  Plus,
  LogIn,
  Users,
  Lock,
  Sparkles,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  RefreshCw,
  BookOpen,
  Radio,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { meetingApi } from '../../../services/meetingApi';

export const MeetingLobbyPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Form states
  const [activeTab, setActiveTab] = useState('join'); // 'join' | 'create'
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Create room state
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [isCreating, setIsCreating] = useState(false);

  // Active public rooms state
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);

  // Media preview states
  const [previewStream, setPreviewStream] = useState(null);
  const [previewMicMuted, setPreviewMicMuted] = useState(false);
  const [previewVideoOff, setPreviewVideoOff] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const videoPreviewRef = useRef(null);

  // Fetch active public study rooms
  const loadActiveRooms = async () => {
    setLoadingActive(true);
    try {
      const res = await meetingApi.getActiveMeetings();
      if (res.success && res.data?.meetings) {
        setActiveMeetings(res.data.meetings);
      }
    } catch (err) {
      console.warn('Could not load active rooms:', err);
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    loadActiveRooms();
  }, []);

  // Initialize camera/mic preview
  useEffect(() => {
    let streamInstance = null;

    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 360, facingMode: 'user' },
          audio: true,
        });
        streamInstance = stream;
        setPreviewStream(stream);
        setCameraPermissionError(false);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Preview media access failed:', err);
        setCameraPermissionError(true);
      }
    };

    startPreview();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const togglePreviewMic = () => {
    if (previewStream) {
      const track = previewStream.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setPreviewMicMuted(!track.enabled);
      }
    }
  };

  const togglePreviewVideo = () => {
    if (previewStream) {
      const track = previewStream.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setPreviewVideoOff(!track.enabled);
      }
    }
  };

  // Join Room by Code
  const handleJoin = async (e) => {
    e?.preventDefault();
    const raw = joinCode.trim();
    if (!raw) {
      toast.error('Please enter a meeting code');
      return;
    }

    // Extract code if user pasted a full URL
    let code = raw;
    if (raw.includes('/meetings/')) {
      code = raw.split('/meetings/')[1].split('?')[0].split('/')[0];
    }

    setIsJoining(true);
    try {
      const res = await meetingApi.getMeetingByCode(code);
      if (res.success && res.data?.meeting) {
        navigate(`/student/meetings/${res.data.meeting.roomCode}`);
      } else {
        toast.error('Meeting not found');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid or expired meeting code');
    } finally {
      setIsJoining(false);
    }
  };

  // Create Room
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a meeting title');
      return;
    }

    setIsCreating(true);
    try {
      const res = await meetingApi.createMeeting({
        title: title.trim(),
        subjectName: subjectName.trim(),
        courseName: user?.academicProfile?.courseName || '',
        isPrivate,
        passcode: isPrivate ? passcode : null,
        maxParticipants: Number(maxParticipants),
      });

      if (res.success && res.data?.meeting) {
        toast.success('Study room created!');
        navigate(`/student/meetings/${res.data.meeting.roomCode}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create meeting room');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-yellow-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
            <span>P2P WebRTC Study Rooms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Live Peer Video & Discussion
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Collaborate face-to-face with fellow students. Share notes, discuss complex concepts,
            and study in real-time with zero software installs.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('create');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-slate-950 font-bold text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Room</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Lobby Join/Create, Right is Media Check */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Join / Create Tabs */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          {/* Tab Switcher */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('join')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Join with Code</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Room</span>
            </button>
          </div>

          {/* Join Room Form */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Room Code or Meeting Link
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="e.g. ABCD-1234 or paste invite URL"
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isJoining || !joinCode.trim()}
                    className="absolute right-2 top-2 bottom-2 px-5 bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  >
                    <span>{isJoining ? 'Connecting...' : 'Join'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Instant WebRTC Connection
                </p>
                 
              </div>
            </form>
          )}

          {/* Create Room Form */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Data Structures Exam Revision"
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Subject or Topic (Optional)
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Operating Systems, Algorithms"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Max Participants
                  </label>
                  <select
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                  >
                    <option value={4}>4 Students (Ultra-smooth)</option>
                    <option value={6}>6 Students (Recommended)</option>
                    <option value={8}>8 Students</option>
                    <option value={10}>10 Students</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Privacy
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span>Private Room (Passcode)</span>
                    </label>
                  </div>
                </div>
              </div>

              {isPrivate && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Room Passcode
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode for entry"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating || !title.trim()}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-slate-950 font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Video className="w-4 h-4" />
                <span>{isCreating ? 'Setting Up Room...' : 'Start Study Room'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Camera & Mic Self-Check */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span>Camera & Mic Check</span>
            </h2>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Ready
            </span>
          </div>

          {/* Video Preview Box */}
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover -scale-x-100 ${
                previewVideoOff || cameraPermissionError ? 'hidden' : 'block'
              }`}
            />

            {(previewVideoOff || cameraPermissionError) && (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-4 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xl">
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <p className="text-xs font-semibold text-slate-300">
                  {cameraPermissionError ? 'Camera Access Disabled' : 'Camera is Off'}
                </p>
                <p className="text-[10px] text-slate-500 max-w-[200px]">
                  {cameraPermissionError
                    ? 'Allow camera in browser address bar to enable video.'
                    : 'You can turn your camera on anytime during the call.'}
                </p>
              </div>
            )}

            {/* In-Preview Media Buttons */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={togglePreviewMic}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  previewMicMuted
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={previewMicMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {previewMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={togglePreviewVideo}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  previewVideoOff
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={previewVideoOff ? 'Turn camera on' : 'Turn camera off'}
              >
                {previewVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Device Preview Guidelines:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Use headphones to minimize echo and background audio.</li>
              <li>Ensure good lighting facing your webcam.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Public Study Rooms */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Open Study Rooms</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join active group study rooms hosted by students right now.
            </p>
          </div>

          <button
            type="button"
            onClick={loadActiveRooms}
            disabled={loadingActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingActive ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {activeMeetings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Open Study Rooms Currently Active
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to start a session! Click "New Study Room" above to invite your peers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMeetings.map((room) => (
              <div
                key={room.id || room.roomCode}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                      Live Now
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                      {room.roomCode}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1">
                      {room.title}
                    </h4>
                    {room.subjectName && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>{room.subjectName}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Host: <span className="font-semibold text-slate-600 dark:text-slate-300">{room.hostName}</span>
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>Up to {room.maxParticipants}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/student/meetings/${room.roomCode}`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <span>Join Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingLobbyPage;
