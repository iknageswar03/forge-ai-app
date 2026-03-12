"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon, MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/generate-program", label: "Generate", icon: DumbbellIcon },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="w-full max-w-6xl bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl py-2 px-4 md:px-6 shadow-2xl shadow-primary/5 pointer-events-auto overflow-visible">
        <div className="flex items-center justify-between gap-4">
          
          {/* LOGO - Added shrink-0 to ensure it never squashes */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-1.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
              <ZapIcon className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">
              FORGE<span className="text-primary">.</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION - Changed from absolute to flex-1 for better stability */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {isSignedIn && navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-primary shrink-0 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={16} className={isActive ? "animate-bounce" : ""} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            {isSignedIn ? (
              <div className="flex items-center gap-2 md:gap-4 pl-2 md:border-l border-white/10">
                <Button
                  asChild
                  variant="ghost"
                  className="hidden sm:flex text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all rounded-xl h-9"
                >
                  <Link href="/generate-program">Get Started</Link>
                </Button>
                
                <div className="flex items-center gap-3">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "size-8 md:size-9 border border-primary/20 hover:border-primary/50 transition-all",
                        userButtonPopoverCard: "mt-2" // Ensures the dropdown doesn't overlap the bar
                      }
                    }}
                  />
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-sm font-medium px-4 h-9">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-primary text-white rounded-xl px-5 h-9 text-sm font-bold">Join</Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {isSignedIn && isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 text-sm font-medium p-3 rounded-xl ${
                  pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
export default Navbar;