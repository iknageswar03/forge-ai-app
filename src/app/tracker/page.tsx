"use client"

import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import React, { useState, useEffect, useRef } from 'react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Play, Timer, ArrowLeft, Dumbbell, Save, Plus, Trash2, Edit2, X, Volume2, Settings2 } from 'lucide-react'

export default function TrackerPage() {
  const { user } = useUser();
  const userId = user?.id;

  const routines = useQuery(api.routines.getUserRoutines, userId ? { userId } : "skip");
  const saveLog = useMutation(api.workoutLogs.saveLog);
  const updateRoutine = useMutation(api.routines.updateRoutine);
  const createRoutine = useMutation(api.routines.createRoutine);
  const deleteRoutineMutation = useMutation(api.routines.deleteRoutine);
  const renameRoutineMutation = useMutation(api.routines.renameRoutine);

  // --- Tracking State ---
  const [activeRoutine, setActiveRoutine] = useState<any>(null);
  const [activeWorkoutData, setActiveWorkoutData] = useState<any>({});
  
  // --- Editing State ---
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [editingWorkoutData, setEditingWorkoutData] = useState<any>({});
  
  const isEditingMode = !!editingRoutine;
  const currentRoutine = isEditingMode ? editingRoutine : activeRoutine;
  const currentData = isEditingMode ? editingWorkoutData : activeWorkoutData;
  const setCurrentRoutine = isEditingMode ? setEditingRoutine : setActiveRoutine;
  const setCurrentData = isEditingMode ? setEditingWorkoutData : setActiveWorkoutData;

  const [startTime, setStartTime] = useState<number | null>(null);

  // Modal / State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [exercisesToSave, setExercisesToSave] = useState<any>([]);
  const [durationMins, setDurationMins] = useState(0);

  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  
  // Dashboard Rename state
  const [renamingRoutineId, setRenamingRoutineId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  // Rest Timer State
  const [autoRestEnabled, setAutoRestEnabled] = useState(false);
  const [restDuration, setRestDuration] = useState(60); 
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
      
      oscillator.start(audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      oscillator.stop(audioCtx.currentTime + 0.5);
      
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } catch (e) {
      console.log("Audio play failed");
    }
  };

  useEffect(() => {
     if (isTimerActive && timeLeft !== null && timeLeft > 0) {
         timerRef.current = setTimeout(() => {
             setTimeLeft(timeLeft - 1);
         }, 1000);
     } else if (isTimerActive && timeLeft === 0) {
         playBeep();
         setIsTimerActive(false);
         setTimeout(() => setTimeLeft(null), 3000);
     }
     
     return () => {
         if (timerRef.current) clearTimeout(timerRef.current);
     };
  }, [timeLeft, isTimerActive]);

  const startRestTimer = () => {
      setTimeLeft(restDuration);
      setIsTimerActive(true);
  };
  
  const stopRestTimer = () => {
      setIsTimerActive(false);
      setTimeLeft(null);
  };

  const handleDeleteRoutine = async (routineId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this protocol? This cannot be undone.")) {
          try {
             await deleteRoutineMutation({ routineId: routineId as any, userId: userId! });
          } catch (err) {
             console.error(err);
             alert("Failed to delete routine.");
          }
      }
  };

  const handleStartRename = (routine: any, e: React.MouseEvent) => {
      e.stopPropagation();
      setRenamingRoutineId(routine._id);
      setRenameText(routine.name);
  };

  const handleSaveRename = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!renamingRoutineId || !renameText.trim()) return;
      
      try {
          await renameRoutineMutation({ 
              routineId: renamingRoutineId as any, 
              userId: userId!, 
              name: renameText.trim() 
          });
          setRenamingRoutineId(null);
      } catch (err) {
          console.error(err);
          alert("Failed to rename routine.");
      }
  };

  const getInitialStateContent = (routine: any) => {
    const initialState: any = {};
    routine.exercises.forEach((ex: any, ei: number) => {
      initialState[ei] = {};
      if (ex.detailedSets && ex.detailedSets.length > 0) {
          ex.detailedSets.forEach((dSet: any, sIdx: number) => {
              initialState[ei][sIdx] = { reps: dSet.reps, weight: dSet.weight, completed: false };
          });
      } else {
          const setsCount = ex.sets || 3;
          for (let i = 0; i < setsCount; i++) {
            initialState[ei][i] = { reps: ex.reps || 0, weight: "", completed: false };
          }
      }
    });
    return initialState;
  };

  const startWorkout = (routine: any) => {
    if (renamingRoutineId) return;
    setActiveRoutine(JSON.parse(JSON.stringify(routine)));
    setStartTime(Date.now());
    setTimeLeft(null);
    setIsTimerActive(false);
    setActiveWorkoutData(getInitialStateContent(routine));
  };

  const startEditing = (routine: any) => {
    if (renamingRoutineId) return;
    setEditingRoutine(JSON.parse(JSON.stringify(routine)));
    setEditingWorkoutData(getInitialStateContent(routine));
  };

  const addExercise = () => {
    const newEx = { name: "New Exercise", sets: 1, reps: 0, description: "" };
    setCurrentRoutine((prev: any) => ({
      ...prev,
      exercises: [...prev.exercises, newEx]
    }));
    setCurrentData((prev: any) => ({
      ...prev,
      [currentRoutine.exercises.length]: {
        0: { reps: 0, weight: "", completed: false }
      }
    }));
  };

  const removeExercise = (eIndex: number) => {
      if (window.confirm("Remove this exercise and all its sets permanently from this module?")) {
          setCurrentRoutine((prev: any) => {
              const newExs = [...prev.exercises];
              newExs.splice(eIndex, 1);
              return { ...prev, exercises: newExs };
          });
          setCurrentData((prev: any) => {
              const newData: any = {};
              let newIdx = 0;
              for (let i = 0; i <= Object.keys(prev).length; i++) {
                  if (i === eIndex) continue;
                  if (prev[i] !== undefined) {
                      newData[newIdx++] = prev[i];
                  }
              }
              return newData;
          });
      }
  };

  const updateExerciseName = (eIndex: number, newName: string) => {
      setCurrentRoutine((prev: any) => {
          const newExs = [...prev.exercises];
          newExs[eIndex].name = newName;
          return { ...prev, exercises: newExs };
      });
  };

  const addSet = (eIndex: number) => {
    const currentKeys = Object.keys(currentData[eIndex] || {}).map(Number);
    const newIndex = currentKeys.length > 0 ? Math.max(...currentKeys) + 1 : 0;
    
    setCurrentData((prev: any) => ({
      ...prev,
      [eIndex]: {
        ...prev[eIndex],
        [newIndex]: { reps: 0, weight: "", completed: false }
      }
    }));
  };

  const removeSet = (eIndex: number, sIndex: number) => {
    setCurrentData((prev: any) => {
       const newSets = { ...prev[eIndex] };
       delete newSets[sIndex];
       
       const reindexed: any = {};
       let counter = 0;
       Object.keys(newSets).sort((a,b) => parseInt(a)-parseInt(b)).forEach(k => {
          reindexed[counter++] = newSets[k];
       });

       return {
         ...prev,
         [eIndex]: reindexed
       };
    });
  };

  const updateSet = (eIndex: number, sIndex: number, field: string, value: any) => {
    setCurrentData((prev: any) => {
      const wasCompleted = prev[eIndex]?.[sIndex]?.completed;
      const isCompletedNow = field === 'completed' ? value : wasCompleted;
      
      if (!isEditingMode && field === 'completed' && value === true && !wasCompleted && autoRestEnabled) {
          startRestTimer();
      }

      return {
        ...prev,
        [eIndex]: {
          ...prev[eIndex],
          [sIndex]: {
            ...prev[eIndex][sIndex],
            [field]: value
          }
        }
      };
    });
  };

  const handleCreateRoutineSubmit = async () => {
      if (!newRoutineName) return;
      const newId = await createRoutine({
          userId: userId!,
          name: newRoutineName,
          exercises: []
      });
      setIsCreatingRoutine(false);
      setNewRoutineName("");
      // Push instantly into Editor Mode
      setEditingRoutine({ _id: newId, name: newRoutineName, exercises: [] });
      setEditingWorkoutData({});
  };

  const handleEditorSave = async () => {
      if (!userId || !editingRoutine) return;
      // Build updated exercises mapping from Editor
      const updatedExercises = editingRoutine.exercises.map((ex: any, ei: number) => {
          const setsObj = editingWorkoutData[ei] || {};
          const detailedSets = Object.keys(setsObj).map(k => ({
              reps: setsObj[k].reps || 0,
              weight: setsObj[k].weight || ""
          }));
          return {
              name: ex.name,
              sets: detailedSets.length,
              reps: detailedSets.length > 0 ? detailedSets[0].reps : 0,
              description: ex.description,
              detailedSets: detailedSets
          };
      });

      try {
          await updateRoutine({
              routineId: editingRoutine._id,
              userId,
              exercises: updatedExercises
          });
          setEditingRoutine(null);
          setEditingWorkoutData({});
          alert("Master layout updated.");
      } catch (err) {
          console.error(err);
          alert("Failed to construct Master Layout.");
      }
  };

  const handleTrackerPreFinish = () => {
    if (!startTime) return;
    const duration = Math.floor((Date.now() - startTime) / 60000);
    setDurationMins(duration);
    
    const completedLog = activeRoutine.exercises.map((ex: any, ei: number) => {
      const setsObj = activeWorkoutData[ei] || {};
      const setsArray = Object.keys(setsObj).map(k => setsObj[k]);
      return {
         name: ex.name,
         completedSets: setsArray.filter((s: any) => s.completed)
      };
    }).filter((ex: any) => ex.completedSets.length > 0);

    if (completedLog.length === 0) {
      alert("No sets completed! Please complete at least one set to save the workout.");
      return;
    }

    setExercisesToSave(completedLog);
    setShowCompletionModal(true);
  };

  const finalizeTrackerWorkout = async (saveToMaster: boolean) => {
    if (!userId || !activeRoutine) return;

    try {
        await saveLog({
            userId,
            routineId: activeRoutine._id,
            date: new Date().toISOString(),
            duration: durationMins,
            exercises: exercisesToSave,
            notes: "",
            isCompleted: true,
            completedAt: new Date().toISOString()
        });

        if (saveToMaster) {
            const updatedExercises = activeRoutine.exercises.map((ex: any, ei: number) => {
                const setsObj = activeWorkoutData[ei] || {};
                const detailedSets = Object.keys(setsObj).map(k => ({
                    reps: setsObj[k].reps || 0,
                    weight: setsObj[k].weight || ""
                }));
                return {
                    name: ex.name,
                    sets: detailedSets.length,
                    reps: detailedSets.length > 0 ? detailedSets[0].reps : 0,
                    description: ex.description,
                    detailedSets: detailedSets
                };
            });

            await updateRoutine({
                routineId: activeRoutine._id,
                userId,
                exercises: updatedExercises
            });
        }

        setShowCompletionModal(false);
        setActiveRoutine(null);
        stopRestTimer();
    } catch(e) {
        console.error("Failed completing workout", e);
        alert("Failed to save workout data");
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-32 text-center animate-fadeIn">
         <div className="glass max-w-md mx-auto p-12 rounded-[3rem] border border-white/10 shadow-2xl bg-black/40">
            <Timer className="size-16 text-primary/50 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Access Denied</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest leading-relaxed">Please initialize user session to access the tactical logbook.</p>
         </div>
      </div>
    );
  }

  return (
    <>
      {/* GLOBAL FLOATING REST TIMER PORTAL - Pulled out to root layer to avoid Fixed CSS breakage */}
      {timeLeft !== null && (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] glass ${timeLeft === 0 ? 'bg-primary border-primary shadow-[0_0_50px_rgba(24,206,242,0.8)] animate-pulse' : 'bg-black/95 border-primary/50'} text-white px-8 py-5 rounded-full shadow-2xl flex items-center justify-between gap-6 transition-all duration-300 w-[95%] md:w-[400px]`}>
               {timeLeft > 0 ? (
                  <Timer className="size-8 text-primary animate-bounce shrink-0" />
               ) : (
                  <Volume2 className="size-8 text-black shrink-0" />
               )}
               <div className="flex flex-col flex-1 pl-2">
                   <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${timeLeft === 0 ? 'text-black/80' : 'text-primary'}`}>Rescue Phase</span>
                   <span className={`text-3xl md:text-4xl font-mono font-black tracking-tighter ${timeLeft === 0 ? 'text-black' : 'text-white'}`}>
                      {timeLeft > 0 ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` : 'COMPLETE'}
                   </span>
               </div>
               <Button onClick={stopRestTimer} variant="ghost" size="icon" className={`${timeLeft === 0 ? 'text-black hover:bg-black/20 hover:text-black' : 'text-white/50 hover:text-white hover:bg-white/10'} shrink-0 p-3 h-auto w-auto rounded-full`}>
                   <X className="size-8" />
               </Button>
          </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="glass rounded-[3rem] w-full max-w-xl p-8 md:p-12 relative overflow-hidden border border-primary/20 bg-black/90 shadow-[0_0_50px_rgba(24,206,242,0.1)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                  
                  <h2 className="text-3xl font-black uppercase text-white tracking-tighter mb-4 flex items-center gap-3">
                      <CheckCircle2 className="text-primary size-8" /> Session Complete
                  </h2>
                  <p className="text-muted-foreground font-mono mb-8 text-sm">Execution Duration: {durationMins} minutes.</p>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8">
                      <p className="text-lg text-white font-bold mb-2">Master Layout Update</p>
                      <p className="text-sm text-primary/80 leading-relaxed mb-6">
                         Overwrite your Master Routine with exactly what you lifted today? Next time you run <span className="font-bold text-white uppercase">{currentRoutine.name}</span>, these variables will be pre-loaded.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                          <Button onClick={() => finalizeTrackerWorkout(true)} className="flex-1 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-colors h-14 text-xs md:text-sm">
                              Yes, Overwrite Layout
                          </Button>
                          <Button onClick={() => finalizeTrackerWorkout(false)} variant="outline" className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest h-14 text-xs md:text-sm">
                              No, Archive Log
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {currentRoutine ? (
        <div className="container mx-auto max-w-4xl px-2 md:px-4 py-8 space-y-8 animate-fadeIn relative pb-40">

          {/* Top Header */}
          <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl border border-white/10 relative overflow-hidden group bg-black/40">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
             
             <div className="relative z-10 w-full md:w-auto">
               <Button variant="ghost" onClick={() => { setActiveRoutine(null); setEditingRoutine(null); stopRestTimer(); }} className="mb-4 text-muted-foreground hover:text-red-400 !p-0 h-auto hover:bg-transparent tracking-widest uppercase text-[10px] md:text-xs">
                 <ArrowLeft className="mr-2 size-3 md:size-4" /> Abort {isEditingMode ? 'Editing' : 'Protocol'} (Data Purged)
               </Button>
               <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase drop-shadow-sm flex items-center gap-3 md:gap-4">
                 <div className={`size-3 md:size-4 rounded-full ${isEditingMode ? 'bg-orange-500' : 'bg-primary animate-pulse'}`}></div>
                 {currentRoutine.name}
                 {isEditingMode && <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">EDITOR</span>}
               </h2>
             </div>
             
             <div className="relative z-10 w-full md:w-auto flex flex-col gap-4">
                 {!isEditingMode && (
                     <div className="flex justify-between md:justify-end items-center gap-4 bg-black/50 p-3 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2">
                           <button onClick={() => setAutoRestEnabled(!autoRestEnabled)} className="flex items-center gap-2">
                              <div className={`w-8 h-4 rounded-full transition-colors relative ${autoRestEnabled ? 'bg-primary' : 'bg-white/10'}`}>
                                 <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${autoRestEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`}></div>
                              </div>
                              <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Auto-Rest</span>
                           </button>
                        </div>
                        <div className="w-[1px] h-6 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                           <Timer className="size-4 text-primary opacity-80" />
                           <input 
                               type="number"
                               value={restDuration}
                               onChange={(e) => setRestDuration(parseInt(e.target.value) || 0)}
                               className="w-12 bg-transparent text-white font-mono text-sm outline-none border-b border-white/20 text-center"
                           />
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sec</span>
                        </div>
                     </div>
                 )}

                 {isEditingMode ? (
                     <Button onClick={handleEditorSave} className="w-full bg-orange-500 text-black font-black tracking-widest px-8 py-5 md:py-6 rounded-2xl hover:bg-white hover:text-black transition-all uppercase text-xs shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                       <Save className="mr-3 size-4 md:size-5" /> Save Overrides
                     </Button>
                 ) : (
                     <Button onClick={handleTrackerPreFinish} className="w-full bg-primary text-black font-black tracking-widest px-8 py-5 md:py-6 rounded-2xl hover:bg-white hover:text-black transition-all uppercase text-xs shadow-[0_0_20px_rgba(24,206,242,0.2)]">
                       <Save className="mr-3 size-4 md:size-5" /> Execute & Save
                     </Button>
                 )}
             </div>
          </div>

          {/* Exercises Block */}
          <div className="space-y-6">
            {currentRoutine.exercises.map((exercise: any, eIndex: number) => {
               const setsArray = Object.keys(currentData[eIndex] || {}).map(k => currentData[eIndex][parseInt(k)]);
               return (
                 <div key={eIndex} className="glass rounded-[2rem] p-4 lg:p-8 animate-fadeIn bg-black/20 border border-white/5 shadow-xl transition-all duration-500 relative group/ex">
                   
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/5 pb-6">
                     <div className="w-full flex-1 flex items-center justify-between">
                       <input 
                           className="bg-transparent text-xl md:text-2xl font-black tracking-tight text-white uppercase outline-none border-b border-transparent focus:border-primary/50 w-full transition-colors focus:bg-white/5 rounded-lg px-2"
                           value={exercise.name}
                           onChange={(e) => updateExerciseName(eIndex, e.target.value)}
                           placeholder="Exercise Name"
                       />
                       <button onClick={() => removeExercise(eIndex)} className="text-muted-foreground/50 hover:text-red-500 bg-white/5 hover:bg-red-500/10 p-2.5 rounded-xl transition-all ml-4 shrink-0">
                           <Trash2 className="size-4 md:size-5" />
                       </button>
                     </div>
                   </div>

                   <div className="space-y-3">
                     <div className={`grid ${isEditingMode ? 'grid-cols-[auto_1fr_1fr_auto]' : 'grid-cols-[auto_1fr_1fr_auto_auto]'} gap-2 md:gap-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase px-2 md:px-4 mb-2 items-center`}>
                       <div className="w-6 md:w-8 text-center hidden sm:block">Set</div>
                       <div className="w-6 md:w-8 text-center sm:hidden">S</div>
                       <div className="text-center">LBS/KG</div>
                       <div className="text-center">Reps</div>
                       {!isEditingMode && <div className="w-12 lg:w-16 text-center">Done</div>}
                       <div className="w-8"></div>
                     </div>

                     {setsArray.map((setObj: any, sIndex: number) => {
                       return (
                         <div key={sIndex} className={`grid ${isEditingMode ? 'grid-cols-[auto_1fr_1fr_auto]' : 'grid-cols-[auto_1fr_1fr_auto_auto]'} gap-2 md:gap-4 items-center bg-black/60 p-2 md:p-3 rounded-2xl transition-all duration-300 border ${setObj.completed ? 'border-primary/50 bg-primary/10 shadow-[inset_0_0_15px_rgba(24,206,242,0.1)] py-4 my-2' : 'border-white/5 hover:border-white/20'}`}>
                            <div className="w-6 md:w-8 font-mono text-muted-foreground font-black text-center text-sm md:text-lg">{sIndex + 1}</div>
                            <div>
                              <input 
                                 type="text" 
                                 placeholder="--" 
                                 className="w-full bg-white/5 border border-white/10 rounded-xl font-mono text-center h-10 md:h-12 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm md:text-lg"
                                 value={setObj.weight}
                                 onChange={(e) => updateSet(eIndex, sIndex, 'weight', e.target.value)}
                              />
                            </div>
                            <div>
                              <input 
                                 type="number" 
                                 placeholder="--" 
                                 className="w-full bg-white/5 border border-white/10 rounded-xl font-mono text-center h-10 md:h-12 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm md:text-lg"
                                 value={setObj.reps}
                                 onChange={(e) => updateSet(eIndex, sIndex, 'reps', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            
                            {!isEditingMode && (
                                <div className="w-12 lg:w-16 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                   <Button 
                                     size="icon" 
                                     variant="ghost" 
                                     className={`rounded-xl size-10 md:size-12 transition-all duration-300 ${setObj.completed ? 'text-black bg-primary shadow-[0_0_15px_rgba(24,206,242,0.5)] scale-[1.05]' : 'text-muted-foreground bg-white/5 hover:bg-white/10 hover:text-white'}`}
                                     onClick={() => updateSet(eIndex, sIndex, 'completed', !setObj.completed)}
                                   >
                                     <CheckCircle2 className={`size-5 md:size-6 ${setObj.completed ? 'opacity-100' : 'opacity-50'}`} />
                                   </Button>
                                   
                                   {!autoRestEnabled && (
                                     <button title="Start Rest Timer" onClick={startRestTimer} className={`flex p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex-col items-center justify-center shrink-0 ${isTimerActive ? 'text-primary bg-primary/10 shadow-[0_0_10px_rgba(24,206,242,0.3)] animate-pulse' : 'text-muted-foreground hover:text-primary'}`}>
                                         <Timer className="size-4 md:size-5" />
                                     </button>
                                   )}
                                </div>
                            )}

                            <div className="w-8 flex justify-center">
                               <button onClick={() => removeSet(eIndex, sIndex)} className="text-muted-foreground bg-white/5 p-2 rounded-lg hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-50 hover:opacity-100">
                                   <Trash2 className="size-3 md:size-4" />
                               </button>
                            </div>
                         </div>
                       )
                     })}
                     
                     <div className="flex items-center gap-4 mt-6">
                         <Button onClick={() => addSet(eIndex)} variant="ghost" className="flex-1 bg-white/5 border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary tracking-widest uppercase text-[10px] h-12">
                             <Plus className="mr-2 size-3" /> Add Set
                         </Button>
                     </div>
                 </div>
                 
               </div>
             )
            })}
            
            <Button onClick={addExercise} className="w-full h-16 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black font-black uppercase tracking-widest text-sm rounded-[2.5rem] transition-all duration-300 shadow-[inset_0_0_20px_rgba(24,206,242,0.1)]">
                <Plus className="mr-2 size-5" /> Add Blank Exercise Module
            </Button>

            {/* Bottom Finalize Button */}
            <div className="pt-8">
                {isEditingMode ? (
                    <Button onClick={handleEditorSave} className="w-full bg-orange-500 text-black font-black tracking-widest px-8 py-7 md:py-8 rounded-3xl hover:bg-white hover:text-black transition-all uppercase text-sm md:text-base shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                       <Save className="mr-3 size-5 md:size-6" /> Save Master Layout Modifications
                    </Button>
                ) : (
                    <Button onClick={handleTrackerPreFinish} className="w-full bg-primary text-black font-black tracking-widest px-8 py-7 md:py-8 rounded-3xl hover:bg-white hover:text-black transition-all uppercase text-sm md:text-base shadow-[0_0_40px_rgba(24,206,242,0.2)]">
                       <Save className="mr-3 size-5 md:size-6" /> Complete Protocol
                    </Button>
                )}
            </div>
          </div>

        </div>
      ) : (
      
      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12 animate-fadeIn relative z-10 pb-24">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <h1 className="flex items-center gap-4 text-5xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-md text-white">
                <Dumbbell className="text-primary size-12 md:size-16 drop-shadow-[0_0_15px_rgba(24,206,242,0.5)]" />
                <span>Protocol <span className="text-primary italic">Tracker</span></span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm tracking-[0.2em] uppercase opacity-60">Init tracking sequence. Select module to engage.</p>
            </div>
            
            {!isCreatingRoutine ? (
                <Button onClick={() => setIsCreatingRoutine(true)} className="bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary uppercase tracking-widest font-bold h-12 px-6 rounded-2xl w-full md:w-auto">
                    <Plus className="mr-2 size-4 font-black" /> Blank Routine
                </Button>
            ) : (
                <div className="flex items-center gap-2 bg-black/60 p-2 rounded-2xl border border-primary/30 w-full md:w-auto shadow-[0_0_20px_rgba(24,206,242,0.1)]">
                    <input 
                        autoFocus
                        type="text"
                        className="bg-transparent outline-none px-4 py-2 w-full text-sm font-bold text-white uppercase placeholder:text-muted-foreground/30"
                        placeholder="ROUTINE NAME..."
                        value={newRoutineName}
                        onChange={(e) => setNewRoutineName(e.target.value)}
                    />
                    <Button onClick={handleCreateRoutineSubmit} size="sm" className="bg-primary text-black font-black uppercase h-10 px-6 rounded-xl">Create</Button>
                    <Button onClick={() => setIsCreatingRoutine(false)} size="icon" variant="ghost" className="text-muted-foreground hover:text-white bg-white/5 rounded-xl"><X className="size-4"/></Button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {routines === undefined && (
              <div className="col-span-full py-24 text-center flex flex-col items-center gap-6 glass rounded-[3rem] border border-white/5 bg-black/40">
                <div className="size-16 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                <p className="text-primary font-mono tracking-widest font-black text-sm">LOADING MODULES...</p>
              </div>
           )}
           {routines && routines.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-16 md:p-24 glass rounded-[3rem] text-center space-y-6 border border-white/10 shadow-2xl relative overflow-hidden bg-black/40">
                 <Timer className="size-20 text-muted-foreground opacity-20 transition-opacity duration-500 scale-110" />
                 <p className="text-muted-foreground font-black tracking-widest text-xl uppercase z-10 drop-shadow-md">No Protocols Found</p>
                 <p className="text-sm text-foreground/50 max-w-sm font-mono leading-relaxed z-10">Generate an AI Plan under your profile and click "SAVE ROUTINE" on any day module, or create a blank one.</p>
              </div>
           )}
           {routines && routines.map((routine: any, index: number) => {
             const isRenaming = renamingRoutineId === routine._id;

             return (
             <div key={routine._id} className="relative glass rounded-[2.5rem] p-6 lg:p-8 hover:border-primary/50 bg-black/40 transition-all duration-500 group overflow-hidden shadow-2xl animate-fadeIn flex flex-col justify-between" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
                
                <div className="relative z-10 mb-8">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        {isRenaming ? (
                            <div className="flex items-center gap-2 flex-1 w-full relative z-20">
                                <input 
                                    autoFocus
                                    className="w-full bg-black border border-primary/50 text-white rounded-lg px-3 py-2 text-sm font-black uppercase outline-none"
                                    value={renameText}
                                    onChange={(e) => setRenameText(e.target.value)}
                                />
                                <Button onClick={handleSaveRename} size="sm" className="bg-primary text-black font-black uppercase h-9">Save</Button>
                                <Button onClick={(e) => { e.stopPropagation(); setRenamingRoutineId(null); }} size="icon" variant="ghost" className="h-9 w-9 shrink-0"><X className="size-4"/></Button>
                            </div>
                        ) : (
                            <h3 className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors text-white duration-300 drop-shadow-sm leading-[1.1]">{routine.name}</h3>
                        )}
                        
                        {!isRenaming && (
                            <div className="flex flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                               <button onClick={(e) => handleStartRename(routine, e)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-white transition-colors">
                                   <Edit2 className="size-3.5" />
                               </button>
                               <button onClick={(e) => handleDeleteRoutine(routine._id, e)} className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-xl text-muted-foreground hover:text-red-400 transition-colors">
                                   <Trash2 className="size-3.5" />
                               </button>
                            </div>
                        )}
                    </div>

                    {!isRenaming && (
                        <div className="text-[10px] bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full uppercase font-black tracking-widest text-primary inline-flex shadow-[0_0_10px_rgba(24,206,242,0.05)]">
                          {routine.exercises.length} Exercises
                        </div>
                    )}
                </div>

                {!isRenaming && (
                    <div className="relative z-10">
                      <div className="mb-6 space-y-3 min-h-[4rem]">
                        {routine.exercises.slice(0, 3).map((ex: any, i: number) => (
                          <div key={i} className="text-sm font-bold text-muted-foreground flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_5px_rgba(24,206,242,0.5)]"></div>
                            <span className="truncate group-hover:text-foreground transition-colors duration-300">{ex.name}</span>
                          </div>
                        ))}
                        {routine.exercises.length > 3 && (
                          <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground pt-2 pl-4 italic opacity-80 group-hover:text-primary/80 transition-colors">+ {routine.exercises.length - 3} additional</div>
                        )}
                        {routine.exercises.length === 0 && (
                           <div className="text-xs uppercase font-black tracking-widest opacity-50 text-muted-foreground py-2 text-center bg-white/5 rounded-xl border border-dashed border-white/10 p-4">Empty Specification</div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-auto">
                          <Button 
                            onClick={() => startWorkout(routine)}
                            className="flex-1 bg-white/5 text-foreground hover:bg-primary hover:text-black hover:shadow-[0_0_25px_rgba(24,206,242,0.3)] border border-white/10 hover:border-transparent font-black tracking-widest uppercase transition-all duration-300 rounded-2xl py-6 text-[10px] sm:text-xs flex items-center justify-center gap-2 relative overflow-hidden group/btn"
                          >
                            <Play className="size-4" /> Start
                          </Button>
                          <Button 
                            onClick={() => startEditing(routine)}
                            className="bg-white/5 text-muted-foreground hover:bg-orange-500 hover:text-black border border-white/10 hover:border-transparent font-black tracking-widest uppercase transition-all duration-300 rounded-2xl py-6 px-4 shrink-0 flex items-center justify-center relative overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                          >
                            <Settings2 className="size-5" />
                          </Button>
                      </div>
                    </div>
                )}
             </div>
           )})}
        </div>
      </div>
      )}
    </>
  )
}
