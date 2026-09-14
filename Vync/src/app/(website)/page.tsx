import Image from "next/image";
import {
  Play,
  Sparkles,
  Monitor,
  Users,
  CheckCircle2,
  ArrowRight,
  Video,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI Powered Video Collaboration
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mt-4 leading-[1.1] tracking-tight">
              Record,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                Share &
              </span>
              <br />
              Analyze Videos
            </h1>

            <p className="text-zinc-400 mt-6 text-lg lg:text-xl max-w-lg leading-relaxed">
              Create professional recordings, collaborate seamlessly with your
              team, and extract actionable AI-powered insights from every single
              video.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/auth/sign-in">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors px-8 py-4 rounded-full font-medium shadow-lg shadow-purple-500/25">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              </Link>

              <button className="flex items-center gap-2 bg-transparent hover:bg-zinc-900 border border-zinc-800 transition-colors px-8 py-4 rounded-full font-medium">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Mockup */}
          <div className="relative z-10 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl backdrop-blur-sm">
            {/* Mockup Header */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs text-red-500 font-semibold tracking-wider">
                  LIVE 02:14
                </span>
              </div>
            </div>

            {/* Screen Preview */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <Image
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                width={700}
                height={400}
                className="w-full object-cover opacity-90"
              />

              {/* Floating Webcam Overlay */}
              <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 transition-transform hover:scale-105 cursor-pointer">
                <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border-4 border-purple-600 overflow-hidden shadow-2xl">
                  <Image
                    src="/webcamLand.png"
                    alt="Webcam"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Mockup Controls */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-red-500 hover:bg-red-600 transition-colors px-6 py-2 rounded-full text-sm font-medium">
                Stop Recording
              </button>
              <button className="bg-white text-black hover:bg-zinc-200 transition-colors px-6 py-2 rounded-full text-sm font-medium">
                Share Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-900">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                10K+
              </h2>
              <p className="text-zinc-500 mt-2 font-medium">Videos Recorded</p>
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                5K+
              </h2>
              <p className="text-zinc-500 mt-2 font-medium">Active Users</p>
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                500+
              </h2>
              <p className="text-zinc-500 mt-2 font-medium">Teams</p>
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                99.9%
              </h2>
              <p className="text-zinc-500 mt-2 font-medium">Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Everything You Need
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">
            Powerful features designed to help you communicate faster, clearer,
            and with more context.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-colors rounded-3xl p-8 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Screen Recording</h3>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Capture your screen, camera, and microphone in up to 4K quality
              with a single click. No limits.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-colors rounded-3xl p-8 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">AI Summaries</h3>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Automatically generate titles, chapters, summaries, and action
              items from your recordings.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-colors rounded-3xl p-8 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Team Workspaces</h3>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Organize content into folders, collaborate with comments, and
              manage viewer permissions easily.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">
            Start for free, upgrade when you need more power.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Free Tier */}
          <div className="border border-zinc-800 bg-zinc-900/30 rounded-3xl p-8 lg:p-10">
            <h3 className="text-2xl font-bold">Starter</h3>
            <p className="text-zinc-400 mt-2">
              For individuals just getting started.
            </p>
            <div className="my-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-zinc-500">/mo</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-zinc-500" /> Up to 25
                videos
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-zinc-500" /> 5 min
                recording limit
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-zinc-500" /> 720p video
                quality
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl font-semibold border border-zinc-700 hover:bg-zinc-800 transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="relative bg-gradient-to-b from-purple-600 to-purple-900 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-purple-500/20 border border-purple-500">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <p className="text-purple-200 mt-2">
              For professionals and growing teams.
            </p>
            <div className="my-6">
              <span className="text-5xl font-bold text-white">$99</span>
              <span className="text-purple-300">/year</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-purple-300" /> Unlimited
                videos
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-purple-300" /> Unlimited
                recording length
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-purple-300" /> 4K video
                quality & Downloads
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-purple-300" /> AI Titles,
                Summaries & Chapters
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl font-semibold bg-white text-purple-900 hover:bg-zinc-100 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="font-bold text-xl tracking-tight">Vync</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>

          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Vync Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
