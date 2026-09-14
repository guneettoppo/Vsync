import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // commented out per request
import { UserButton } from "@clerk/nextjs";
// import { Search } from "lucide-react"; // commented out per request
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadLatestDesktopApp } from "@/lib/utils";

const InfoBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="pl-20 md:pl-[265px] fixed top-0 w-full p-4 flex items-center justify-between gap-4 z-50">
        {/* Search Bar (commented out) 
        <div className="flex gap-3 justify-center items-center bg-[#1A1A1D] border border-[#27272A] rounded-full px-4 py-1 w-full max-w-lg transition-all focus-within:border-[#3F3F46]">
          <Search size={18} className="text-zinc-400" />
          <Input
            className="bg-transparent border-none text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
            placeholder="Search for people, projects, tags & folders"
          />
        </div>
        */}

        {/* Invisible placeholder to preserve header spacing when search is commented */}
        <div className="invisible w-full max-w-lg" aria-hidden="true" />

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pr-4">
          <Button
            onClick={() => setOpen(true)}
            variant="secondary"
            className="bg-[#27272A] hover:bg-[#3F3F46] text-zinc-200 rounded-full flex items-center gap-2 h-10 px-4 transition-colors border-none"
          >
            {/* CSS override to force the custom icon to be light-colored */}
            <div className="flex items-center justify-center [&_path]:fill-zinc-200 [&_path]:stroke-zinc-200 [&_rect]:fill-zinc-200">
              <VideoRecorderIcon />
            </div>
            <span>Record</span>
          </Button>

          <div className="flex items-center justify-center h-10 w-10">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Download Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border border-[#27272A] text-zinc-200 sm:max-w-md shadow-2xl p-6 sm:rounded-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center gap-1 mb-2">
            {/* Applied the same CSS override here so the badge icon is visible */}
            <div className="bg-[#27272A] p-3 rounded-full mb-3 flex items-center justify-center ring-4 ring-[#1A1A1D] [&_path]:fill-zinc-200 [&_path]:stroke-zinc-200 [&_rect]:fill-zinc-200">
              <VideoRecorderIcon />
            </div>

            <DialogTitle className="text-zinc-100 text-xl font-semibold tracking-tight">
              Vync Desktop Required
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-[15px] leading-relaxed max-w-[90%] text-center mx-auto">
              To capture your screen smoothly and securely, you'll need our
              dedicated desktop application.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <div className="bg-[#1A1A1D] border border-[#27272A] p-4 rounded-xl text-sm text-zinc-400 leading-relaxed text-center">
              <span className="font-medium text-zinc-200 block mb-1">
                Already installed?
              </span>
              Launch Vync directly from your computer's Start Menu to begin
              recording.
            </div>

            <Button
              onClick={downloadLatestDesktopApp}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 w-full rounded-full h-11 text-[15px] font-semibold transition-all"
            >
              Download for Windows
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoBar;
