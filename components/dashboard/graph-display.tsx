import React from "react";
import { ResponsiveBar } from "@nivo/bar";

type Props = {
  totalCases: number;
  totalOpenCases: number;
  totalClosedCases: number;
};

export default function GraphDisplay({
  totalCases,
  totalOpenCases,
  totalClosedCases,
}: Props) {
  const data = [
    {
      label: "Total Cases",
      value: totalCases,
      color: "darkgreen",
    },
    {
      label: "Total Open Cases",
      value: totalOpenCases,
      color: "green",
    },
    {
      label: "Total Closed Cases",
      value: totalClosedCases,
      color: "red",
    },
  ];
  return (
    <div className="h-[500px] w-full col-span-3 md:col-span-2 bg-white rounded shadow border border-slate-300 flex items-center justify-center px-2 py-4">
      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.6}
        layout="vertical"
        colors={(d) => d.data.color}
        labelSkipWidth={100}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        enableGridY={false}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "status of cases",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Number of Cases",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "right",
            direction: "column",

            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
