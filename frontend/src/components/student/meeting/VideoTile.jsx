import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Hand, Monitor, User } from 'lucide-react';

export const VideoTile = ({
  stream,
  name = 'Student',
  isLocal = false,
  isAudioMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  isHandRaised = false,
  isSpotlight = false,
  onClick,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full min-h-[180px] bg-slate-900 rounded-2xl overflow-hidden shadow-lg border transition-all duration-200 select-none flex items-center justify-center ${
        isSpotlight ? 'ring-2 ring-primary ring-offset-2 ring-offset-slate-950' : ''
      } ${
        isHandRaised ? 'border-amber-400/80 shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // Avoid local audio feedback echo
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isVideoOff ? 'opacity-0 invisible' : 'opacity-100 visible'
        } ${isLocal && !isScreenSharing ? '-scale-x-100' : ''}`}
      />

      {/* Avatar Fallback when Video is Off */}
      {isVideoOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 text-slate-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-bold text-xl sm:text-2xl shadow-inner mb-2">
            {name ? name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-300">{name}</span>
          <span className="text-[10px] text-slate-500 font-medium">Camera off</span>
        </div>
      )}

      {/* Top Badges (Hand raised / Screen sharing) */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        {isHandRaised && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/90 text-slate-950 font-bold text-[11px] shadow-md animate-bounce">
            <Hand className="w-3.5 h-3.5 fill-current" />
            <span>Hand Raised</span>
          </div>
        )}
        {isScreenSharing && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-600/90 text-white font-medium text-[11px] shadow-md">
            <Monitor className="w-3.5 h-3.5" />
            <span>Sharing Screen</span>
          </div>
        )}
      </div>

      {/* Bottom Name Tag & Audio Status */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-white text-xs font-medium max-w-[85%] truncate">
          <span className="truncate">{name} {isLocal && '(You)'}</span>
        </div>

        {/* Mic Indicator */}
        <div
          className={`p-1.5 rounded-lg backdrop-blur-md border ${
            isAudioMuted
              ? 'bg-rose-500/80 border-rose-400/50 text-white'
              : 'bg-slate-950/70 border-slate-700/50 text-emerald-400'
          }`}
          title={isAudioMuted ? 'Muted' : 'Microphone Active'}
        >
          {isAudioMuted ? (
            <MicOff className="w-3.5 h-3.5" />
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
