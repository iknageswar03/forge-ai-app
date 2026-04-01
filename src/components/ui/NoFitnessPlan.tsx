import Link from "next/link";
import CornerElements from "./CornerElements";
import {Button} from "@/components/ui/button";
import { ArrowRightIcon, Zap } from "lucide-react";

const NoFitnessPlan = () => {
  return (
    <div className="relative glass rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden group">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10 animate-pulse"></div>
      <CornerElements />

      <div className="mb-8 flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(24,206,242,0.1)] group-hover:scale-110 transition-transform duration-500">
           <Zap className="size-10 text-primary" />
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
        SYSTEM <span className="text-primary italic">VACANT</span>
      </h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
        No active training protocols detected. Initialize your transformation by generating a 
        hyper-personalized fitness and nutrition architecture.
      </p>
      
      <Button
        size="lg"
        asChild
        className="h-16 px-10 text-lg font-black bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 rounded-2xl group/btn"
      >
        <Link href="/generate-program">
          <span className="relative flex items-center gap-2">
            Initialize First Protocol
            <ArrowRightIcon className="size-5 transition-transform group-hover/btn:translate-x-1" />
          </span>
        </Link>
      </Button>
    </div>
  );
};
export default NoFitnessPlan;