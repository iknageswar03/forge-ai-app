import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  AppleIcon,
  ShieldIcon,
  ZapIcon,
  ArrowRight,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants/constants";

const UserPrograms = () => {
  return (
    <div className="w-full pb-32 pt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl px-6">
        {/* HEADER SECTION */}
        <div className="relative mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-[10px] font-black tracking-widest uppercase text-primary">Protocol Gallery</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                AI Synthesis <br />
                <span className="text-muted-foreground">Recent Success.</span>
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Real-world results from our advanced fitness architect. Explore 
              the protocols generated for our elite athletes.
            </p>
          </div>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USER_PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden rounded-[2rem] flex flex-col h-full"
            >
              <CardHeader className="p-0">
                {/* User Image & Badge */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={program.profilePic}
                    alt={`${program.first_name}`}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white">
                      {program.fitness_level}
                    </div>
                  </div>
                </div>

                <div className="px-6 -mt-12 relative z-10">
                  <div className="bg-background/90 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-2xl">
                    <CardTitle className="text-xl font-black tracking-tight text-foreground flex items-center justify-between">
                      {program.first_name}
                      <span className="text-primary text-[10px] font-mono opacity-50">ID:00{program.id}</span>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Users className="size-3 text-primary" /> {program.age}Y
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Clock className="size-3 text-primary" /> {program.workout_days}D/WK
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-6 flex-grow space-y-6">
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="size-3" />
                    {program.fitness_goal}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 group/item">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover/item:border-primary/30 transition-colors">
                      <Dumbbell className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-none">{program.workout_plan.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Movement Protocol</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group/item">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover/item:border-primary/30 transition-colors">
                      <AppleIcon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-none">{program.diet_plan.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Nutrition Protocol</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic">
                    "{program.workout_plan.description}"
                  </p>
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0">
                <Link href={`/programs/${program.id}`} className="w-full">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-xl font-bold h-12 group/btn transition-all duration-300">
                    Review Protocol
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full"></div>
          <div className="relative bg-background/40 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] text-center max-w-4xl mx-auto overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ZapIcon className="size-32 text-primary" />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Ready for your own <br />
              <span className="text-primary italic">Synthesis?</span>
            </h3>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join 500+ elite athletes who have transformed their physics 
              using our advanced AI protocols.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-16 px-10 text-lg font-bold bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 rounded-2xl"
              >
                <Link href="/generate-program">
                  Initialize Program
                  <Sparkles className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPrograms;