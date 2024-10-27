"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ChartData } from "../types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface LoanChartProps {
    data: ChartData[];
    isIslamic: boolean;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { name: string; value: number; color?: string }[];
    label?: string;
}

export const LoanChart: React.FC<LoanChartProps> = ({ data, isIslamic }) => {
    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-medium">Bulan {label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                label={{
                                    value: "Bulan",
                                    position: "insideBottom",
                                    offset: -5,
                                }}
                            />
                            <YAxis
                                tickFormatter={(value) => formatCurrency(value)}
                                width={100}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="#8884d8"
                                name="Sisa Pinjaman"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="payment"
                                stroke="#82ca9d"
                                name="Angsuran"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="interest"
                                stroke="#ff7300"
                                name={isIslamic ? "Margin" : "Bunga"}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
