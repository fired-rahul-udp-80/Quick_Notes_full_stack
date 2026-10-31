import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  MessageSquare,
  Copy,
  PhoneOff,
  ShieldAlert,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MeetingControls = ({
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  isHandRaised,
  chatOpen,
  unreadChatCount = 0,
  participantCount = 1,
  isHost = false,
  roomCode,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRaiseHand,
  onToggleChat,
  onLeaveCall,
  onEndMeetingForAll,
}) => {
  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success(`Meeting code copied: ${roomCode}`);
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/student/meetings/${roomCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Meeting invite link copied to clipboard!');
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw] px-3 sm:px-5 py-2.5 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200">
      {/* Microphone Button */}
      <button
        type="button"
        onClick={onToggleAudio}
        className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isAudioMuted
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
        }`}
        title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        aria-label="Toggle microphone"
      >
        {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {/* Camera Button */}
      <button
        type="button"
        onClick={onToggleVideo}
        className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isVideoOff
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
        }`}
        title={isVideoOff ? 'Start Video' : 'Stop Video'}
        aria-label="Toggle camera"
      >
        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
      </button>

      {/* Screen Share Button */}
      <button
        type="button"
        onClick={onToggleScreenShare}
        className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isScreenSharing
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
        }`}
        title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
        aria-label="Toggle screen share"
      >
        <Monitor className="w-5 h-5" />
      </button>

      {/* Raise Hand Button */}
      <button
        type="button"
        onClick={onToggleRaiseHand}
        className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isHandRaised
            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
        }`}
        title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        aria-label="Toggle raise hand"
      >
        <Hand className="w-5 h-5" />
      </button>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block" />

      {/* Copy Code / Invite */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 text-xs font-semibold cursor-pointer transition-all"
        title="Copy Meeting Invite Link"
      >
        <Copy className="w-4 h-4 text-slate-400" />
        <span>Invite</span>
      </button>

      {/* Chat Drawer Toggle */}
      <button
        type="button"
        onClick={onToggleChat}
        className={`relative p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          chatOpen
            ? 'bg-primary text-slate-950 font-semibold'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
        }`}
        title={chatOpen ? 'Close Chat' : 'Open In-Call Chat'}
        aria-label="Toggle meeting chat"
      >
        <MessageSquare className="w-5 h-5" />
        {unreadChatCount > 0 && !chatOpen && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
            {unreadChatCount}
          </span>
        )}
      </button>

      {/* Participants Counter */}
      <div
        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs font-semibold text-slate-300"
        title={`${participantCount} participant${participantCount !== 1 ? 's' : ''} in room`}
      >
        <Users className="w-4 h-4 text-primary" />
        <span>{participantCount}</span>
      </div>

      {/* Leave Call Button */}
      <button
        type="button"
        onClick={onLeaveCall}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 cursor-pointer ml-1"
        title="Leave Meeting"
      >
        <PhoneOff className="w-4 h-4" />
        <span className="hidden sm:inline">Leave</span>
      </button>

      {/* Host End Meeting for All */}
      {isHost && (
        <button
          type="button"
          onClick={onEndMeetingForAll}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-200 text-xs font-semibold transition-all cursor-pointer"
          title="End meeting for all participants"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>End All</span>
        </button>
      )}
    </div>
  );
};

export default MeetingControls;
