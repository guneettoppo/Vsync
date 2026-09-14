/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from "@/components/ui/button";
import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayer = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleHidePlugin = (event: any, payload: any) => {
      console.log(event);
      setIsVisible(payload.state);
    };

    //@ts-ignore
    window.ipcRenderer.on("hide-plugin", handleHidePlugin);

    return () => {
      // Cleanup to prevent memory leaks when window closes
      //@ts-ignore
      if (window.ipcRenderer?.removeListener) {
        //@ts-ignore
        window.ipcRenderer.removeListener("hide-plugin", handleHidePlugin);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        className,
        isVisible && "invisible",
        "flex flex-col h-screen bg-[#09090B] text-neutral-100 rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl font-sans"
      )}
    >
      {/* Sleek App Header with subtle bottom border */}
      <div className="flex justify-between items-center px-4 py-3 bg-white/[0.02] border-b border-white/[0.05] draggable">
        
        {/* Vync Logo & Title */}
        <div className="flex items-center gap-3 non-draggable select-none">
          <img src="/vync-logof.png" alt="Vync logo" className="w-5 h-5 object-contain" />
          <p className="text-[15px] font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Vync
          </p>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-3 non-draggable">
          <div className="hover:scale-105 transition-transform">
            <UserButton 
              appearance={{ 
                elements: { 
                  userButtonAvatarBox: "w-6 h-6 border border-white/10 shadow-sm" 
                } 
              }} 
            />
          </div>
          
          <Button
            onClick={onCloseApp}
            variant="ghost"
            className="p-1.5 h-auto w-auto text-neutral-400 hover:text-white hover:bg-red-500/80 rounded-md transition-all duration-200"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {/* Main Content Space */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default ControlLayer;