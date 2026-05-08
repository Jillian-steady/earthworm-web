"use client";

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-600">
      <div
        className="h-full rounded-lg bg-gradient-to-r from-emerald-200 to-emerald-400 transition-all dark:from-emerald-300 dark:to-emerald-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
