const TerminalOverlay = () => {
  return (
    <div className="absolute bottom-6 left-6 right-6 z-20">
      <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 overflow-hidden shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-50"></div>
            </div>
            <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Neural Link Active</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-2/3 animate-pulse"></div>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/60">S-8412</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
             <span className="text-primary font-mono text-xs mt-0.5">/</span>
             <p className="text-sm font-bold text-foreground leading-tight tracking-tight">
               BIO-METRIC SYNTHESIS COMPLETE
             </p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              "Hypertrophy Protocol Optimized",
              "Macro-nutrient Ratio Balanced",
              "Neural Adaptation Enabled"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none">
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-primary/40"></div>
        </div>
      </div>
    </div>
  );
};
export default TerminalOverlay;