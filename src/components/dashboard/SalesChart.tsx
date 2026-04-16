"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { date: "Day 1", sales: 1000000 },
  { date: "Day 2", sales: 1500000 },
  { date: "Day 3", sales: 800000 },
  { date: "Day 4", sales: 2500000 },
  { date: "Day 5", sales: 4200000 },
  { date: "Day 6", sales: 3100000 },
  { date: "Day 7", sales: 5000000 },
];

export function SalesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#888888" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#888888" }}
            tickFormatter={(value) => `Rp${value / 1000000}M`}
            dx={-10}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              `Rp ${Number(value || 0).toLocaleString("id-ID")}`,
              "Sales",
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)"
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
