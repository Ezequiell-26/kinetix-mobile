"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PremiumCard({ children, className, delay = 0, ...props }: React.ComponentProps<typeof Card> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -1 }}
      className="will-change-transform"
    >
      <Card className={cn("backdrop-blur-sm bg-[#111111]/80 border-zinc-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] hover:border-zinc-700/80 transition-all", className)} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
