import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticPoint } from "@/types/supabase";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
} from "lucide-react";
import { useState } from "react";

const SOURCE_MAP = {
  "2": {
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    label: "Excellent",
  },
  "1": {
    icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
    label: "Good",
  },
  "0": {
    icon: <InfoIcon className="h-5 w-5 text-blue-400" />,
    label: "Neutral",
  },
  "-1": {
    icon: <AlertTriangleIcon className="h-5 w-5 text-yellow-400" />,
    label: "Concerning (Minor)",
  },
  "-2": {
    icon: <AlertTriangleIcon className="h-5 w-5 text-orange-500" />,
    label: "Concerning (Major)",
  },
};
function AnalyticPointCard({
  point,
  title,
}: { point: AnalyticPoint; title: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="gap-3">
      <CardHeader className="gap-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-start gap-2">
            <div className="mt-0.5">
              {
                SOURCE_MAP[point.score.toString() as keyof typeof SOURCE_MAP]
                  .icon
              }
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle variant="h4" className="text-base">
                  {title}
                </CardTitle>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                  {
                    SOURCE_MAP[
                      point.score.toString() as keyof typeof SOURCE_MAP
                    ].label
                  }
                </span>
                <span className="text-muted-foreground text-xs">
                  Case {point.case_id}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((prev) => !prev)}
            className="ml-2 h-8 w-8 flex-shrink-0 p-0"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <p className="pl-7 text-sm">{point.description}</p>
        </CardContent>
      )}
    </Card>
  );
}

export default AnalyticPointCard;
