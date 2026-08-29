import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { WHATSAPP } from "@/lib/gas";

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.79L2.05 22l5.5-1.44c1.36.73 2.89 1.15 4.49 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 14.18c-.24.66-1.38 1.27-1.89 1.35-.48.08-1.09.12-1.75-.11-.4-.13-.91-.31-1.56-.61-2.73-1.18-4.52-3.93-4.65-4.11-.13-.18-1.08-1.44-1.08-2.74 0-1.3.68-1.94.92-2.2.24-.26.52-.33.69-.33.17 0 .35.002.5.009.16.007.38-.06.59.46.24.58.8 1.97.87 2.11.07.14.12.3.02.49-.1.18-.15.3-.3.46-.15.17-.32.38-.45.51-.15.14-.3.29-.13.58.17.29.77 1.27 1.65 2.05 1.13 1.01 2.09 1.32 2.38 1.47.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.66-.14.27.1 1.72.81 2.01.96.29.14.49.21.56.33.07.12.07.69-.17 1.35z"/>
  </svg>
);

export function WhatsAppFAB() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[9998] flex items-center gap-3 overflow-hidden rounded-full bg-[#25D366] shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      style={{ boxShadow: "0 4px 20px rgba(37, 211, 102, 0.45)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.5, type: "spring", stiffness: 200, damping: 22 }}
    >
      {/* Pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Icon */}
      <span className="relative flex h-14 w-14 items-center justify-center">
        {WA_ICON}
      </span>

      {/* Expanded label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="label"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="overflow-hidden pr-4 font-display text-sm font-bold text-white whitespace-nowrap"
          >
            Start Free Trial
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
