import { ZapIcon } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-background/50 backdrop-blur-xl pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
                <ZapIcon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">
                FORGE<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Empowering your fitness journey with cutting-edge AI technology. 
              Build the strongest version of yourself with personalized plans 
              designed for your unique goals.
            </p>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Systems fully operational
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4">
            <h4 className="text-foreground font-bold text-sm tracking-widest uppercase">Platform</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">How it works</Link>
              <Link href="/generate-program" className="text-muted-foreground hover:text-primary text-sm transition-colors">Program Generator</Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">Premium</Link>
              <Link href="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">Fitness Insights</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground font-bold text-sm tracking-widest uppercase">Support</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/help" className="text-muted-foreground hover:text-primary text-sm transition-colors">Help Center</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Us</Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Forge AI. Built for the elite.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground/60 hover:text-primary text-xs transition-colors underline-offset-4 hover:underline">Twitter</a>
            <a href="#" className="text-muted-foreground/60 hover:text-primary text-xs transition-colors underline-offset-4 hover:underline">Instagram</a>
            <a href="#" className="text-muted-foreground/60 hover:text-primary text-xs transition-colors underline-offset-4 hover:underline">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
