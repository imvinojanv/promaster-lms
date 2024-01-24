"use client"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";

interface ChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

const Chart = ({
    data
}: ChartProps) => {
    return (
        <Card>
            <ResponsiveContainer width="100%" height={350} className='mt-4'>
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Bar
                        dataKey="total"
                        fill="#0369a1"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default Chart