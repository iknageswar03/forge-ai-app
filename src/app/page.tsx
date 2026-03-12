import TerminalOverlay from "@/components/ui/TerminalOverlay";
import { Button } from "@/components/ui/button";
import UserPrograms from "@/components/UserPrograms";
import { ArrowRightIcon, Sparkles } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 pt-32 pb-24 flex-grow">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">
            
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-10 relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fadeIn">
                <Sparkles className="size-4 text-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">The Future of Fitness</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
                Forge Your <br />
                <span className="text-primary italic">Ultimate</span> Body <br />
                With AI.
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                The elite AI-powered workout architect. Transform your physics with hyper-personalized 
                training and nutrition protocols built for the 1%.
              </p>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-8 py-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-foreground">500+</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Athletes</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-foreground">180s</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Synthesis</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-foreground">100%</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Custom</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                <Button
                  size="lg"
                  asChild
                  className="h-16 px-10 text-lg font-bold bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 rounded-2xl group"
                >
                  <Link href={"/generate-program"} className="flex items-center">
                    Start Your Transformation
                    <ArrowRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-16 px-10 text-lg font-bold border-white/10 hover:bg-white/5 rounded-2xl"
                >
                  <Link href="#gallery">Browse Protocols</Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="relative aspect-[4/5] max-w-lg mx-auto">
                {/* GLASS CONTAINER */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-[2.5rem] -rotate-3 transition-transform hover:rotate-0 duration-700"></div>
                
                <div className="relative h-full overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-black/50 border border-white/5 group">
                  <img
                    src="./hero-ai4.png"
                    alt="Forge AI Athlete"
                    className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* SCAN LINE - REFINED */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-20 w-full animate-scanline pointer-events-none" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* TERMINAL OVERLAY */}
                  <TerminalOverlay/>
                </div>

                {/* DECORATIVE ELEMENTS */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 blur-3xl rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="gallery">
        <UserPrograms />
      </div>
    </div>
  );
};
export default HomePage;