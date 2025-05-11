import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AppearanceRadioGroupItem,
  RadioGroup,
} from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";

export default function Appearance() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  return (
    <Card className="bg-muted py-4 gap-4">
      <CardHeader className="border-b pb-4">
        <CardTitle variant="h2">Appearance</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-12">
        <div className="col-span-full md:col-span-4 flex flex-col gap-5">
          <Label className="text-muted-foreground">Theme mode</Label>
          <p className="text-muted-foreground text-sm">
            Choose how Supabase looks to you. Select a single theme, or sync
            with your system.
          </p>
        </div>
        <div className="col-span-full md:col-span-8 flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            TL;DR Terms will use your selected theme
          </p>
          {mounted ? (
            <RadioGroup
              className="flex flex-wrap gap-2 md:gap-3"
              defaultValue={theme}
              value={theme}
              onValueChange={setTheme}
            >
              <AppearanceRadioGroupItem value="dark" id="r3" />
              <AppearanceRadioGroupItem value="light" id="r2" />
              <AppearanceRadioGroupItem value="system" id="r1" />
            </RadioGroup>
          ) : (
            <div className="flex flex-wrap gap-2 md:gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[138px] w-[189px] bg-border"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
