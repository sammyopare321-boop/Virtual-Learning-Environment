'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, PhoneOff, ExternalLink } from 'lucide-react';

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
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => JitsiAPI;
  }
}

export default function JitsiRoom({ roomId, displayName, onLeave, isHost = false }: JitsiRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiAPI | null>(null);
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const jitsiUrl = `https://meet.jit.si/${roomId}`;

  useEffect(() => {
    const scriptId = 'jitsi-api-script';

    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) {
        setStatus('error');
        return;
      }

      try {
        apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: roomId,
          parentNode: containerRef.current,
          width: '100%',
          height: '100%',
          userInfo: { displayName },
          configOverwrite: {
            // Teachers start with mic + camera on; students start muted
            startWithAudioMuted: !isHost,
            startWithVideoMuted: !isHost,
            disableDeepLinking: true,
            prejoinPageEnabled: false,
            // Students join as regular participants; teachers get moderator tools
            ...(isHost ? {} : {
              disableModeratorIndicator: false,
              remoteVideoMenu: { disableKick: true },
            }),
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            MOBILE_APP_PROMO: false,
            // Hide extra toolbar buttons for students to keep UI clean
            TOOLBAR_BUTTONS: isHost
              ? ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'participants-pane', 'tileview', 'hangup']
              : ['microphone', 'camera', 'chat', 'raisehand', 'tileview', 'hangup'],
          },
        });

        apiRef.current.addEventListeners({
          videoConferenceJoined: () => setStatus('connected'),
          videoConferenceLeft: () => onLeave(),
          errorOccurred: () => setStatus('error'),
        });

        // Fallback: if not connected after 15s, assume connected anyway
        // (some browsers fire the event late)
        const fallback = setTimeout(() => setStatus('connected'), 15000);
        return () => clearTimeout(fallback);
      } catch {
        setStatus('error');
      }
    };

    const existing = document.getElementById(scriptId);
    if (existing) {
      if (window.JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        existing.addEventListener('load', initJitsi);
      }
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initJitsi;
      script.onerror = () => setStatus('error');
      document.head.appendChild(script);
    }

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500' : status === 'error' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-xs font-semibold text-white">
            {status === 'connected' ? 'Live' : status === 'error' ? 'Connection failed' : 'Connecting...'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Fallback: open in new tab if embed fails */}
          <a
            href={jitsiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={13} /> Open in tab
          </a>
          <button
            onClick={() => { apiRef.current?.executeCommand('hangup'); onLeave(); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all"
            title="Leave session"
          >
            <PhoneOff size={12} /> Leave
          </button>
        </div>
      </div>

      {/* Jitsi container */}
      <div className="relative flex-1 min-h-0">
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
            <p className="text-sm text-slate-400">Connecting to room...</p>
            <p className="text-xs text-slate-500">Allow camera & microphone when prompted</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 gap-4 p-6 text-center">
            <p className="text-sm text-slate-300 font-semibold">Could not embed the video room</p>
            <p className="text-xs text-slate-500">This can happen due to browser security settings or extensions blocking the connection.</p>
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm gap-1.5"
            >
              <ExternalLink size={13} /> Join in New Tab
            </a>
            <button onClick={onLeave} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Go back
            </button>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
