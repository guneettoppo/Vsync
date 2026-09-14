"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Changed to usePathname
import { 
  Sparkles, 
  Video, 
  FolderOpen, 
  ArrowRight,
  Share2,
  Bot,
  MonitorPlay,
  Users,
  LayoutGrid,
  Activity
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VideoRecorderIcon from "@/components/icons/video-recorder";
import { downloadLatestDesktopApp } from "@/lib/utils";

const Home = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Grabs the current URL (e.g., /dashboard/workspace-123/home)

  // Safely strips '/home' from the end of the URL to route directly to 'My Library'
  const libraryUrl = pathname?.endsWith("/home") 
    ? pathname.replace("/home", "") 
    : pathname;


  return (
    <div className="flex flex-col gap-10 pb-10 max-w-6xl w-full">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#27272A] bg-gradient-to-br from-[#1A1A1D] via-[#121214] to-[#09090B] p-10 sm:p-14 shadow-2xl">
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#9D4EDD]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6 w-max px-3 py-1.5 rounded-full bg-[#9D4EDD]/10 border border-[#9D4EDD]/20">
            <Sparkles className="text-[#9D4EDD]" size={16} />
            <span className="text-[#E0AAFF] text-sm font-medium tracking-wide">
              Welcome to your workspace
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-zinc-100 leading-[1.1] tracking-tight">
            Replace meetings with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#C77DFF]">
              async video.
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed">
            Stop typing long emails. Record your screen, share your ideas instantly, 
            and let AI write the summary. Everything you need for seamless communication.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <button 
              onClick={() => setOpen(true)}
              className="bg-[#9D4EDD] hover:bg-[#7B2CBF] transition-all px-7 py-3.5 rounded-full text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#9D4EDD]/20 hover:shadow-[#9D4EDD]/40"
            >
              Start Recording
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-zinc-100 text-xl font-semibold mb-5 px-1 tracking-tight">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div 
            onClick={() => setOpen(true)}
            className="group bg-[#1A1A1D] border border-[#27272A] rounded-3xl p-7 hover:border-[#9D4EDD]/40 hover:bg-[#1A1A1D]/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#9D4EDD]/5"
          >
            <div className="bg-[#27272A] w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#9D4EDD]/20 group-hover:scale-110 transition-all duration-300">
              <Video className="text-zinc-300 group-hover:text-[#9D4EDD] transition-colors" size={24} />
            </div>
            <h3 className="text-zinc-100 font-semibold text-lg mb-2">
              New Recording
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Capture your screen, camera, and microphone instantly with our lightweight desktop app.
            </p>
          </div>

          {/* Corrected Routing: Relies on the bulletproof libraryUrl calculation */}
          <Link 
            href={libraryUrl}
            className="block group bg-[#1A1A1D] border border-[#27272A] rounded-3xl p-7 hover:border-[#9D4EDD]/40 hover:bg-[#1A1A1D]/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#9D4EDD]/5"
          >
            <div className="bg-[#27272A] w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#9D4EDD]/20 group-hover:scale-110 transition-all duration-300">
              <FolderOpen className="text-zinc-300 group-hover:text-[#9D4EDD] transition-colors" size={24} />
            </div>
            <h3 className="text-zinc-100 font-semibold text-lg mb-2">
              Create Folder
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Keep your workspace clutter-free. Organize your videos by project, team, or topic.
            </p>
          </Link>
        </div>
      </div>

      {/* Upgraded Features Grid */}
      <div>
        <h2 className="text-zinc-100 text-xl font-semibold mb-5 px-1 tracking-tight">
          Everything you need
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard 
            icon={<MonitorPlay size={20} />} 
            title="HD Screen Recording" 
            desc="Crystal clear capture of your screen and camera."
          />
          <FeatureCard 
            icon={<Share2 size={20} />} 
            title="Instant Sharing" 
            desc="Get a shareable link the second you stop recording."
          />
          <FeatureCard 
            icon={<Bot size={20} />} 
            title="AI Summaries" 
            desc="Automatic transcripts and key takeaways."
          />
          <FeatureCard 
            icon={<LayoutGrid size={20} />} 
            title="Smart Organization" 
            desc="Group your content into dedicated workspaces."
          />
          <FeatureCard 
            icon={<Users size={20} />} 
            title="Team Collaboration" 
            desc="Leave comments and feedback on timestamps."
          />
          <FeatureCard 
            icon={<Activity size={20} />} 
            title="Viewer Analytics" 
            desc="See exactly who watched your video and for how long."
          />
        </div>
      </div>

      {/* Motivation Card */}
      <div className="rounded-3xl border border-[#9D4EDD]/20 bg-gradient-to-r from-[#9D4EDD]/10 to-transparent p-8 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-[#C77DFF] font-semibold text-sm tracking-wide uppercase mb-2">
            Pro Tip
          </p>
          <h3 className="text-xl text-zinc-100 font-semibold mb-1">
            Great communication scales great teams.
          </h3>
          <p className="text-zinc-400 text-sm">
            Record once, share everywhere, and keep everyone perfectly aligned without the extra meetings.
          </p>
        </div>
      </div>

      {/* Download Dialog Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border border-[#27272A] text-zinc-200 sm:max-w-md shadow-2xl p-6 sm:rounded-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center gap-1 mb-2">
            <div className="bg-[#27272A] p-3 rounded-full mb-3 flex items-center justify-center ring-4 ring-[#1A1A1D] [&_path]:fill-zinc-200 [&_path]:stroke-zinc-200 [&_rect]:fill-zinc-200">
              <VideoRecorderIcon />
            </div>
            <DialogTitle className="text-zinc-100 text-xl font-semibold tracking-tight">
              Vync Desktop Required
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-[15px] leading-relaxed max-w-[90%] text-center mx-auto">
              To capture your screen smoothly and securely, you'll need our dedicated desktop application.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <div className="bg-[#1A1A1D] border border-[#27272A] p-4 rounded-xl text-sm text-zinc-400 leading-relaxed text-center">
              <span className="font-medium text-zinc-200 block mb-1">Already installed?</span> 
              Launch Vync directly from your computer's Start Menu to begin recording.
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

    </div>
  );
};

// Reusable mini-component for the features to keep the code clean
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-start gap-4 bg-[#1A1A1D] border border-[#27272A] p-5 rounded-2xl">
    <div className="p-2.5 bg-[#27272A] rounded-xl text-zinc-300">
      {icon}
    </div>
    <div>
      <h4 className="text-zinc-200 font-medium text-[15px] mb-1">{title}</h4>
      <p className="text-zinc-500 text-sm leading-snug">{desc}</p>
    </div>
  </div>
);

export default Home;