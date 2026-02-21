import { ReactNode } from "react";
import { motion } from "framer-motion";
import { poppingTransition } from "./transition";

export default function AnimatedContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={poppingTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-[calc(100vh-200px)]"
    >
      <div className="h-full flex flex-col pt-4 overflow-y-auto px-2">
        {children}
      </div>
    </motion.div>
  );
}
