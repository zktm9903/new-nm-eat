"use client";

import { balloons, textBalloons } from "balloons-js";
import { Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function BirthdayNotice() {
  return (
    <Alert>
      <Gift className="size-4" />
      <AlertTitle>ㄱㅇㅎ 선생님 생일 축하드립니다~</AlertTitle>
      <AlertDescription>
        <p>ଲ(ⓛ ω ⓛ)ଲ (ﾐටᆽටﾐ) (ृ˄·͈༝·͈˄ ृ ) (ﾐ•̀ᆽ•̀ﾐ)</p>
      </AlertDescription>
      <AlertAction>
        <Button
          size="sm"
          onClick={() => {
            textBalloons([
              {
                text: "HAPPY",
                fontSize: 120,
                color: "#000000",
              },
              {
                text: "BIRTH",
                fontSize: 120,
                color: "#000000",
              },
              {
                text: "DAY",
                fontSize: 120,
                color: "#000000",
              },
              {
                text: "🎂🍰🧁",
                fontSize: 120,
                color: "#000000",
              },
            ]);
            balloons();
          }}
        >
          풍선 날리기
        </Button>
      </AlertAction>
    </Alert>
  );
}
