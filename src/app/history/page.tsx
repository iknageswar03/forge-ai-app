"use client"

import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../convex/_generated/api'
import { Activity, Clock, CalendarDays, CheckCircle2 } from 'lucide-react'

export default function HistoryPage() {
  const { user } = useUser();
  const userId = user?.id;

  const logs = useQuery(api.workoutLogs.getUserLogs, userId ? { userId } : "skip");

  const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-32 text-center animate-fadeIn">
         <div className="glass max-w-md mx-auto p-12 rounded-[3rem] border border-white/10 shadow-2xl bg-black/40">
            <Activity className="size-16 text-primary/50 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Access Denied</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest leading-relaxed">Please initialize user session to access your workout logs.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-12 animate-fadeIn relative z-10">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="space-y-4">
        <h1 className="flex items-center gap-4 text-5xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-md">
          <Activity className="text-primary size-12 md:size-16 drop-shadow-[0_0_15px_rgba(24,206,242,0.5)]" />
          <span>Execution <span className="text-primary italic">Logs</span></span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm tracking-[0.2em] uppercase opacity-60">Historical data of all executed training protocols.</p>
      </div>

      <div className="space-y-8 relative">
        <div className="absolute top-8 bottom-0 left-[27px] w-0.5 bg-gradient-to-b from-primary/30 via-white/10 to-transparent -z-10 hidden md:block"></div>

        {logs === undefined && (
          <div className="py-24 text-center flex flex-col items-center gap-6 glass rounded-[3rem] border border-white/5 bg-black/40">
            <div className="size-16 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
            <p className="text-primary font-mono tracking-widest font-black text-sm">FETCHING DATABASE...</p>
          </div>
        )}

        {logs && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 md:p-24 glass rounded-[3rem] text-center space-y-6 border border-white/10 shadow-2xl bg-black/40">
            <Activity className="size-20 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground font-black tracking-widest text-xl uppercase z-10 drop-shadow-md">No Records Found</p>
            <p className="text-sm text-foreground/50 max-w-sm font-mono leading-relaxed z-10">Execute a training protocol in the Tracker to verify logging.</p>
          </div>
        )}

        {logs && logs.map((log: any, index: number) => (
          <div key={log._id} className="relative glass rounded-[2.5rem] p-6 md:p-8 hover:border-primary/30 bg-black/40 transition-all duration-300 group overflow-hidden shadow-2xl animate-fadeIn ml-0 md:ml-16" style={{animationDelay: `${index * 0.1}s`}}>
              {/* Timeline Connector */}
              <div className="absolute top-1/2 -left-16 w-16 h-0.5 bg-primary/20 hidden md:block"></div>
              <div className="absolute top-1/2 -translate-y-1/2 -left-[68px] w-3 h-3 rounded-full bg-primary/50 shadow-[0_0_10px_rgba(24,206,242,1)] hidden md:block"></div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-700 delay-100"></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                 <div className="space-y-2">
                     <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold tracking-widest text-primary uppercase">
                         <span className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                             <CalendarDays className="size-3" /> {formatDate(log.completedAt || log.date)}
                         </span>
                         <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-muted-foreground px-3 py-1.5 rounded-xl">
                             <Clock className="size-3" /> {formatTime(log.completedAt || log.date)}
                         </span>
                     </div>
                     <h3 className="text-2xl font-black tracking-tight uppercase text-white drop-shadow-sm pt-2">
                         {log.routineId ? "PROTOCOL DEPLOYMENT" : "AD-HOC DEPLOYMENT"}
                     </h3>
                     {log.duration && (
                         <p className="text-sm tracking-widest font-mono text-muted-foreground uppercase glass inline-flex px-3 py-1 rounded-full border border-white/5 border-t-white/10 border-l-white/10 shadow-[inset_0_1px_rgba(255,255,255,0.05)] mt-4">
                             Duration: {log.duration} MINS
                         </p>
                     )}
                 </div>
              </div>

              <div className="space-y-4 relative z-10 w-full mt-6">
                 <details className="group bg-white/5 border border-white/10 rounded-2xl open:bg-black/40 transition-all duration-300">
                     <summary className="flex items-center justify-between p-4 md:p-6 cursor-pointer list-none font-black text-xs md:text-sm tracking-[0.2em] text-primary uppercase select-none group-open:border-b border-white/10">
                         <span>View Detailed Telemetry</span>
                         <span className="text-white text-2xl font-mono leading-none group-open:rotate-45 transition-transform origin-center duration-300 flex items-center justify-center">+</span>
                     </summary>
                     <div className="p-4 md:p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                        {log.exercises.map((ex: any, exIdx: number) => (
                            <div key={exIdx} className="bg-black/60 rounded-2xl p-4 md:p-6 border border-white/5 hover:border-white/10 transition-colors shadow-inner">
                                <h4 className="text-xl font-black italic tracking-tight uppercase text-white/90 mb-4">{ex.name}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {ex.completedSets.map((set: any, sIdx: number) => (
                                        <div key={sIdx} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-black text-muted-foreground opacity-60">S{String(sIdx + 1).padStart(2, '0')}</span>
                                                <span className="font-bold text-sm tracking-widest text-primary uppercase">{set.weight || '--'} KG</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-base text-white">{set.reps} <span className="text-[10px] text-muted-foreground tracking-widest">R</span></span>
                                                {set.completed && <CheckCircle2 className="size-4 text-primary" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                     </div>
                 </details>
              </div>
          </div>
        ))}

      </div>
    </div>
  )
}
