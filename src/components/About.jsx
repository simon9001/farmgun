import { motion } from "framer-motion";
import { memo } from "react";
// Using a placeholder image or removing it if not provided. Keeping structure.
// You might want to remove the import Simon from '../assets/Simon Pass.jpg';
// and use a placeholder or generic farm image if available, or just text.
// I will comment out the image import and usage for now to avoid breaking if file missing/irrelevant.
// import Simon from '../assets/Simon Pass.jpg'; 

export default memo(function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl px-4 py-12">

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col items-center md:items-start"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 mb-4">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
              Who We Are
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3 text-foreground text-center md:text-left">
            Hi, I am{" "}
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Irene Mwangi
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-4 text-center md:text-left">
            My journey in farming began with just a small piece of land and a strong desire to grow food that could feed both my family and my dreams. Over time, I specialized in onions and garlic, learning through trial, error, and consistency.
          </p>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8 text-center md:text-left">
            I created Farm with Irene to share everything I’ve learned — the real, practical tips that actually work in our soil and climate. If you're someone who wants to farm smarter, make fewer mistakes, and grow with confidence, you're in the right place.
          </p>

        </motion.div>
      </div>
    </motion.div>
  );
});