"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Questions",
  },
  correct: {
    label: "Correct",
    color: "#00BC7D",
  },
  incorrect: {
    label: "Incorrect",
    color: "#EF4444",
  },
} satisfies ChartConfig;

interface ResultsDonutChartProps {
  correct: number;
  incorrect: number;
}

export default function ResultsDonutChart({
  correct,
  incorrect,
}: ResultsDonutChartProps) {
  const chartData = [
    { status: "correct", count: correct, fill: "#10B981" },
    { status: "incorrect", count: incorrect, fill: "#EF4444" },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-[203px] h-[203px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={52}
          strokeWidth={0}
        />
      </PieChart>
    </ChartContainer>
  );
}
