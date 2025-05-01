import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Analytic, ScoreCategory } from "@/types/supabase";

const SCORE_CATEGORY_MAP: Record<ScoreCategory, string> = {
  excellent: "Excellent",
  good: "Good",
  neutral: "Neutral",
  concerning_minor: "Concerning (Minor)",
  concerning_major: "Concerning (Major)",
  potentially_harmful: "Potentially Harmful",
  incomplete_potentially_risky: "Incomplete (Potentially Risky)",
};

function OverviewCards({ analytic }: { analytic: Analytic }) {
  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-3">
      <Card>
        <CardHeader className="gap-0 pb-2">
          <CardTitle variant="h2" className="text-lg">
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <div
              className={cn(
                `mb-2 font-bold text-4xl text-red-500 sm:text-5xl`,
                {
                  "text-orange-500": analytic.score >= 50,
                  "text-yellow-500": analytic.score >= 60,
                  "text-green-400": analytic.score >= 70,
                  "text-green-500": analytic.score >= 80,
                }
              )}
            >
              {analytic.score}/100
            </div>
            <Progress value={analytic.score} className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="gap-0 pb-2">
          <CardTitle variant="h2" className="text-lg">
            Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <div
              className={cn(
                `mb-2 rounded-lg bg-red-500 px-3 py-2 text-center font-semibold`,
                {
                  "bg-green-500": analytic.score_category === "excellent",
                  "bg-green-400": analytic.score_category === "good",
                  "bg-blue-400": analytic.score_category === "neutral",
                  "bg-yellow-400":
                    analytic.score_category === "concerning_minor",
                  "bg-orange-500":
                    analytic.score_category === "concerning_major",
                  "bg-red-500":
                    analytic.score_category === "potentially_harmful",
                  "bg-purple-500":
                    analytic.score_category === "incomplete_potentially_risky",
                }
              )}
            >
              <span className="text-lg sm:text-xl">
                {SCORE_CATEGORY_MAP[analytic.score_category]}
              </span>
            </div>
            <p className="mt-1 text-center text-muted-foreground text-xs">
              Based on our analysis criteria
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="gap-0 pb-2">
          <CardTitle variant="h2" className="text-lg">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="h-28 overflow-y-auto">
          <p className="text-sm">{analytic.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default OverviewCards;
