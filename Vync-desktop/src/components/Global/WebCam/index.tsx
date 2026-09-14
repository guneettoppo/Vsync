import { useEffect, useRef } from "react";

const WebCam = () => {
  const camElement = useRef<HTMLVideoElement | null>(null);

  const streamWebCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (camElement.current) {
        camElement.current.srcObject = stream;
        await camElement.current.play();
      }
    } catch (error) {
      console.error("Failed to access webcam:", error);
    }
  };

  useEffect(() => {
    streamWebCam();

    // Still keeping the cleanup function to prevent memory leaks/camera light staying on!
    return () => {
      if (camElement.current && camElement.current.srcObject) {
        const stream = camElement.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={camElement}
      muted
      // Clean, minimalist style. 
      // Note: Kept 'aspect-square' instead of 'aspect-video' so it remains a perfect circle, 
      // rather than stretching into a distorted oval.
      className="h-screen aspect-square object-cover rounded-full border-[2px] border-white/80 shadow-2xl bg-neutral-950 relative draggable"
    />
  );
};

export default WebCam;