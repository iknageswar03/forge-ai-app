"use client"

import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import React, { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import ProfileHeader from '@/components/ui/ProfileHeader'
import NoFitnessPlan from '@/components/ui/NoFitnessPlan'
import CornerElements from '@/components/ui/CornerElements'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DumbbellIcon, CalendarIcon, AppleIcon, Zap, CheckCircle2 } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useUser()
  const userId = user?.id as string;
  const allPlans = useQuery(api.plans.getUserPlans, { userId })
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null)

  const activePlan = allPlans?.find(plan => plan.isActive)
  const currentPlan = selectedPlanId ? allPlans?.find(plan => plan._id === selectedPlanId) : activePlan

  return (
    <div className="relative min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <section className='relative z-10 pt-8 pb-32 grow container mx-auto px-4 max-w-6xl animate-fadeIn'>
        <ProfileHeader user={user} />
        
        {allPlans && allPlans?.length > 0 ? (
          <div className="space-y-12">
            {/* Plan selection UI */}
            <div className="relative glass rounded-3xl p-8 overflow-hidden group">
              <CornerElements />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Zap className="text-primary size-6" />
                    <span>YOUR <span className="text-primary italic">PROTOCOLS</span></span>
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase opacity-60">System Database: {allPlans.length} Records Found</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {allPlans.map((plan) => (
                  <Button
                    key={plan._id}
                    onClick={() => setSelectedPlanId(plan._id)}
                    variant="outline"
                    className={`h-14 px-6 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group/btn ${
                      (selectedPlanId === plan._id || (!selectedPlanId && plan.isActive))
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(24,206,242,0.15)]"
                        : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {plan.name}
                      {plan.isActive && (
                        <CheckCircle2 className="size-4 text-primary animate-pulse" />
                      )}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Current plan details */}
            {currentPlan && (
              <div className="relative glass rounded-[2.5rem] p-1 md:p-2 overflow-hidden shadow-2xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="bg-black/40 rounded-[2.2rem] p-8 md:p-12 relative overflow-hidden">
                  <CornerElements />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Active Analysis</span>
                      </div>
                      <h3 className="text-4xl font-black tracking-tight">
                        PROTOCOL: <span className="text-primary italic uppercase">{currentPlan.name}</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                       <div className="p-3 bg-primary/10 rounded-xl">
                          <Zap className="size-6 text-primary" />
                       </div>
                       <div>
                          <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Intensity</div>
                          <div className="text-lg font-black text-foreground uppercase tracking-tight">High Output</div>
                       </div>
                    </div>
                  </div>

                  <Tabs defaultValue="workout" className="w-full">
                    <TabsList className="mb-10 w-full !h-auto grid grid-cols-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl items-stretch overflow-hidden">
    <TabsTrigger
      value="workout"
      className="flex-1 rounded-xl font-bold py-4 px-2 transition-all 
                 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
                 data-[state=active]:shadow-lg flex items-center justify-center gap-2 
                 text-[10px] sm:text-sm md:text-base min-w-0 !h-full"
    >
      <DumbbellIcon className="size-4 md:size-5 shrink-0" />
      <span className="truncate">Workout Architecture</span>
    </TabsTrigger>

    <TabsTrigger
      value="diet"
      className="flex-1 rounded-xl font-bold py-4 px-2 transition-all 
                 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
                 data-[state=active]:shadow-lg flex items-center justify-center gap-2 
                 text-[10px] sm:text-sm md:text-base min-w-0 !h-full"
    >
      <AppleIcon className="size-4 md:size-5 shrink-0" />
      <span className="truncate">Nutrition Protocol</span>
    </TabsTrigger>
  </TabsList>

                    <TabsContent value="workout" className="space-y-8 animate-fadeIn">
                      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                        <CalendarIcon className="size-5 text-primary" />
                        <span className="font-mono text-sm tracking-tight">
                          <span className="text-muted-foreground uppercase font-bold mr-2">Schedule:</span>
                          <span className="text-primary">{currentPlan.workoutPlan.schedule.join(" • ")}</span>
                        </span>
                      </div>

                      <Accordion type="multiple" className="space-y-4">
                        {currentPlan.workoutPlan.exercises.map((exerciseDay, index) => (
                          <AccordionItem
                            key={index}
                            value={exerciseDay.day}
                            className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors px-4 border-b-0"
                          >
                            <AccordionTrigger className="hover:no-underline py-6 font-black group/acc">
                              <div className="flex justify-between w-full items-center pr-4">
                                <span className="text-xl tracking-tight group-hover/acc:text-primary transition-colors">{exerciseDay.day}</span>
                                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-black/30 px-3 py-1 rounded-full border border-white/5">
                                  {exerciseDay.routines.length} Modules
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {exerciseDay.routines.map((routine, routineIndex) => (
                                  <div
                                    key={routineIndex}
                                    className="border border-white/10 rounded-2xl p-5 bg-black/40 hover:border-primary/30 transition-all group/item"
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <h4 className="text-lg font-bold text-foreground group-hover/item:text-primary transition-colors">
                                        {routine.name}
                                      </h4>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-black tracking-widest border border-primary/20">
                                        {routine.sets} SETS
                                      </div>
                                      <div className="px-3 py-1.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-black tracking-widest border border-white/10">
                                        {routine.reps} REPS
                                      </div>
                                    </div>
                                    {routine.description && (
                                      <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">
                                        "{routine.description}"
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>

                    <TabsContent value="diet" className="space-y-8 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass rounded-3xl p-8 flex flex-col justify-center border-primary/20 bg-primary/5">
                          <span className="font-bold text-[10px] tracking-[0.3em] text-primary uppercase mb-2">Daily Intensity</span>
                          <div className="font-black text-5xl text-foreground tracking-tighter">
                            {currentPlan.dietPlan.dailyCalories} <span className="text-lg text-primary uppercase font-bold tracking-widest">Kcal</span>
                          </div>
                        </div>
                        
                        <div className="glass rounded-3xl p-8 flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                              <AppleIcon className="size-8 text-primary" />
                           </div>
                           <div>
                              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Nutrition Status</div>
                              <div className="text-xl font-black text-foreground uppercase tracking-tight">Optimized</div>
                           </div>
                        </div>
                      </div>

                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentPlan.dietPlan.meals.map((meal, index) => (
                          <div
                            key={index}
                            className="glass rounded-[2rem] overflow-hidden p-6 hover:border-primary/30 transition-all group/meal"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="text-primary font-black text-sm">{String(index + 1).padStart(2, "0")}</span>
                              </div>
                              <h4 className="text-xl font-black tracking-tight group-hover/meal:text-primary transition-colors">{meal.name}</h4>
                            </div>
                            <ul className="space-y-3">
                              {meal.foods.map((food, foodIndex) => (
                                <li
                                  key={foodIndex}
                                  className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5"
                                >
                                  <div className="size-1.5 rounded-full bg-primary/40"></div>
                                  {food}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NoFitnessPlan />
        )}
      </section>
    </div>
  )
}

export default ProfilePage