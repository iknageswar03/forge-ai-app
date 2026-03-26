"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Mic2, PhoneOff, Loader2 } from "lucide-react";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log("AI started Speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    };
    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!,{
            variableValues: {
              full_name: fullName,
              serverUserId: user?.id,
            },
      });

      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-x-hidden pb-12 pt-32 relative">
       {/* Background decoration */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/5 blur-[120px] rounded-full"></div>
       </div>

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16 space-y-4 animate-fadeIn">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3 text-primary" />
            <span className="text-[10px] font-black tracking-widest uppercase text-primary">Neural Protocol Initiation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Forge Your <span className="text-primary italic">Synthesis.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Begin a neural-link voice conversation with our AI architect to synthesize 
            your elite fitness and nutrition protocol.
          </p>
        </div>

        {/* HUD AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {/* AI ASSISTANT CARD */}
          <Card className={`group relative bg-white/5 backdrop-blur-2xl border-white/10 overflow-hidden rounded-[2.5rem] transition-all duration-500 ${callActive && isSpeaking ? 'border-primary/50 shadow-2xl shadow-primary/10' : ''}`}>
             {/* Decorative HUD Elements */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-white/10 group-hover:border-primary/30 transition-colors rounded-tl-xl"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-white/10 group-hover:border-primary/30 transition-colors rounded-tr-xl"></div>
            
            <div className="min-h-95 md:aspect-16/10 flex flex-col items-center justify-center p-6 md:p-12 relative">
              {/* AI VOICE ANIMATION */}
              <div className="absolute inset-x-0 bottom-16 md:bottom-12 flex justify-center items-center gap-1 md:gap-1.5 h-10 md:h-16 pointer-events-none px-4">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 md:w-1 bg-primary/40 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-sound-wave' : 'h-1 opacity-20'}`}
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      height: isSpeaking ? `${Math.sin(i * 0.5) * 40 + 50}%` : '4px',
                    }}
                  />
                ))}
              </div>

              {/* AI IMAGE */}
              <div className="relative mb-6 md:mb-8 mt-4 md:mt-0">
                <div className={`absolute inset-0 bg-primary/20 blur-3xl rounded-full transition-all duration-500 ${isSpeaking ? 'scale-150 opacity-40' : 'scale-100 opacity-20'}`}></div>
                <div className={`relative size-28 md:size-40 rounded-full bg-black/40 border-2 transition-all duration-500 overflow-hidden p-1 ${isSpeaking ? 'border-primary animate-pulse' : 'border-white/10'}`}>
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                   <img
                    src="./ai-avatar2.png"
                    alt="Forge Neural Link"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div className="text-center z-10 mb-8 md:mb-0">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">FORGE-X1</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Elite Neural Architect</p>
              </div>

              {/* STATUS INDICATOR */}
              <div className="absolute bottom-6 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8">
                 <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                    <div className={`size-1 md:size-1.5 rounded-full ${callActive ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(24,206,242,0.8)]' : 'bg-muted'}`}></div>
                    <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                       {callActive ? (isSpeaking ? "Transmitting..." : "Listening...") : "Link Offline"}
                    </span>
                 </div>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card className="group relative bg-white/5 backdrop-blur-2xl border-white/10 overflow-hidden rounded-[2.5rem] transition-all duration-500">
             <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-white/10 group-hover:border-primary/30 transition-colors rounded-bl-xl"></div>
             <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-white/10 group-hover:border-primary/30 transition-colors rounded-tr-xl"></div>

            <div className="min-h-[380px] md:aspect-[16/10] flex flex-col items-center justify-center p-6 md:p-12 relative">
              <div className="relative mb-6 md:mb-8 mt-4 md:mt-0">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
                <div className="relative size-28 md:size-40 rounded-full border-2 border-white/10 overflow-hidden p-1">
                   <img
                    src={user?.imageUrl}
                    alt="User"
                    className="size-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              <div className="text-center z-10 mb-8 md:mb-0">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                   {user ? (user.firstName + " " + (user.lastName || "")).trim() : "GUEST"}
                </h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">Elite Athlete Candidate</p>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8">
                 <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                    <div className="size-1 md:size-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Candidate Ready</span>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        {/* TRANSCRIPT AREA */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 mb-12 h-80 overflow-y-auto custom-scrollbar animate-fadeIn"
          >
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col gap-2 ${msg.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                    msg.role === 'assistant' 
                    ? 'bg-primary/10 border border-primary/20 text-foreground' 
                    : 'bg-white/5 border border-white/10 text-muted-foreground'
                  }`}>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">
                       {msg.role === 'assistant' ? 'Forge-X1' : 'Candidate'}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}

              {callEnded && (
                <div className="flex justify-center">
                  <div className="px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold flex items-center gap-3">
                    <Loader2 className="size-4 animate-spin" />
                    Synthesis Complete. Initiating Profile Matrix...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="w-full flex flex-col items-center gap-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            className={`h-20 px-12 rounded-[2rem] text-xl font-black transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${
              callActive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive shadow-destructive/20"
                : callEnded
                  ? "bg-green-600 text-white shadow-green-500/20"
                  : "bg-primary text-primary-foreground shadow-primary/30"
            }`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            <div className="flex items-center gap-3 tracking-tight">
               {connecting ? (
                 <>
                   <Loader2 className="size-6 animate-spin" />
                   <span>CONNECTING...</span>
                 </>
               ) : callActive ? (
                 <>
                   <PhoneOff className="size-6" />
                   <span>END CALL</span>
                 </>
               ) : callEnded ? (
                 <span>MATRIX READY</span>
               ) : (
                 <>
                   <Mic2 className="size-6" />
                   <span>START CALL</span>
                 </>
               )}
            </div>
          </Button>
          
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
             Secure Neural Encryption Enabled
          </p>
        </div>
      </div>
    </div>
  );
};
export default GenerateProgramPage;