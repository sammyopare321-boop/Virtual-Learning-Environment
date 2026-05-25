'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Video, VideoOff, PhoneOff, Users, Maximize2, Minimize2 } from 'lucide-react';

interface JitsiRoomProps {
  roomId: string;
  displayName: string;
  onLeave: () => void;
  isHost?: boolean;
}

interface JitsiAPI {
  dispose: () => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
  addEventListeners: (listeners: Record<string, () => void>) => void;
  getNumberOfParticipants: () => number;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => JitsiAPI;
  }
}

export default function JitsiRoom({ roomId, displayName, onLeave, isHost = false }: JitsiRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    // Load Jitsi External API script
    const scriptId = 'jitsi-api-script';
    const existing = document.getElementById(scriptId);

    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: roomId,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          disableInviteFunctions: true,
          toolbarButtons: [], // hide default toolbar — we use our own
          hideConferenceSubject: true,
          hideConferenceTimer: false,
          disableThirdPartyRequests: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          TOOLBAR_ALWAYS_VISIBLE: false,
          HIDE_INVITE_MORE_HEADER: true,
          MOBILE_APP_PROMO: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        },
      });

      apiRef.current.addEventListeners({
        videoConferenceJoined: () => setLoading(false),
        videoConferenceLeft: () => onLeave(),
        participantJoined: () => setParticipants(p => p + 1),
        participantLeft: () => setParticipants(p => Math.max(1, p - 1)),
      });
    };

    if (existing) {
      // Script already loaded
      if (window.JitsiMeetExternalAPI) initJitsi();
      else existing.addEventListener('load', initJitsi);
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initJitsi;
      document.head.appendChild(script);
    }

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const toggleMute = () => {
    apiRef.current?.executeCommand('toggleAudio');
    setMuted(m => !m);
  };

  const toggleVideo = () => {
    apiRef.current?.executeCommand('toggleVideo');
    setVideoOff(v => !v);
  };

  const handleLeave = () => {
    apiRef.current?.executeCommand('hangup');
    onLeave();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.parentElement?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-semibold text-white">Live</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Users size={13} />
          <span>{participants}</span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="text-slate-400 hover:text-white transition-colors"
          title="Toggle fullscreen"
        >
          {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* Jitsi iframe container */}
      <div className="relative flex-1 min-h-0">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
            <p className="text-sm text-slate-400">Connecting to room...</p>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 border-t border-slate-800 shrink-0">
        <button
          onClick={toggleMute}
          title={muted ? 'Unmute' : 'Mute'}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            muted ? 'bg-rose-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
        >
          {muted ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          onClick={toggleVideo}
          title={videoOff ? 'Turn on camera' : 'Turn off camera'}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            videoOff ? 'bg-rose-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
        >
          {videoOff ? <VideoOff size={16} /> : <Video size={16} />}
        </button>

        <button
          onClick={handleLeave}
          title="Leave session"
          className="w-12 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all"
        >
          <PhoneOff size={16} />
        </button>
      </div>
    </div>
  );
}
