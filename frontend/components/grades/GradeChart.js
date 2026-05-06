"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function GradeChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data
    : Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid stroke="#d8e0ec" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#0b3d91" />
          <Bar dataKey="count" fill="#c8102e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
