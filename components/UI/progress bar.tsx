import { cn } from "@/libs/utils/cn";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import * as icons from "@icons";

export function ProgressBar({ progress }: { progress: number }) {
  const progressValue = useMotionValue(progress);
  useEffect(() => {
    progressValue.set(progress);
  }, [progress, progressValue]);
  const progressPercent = useTransform(progressValue, [0, 100], [0, 1]);

  return (
    <div className="flex items-center justify-center gap-2 rounded-md p-2">
      <div className="h-4 w-full overflow-hidden rounded-md border-2">
        <motion.div
          style={{
            scaleX: progressPercent,
          }}
          className="h-full w-full origin-left bg-green-500 transition-transform"
        ></motion.div>
      </div>
      {progress === 100 && <icons.Check className="text-xl text-green-500" />}
    </div>
  );
}
