"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GlobalLoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border-4 border-primary/20 border-t-primary"></div>
        </motion.div>
        
        {/* Middle pulsing ring */}
        <motion.div
          className="absolute inset-2 w-20 h-20"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full border-2 border-primary/40"></div>
        </motion.div>
        
        {/* Inner rotating ring (opposite direction) */}
        <motion.div
          className="absolute inset-4 w-16 h-16"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border-2 border-primary/30 border-b-primary"></div>
        </motion.div>
        
        {/* Center icon with pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </motion.div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
      </div>
      
      {/* Loading text */}
      <motion.div
        className="absolute bottom-[calc(50%-80px)] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          className="text-sm font-medium text-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
