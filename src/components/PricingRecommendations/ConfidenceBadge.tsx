import { cn } from "@/lib/utils";
import {
  confidenceTierLabels,
  type ConfidenceTier,
} from "@/lib/recommendationEngine";

const tierStyles: Record<ConfidenceTier, string> = {
  high: "border-success/40 bg-success/10 text-success",
  medium: "border-warning/50 bg-warning/10 text-warning",
  low: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function ConfidenceBadge({
  score,
  tier,
  showScore = true,
  className,
}: {
  score: number;
  tier: ConfidenceTier;
  showScore?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold",
        tierStyles[tier],
        className,
      )}
      title={`Model confidence: ${score}/100 (${confidenceTierLabels[tier]})`}
    >
      {confidenceTierLabels[tier]}
      {showScore && <span className="font-normal opacity-80">{score}</span>}
    </span>
  );
}
