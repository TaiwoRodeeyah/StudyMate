import { GraduationCap } from "lucide-react";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className="relative">
      <GraduationCap
        className={`${className} text-amber-700 dark:text-amber-300`}
      />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-white dark:border-stone-800"></div>
    </div>
  );
}
