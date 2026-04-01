import React from 'react'
import {UserResource} from "@clerk/types"
import CornerElements from './CornerElements'
import { Sparkles } from 'lucide-react';


const ProfileHeader = ({user}:{user:UserResource | null | undefined}) => {
    if(!user) return null;

  return (
    <div className='mb-12 relative glass rounded-[2rem] p-8 md:p-10 overflow-hidden group'>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700"></div>
        <CornerElements/>
        
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 relative z-10">
        <div className="relative group/avatar">
          {user.imageUrl ? (
            <div className="relative w-32 h-32 overflow-hidden rounded-2xl border-2 border-white/10 group-hover/avatar:border-primary/50 transition-colors duration-500 shadow-2xl">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/10">
              <span className="text-4xl font-black text-primary">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-background border-2 border-white/10 flex items-center justify-center shadow-lg">
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="size-3 text-primary" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Elite Athlete Profile</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                {user.firstName} <span className="text-primary italic">{user.lastName}</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm tracking-wider flex items-center justify-center md:justify-start gap-2">
                <span className="w-4 h-px bg-white/20"></span>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-1">
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-50">Status</div>
              <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-3 shadow-[0_0_10px_rgba(24,206,242,0.5)]"></div>
                <p className="text-xs font-black tracking-widest text-primary uppercase">Active Protocol</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader