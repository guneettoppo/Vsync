"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Extract links into an easily manageable array
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const LandingPageNavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full justify-between items-center py-4 px-6 max-w-7xl mx-auto">
      {/* Left Section */}
      <div className="text-3xl font-bold tracking-tight flex items-center gap-x-3">
        <button className="p-2 -ml-2 hover:bg-zinc-900 rounded-lg transition-colors lg:hidden">
          <Menu className="w-8 h-8" />
        </button>

        <Link href="/" className="flex items-center gap-x-3">
          <Image
            alt="Vync logo"
            src="/vync-logof.png"
            width={40}
            height={40}
            className="w-auto h-auto"
            priority
          />
          Vync
        </Link>
      </div>

      {/* Center Section: Mapped Links with Active States */}
      <div className="hidden lg:flex items-center gap-x-4">
        {NAV_LINKS.map((link) => {
          // 2. Check if the current link is active
          // Note: If you move Pricing/Contact to separate pages later (e.g., "/pricing"),
          // this will automatically highlight them!
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`py-2 px-6 font-semibold text-base rounded-full transition-all ${
                isActive
                  ? "bg-[#7320DD] hover:bg-[#7320DD]/80 shadow-lg shadow-purple-500/20 text-white"
                  : "text-zinc-400 hover:text-white font-medium hover:bg-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <Link href="/auth/sign-in">
        <Button className="text-base flex items-center gap-x-2 bg-white text-black hover:bg-zinc-200 rounded-full px-6 h-11 transition-colors">
          <User className="w-4 h-4" fill="#000" />
          Login
        </Button>
      </Link>
    </nav>
  );
};

export default LandingPageNavBar;
