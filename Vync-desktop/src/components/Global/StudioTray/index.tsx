import { onStopRecording, selectSources, StartRecording } from "@/lib/recorder";
import { cn, videoRecordingTime } from "@/lib/utils";
import { Cast, Pause, Square, Circle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

type SourcePayload = {
  screen: string;
  id: string;
  audio: string;
  preset: "HD" | "SD";
  plan: "PRO" | "FREE";
};

const StudioTray = () => {
  // Refs
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [preview, setPreview] = useState(false);
  const [onTimer, setOnTimer] = useState<string>("00:00:00");
  const [, setCount] = useState<number>(0);
  const [recording, setRecording] = useState(false);
  const [onSources, setOnSources] = useState<SourcePayload | undefined>(undefined);

  // 1. Properly handle IPC listeners
  useEffect(() => {
    const handleProfileReceived = (_: any, payload: SourcePayload) => {
      setOnSources(payload);
    };

    window.ipcRenderer.on("profile-received", handleProfileReceived);

    return () => {
      if (window.ipcRenderer.removeListener) {
        window.ipcRenderer.removeListener("profile-received", handleProfileReceived);
      }
    };
  }, []);

  // 2. CRITICAL FIX: Removed "&& preview" so the recorder can attach to the stream
  // even if the preview window is hidden!
  useEffect(() => {
    if (onSources && onSources.screen) {
      selectSources(onSources, videoElement);
    }
  }, [onSources, preview]);

  // 3. Centralized Stop Logic
  const stopRecording = useCallback(() => {
    setRecording(false);
    setOnTimer("00:00:00");
    setCount(0);
    onStopRecording();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, []);

  // 4. Fixed Timer and Recording Management
  useEffect(() => {
    if (!recording) return;

    startTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      setCount(elapsed);

      const recordingTime = videoRecordingTime(elapsed);

      // Auto-stop for free plan
      if (onSources?.plan === "FREE" && recordingTime.minute === "05") {
        stopRecording();
      } else {
        setOnTimer(recordingTime.length);
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [recording, onSources?.plan, stopRecording]);

  const handleStartRecording = () => {
    if (!onSources) return;
    setRecording(true);
    StartRecording({
      audio: onSources.audio,
      id: onSources.id,
      screen: onSources.screen,
    });
  };

  if (!onSources) {
    return <div className="p-4 text-white bg-black/50 rounded-md shadow-lg">Loading sources...</div>;
  }

  // UI Rendering
  return (
    <div className="flex flex-col justify-end items-end gap-y-4 draggable w-fit">
      {/* Sleek Preview Window */}
      {preview && (
        <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black w-64 aspect-video transition-all duration-300">
          <video
            autoPlay
            muted
            ref={videoElement}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Floating Controls Tray */}
      <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-xl draggable transition-all duration-300 w-auto">
        
        {/* Record / Recording Indicator */}
        <div className="flex items-center gap-3 non-draggable">
          <button
            onClick={!recording ? handleStartRecording : undefined}
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none",
              recording ? "cursor-default" : "cursor-pointer hover:scale-105 hover:bg-red-500/20 p-1"
            )}
          >
            {recording ? (
              <div className="w-4 h-4 bg-red-500 rounded-sm animate-pulse" /> // Square for "recording active"
            ) : (
              <Circle className="fill-red-500 text-red-500 w-6 h-6" /> // Circle for "start recording"
            )}
          </button>

          {/* Dedicated Timer Display */}
          {recording && (
            <span className="text-white font-mono font-medium text-sm w-[68px] transition-opacity">
              {onTimer}
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20" />

        {/* Actions */}
        <div className="flex items-center gap-4 non-draggable">
          {/* Stop Button */}
          {recording ? (
            <button 
              onClick={stopRecording} 
              className="text-white hover:text-red-400 hover:scale-110 transition-all focus:outline-none group"
              title="Stop Recording"
            >
              <Square size={20} className="fill-current group-hover:fill-red-400" />
            </button>
          ) : (
            <button disabled className="opacity-30 cursor-not-allowed">
              <Pause size={20} className="fill-white stroke-none" />
            </button>
          )}

          {/* Toggle Preview Button */}
          <button
            onClick={() => setPreview((prev) => !prev)}
            className={cn(
              "hover:scale-110 transition-all focus:outline-none",
              preview ? "text-[#a855f7]" : "text-white hover:text-gray-300"
            )}
            title="Toggle Camera Preview"
          >
            <Cast size={20} className={cn(preview && "fill-current")} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioTray;