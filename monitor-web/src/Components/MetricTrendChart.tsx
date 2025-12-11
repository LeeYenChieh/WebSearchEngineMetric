/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

// 定義傳入的資料型別
interface MetricData {
    date: string;
    discover_find: number;
    fetch_find: number;
    upload_find: number;
    rank_find: number;
    total: number;
}

interface MetricTrendChartProps {
    title: string;
    data: MetricData[];
}

const MetricTrendChart: React.FC<MetricTrendChartProps> = ({ title, data }) => {
    // 客製化 Tooltip 來同時顯示 "188 / 797" 和 "23.5%"
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
        // 從 payload 中取得當天的 total (因為 total 在每一行數據裡都是一樣的)
        const currentData = payload[0].payload; 
        const total = currentData.total;

        return (
            <div className="bg-gray-900 border border-gray-700 p-4 rounded shadow-xl">
            <p className="text-gray-300 font-bold mb-2">{label} (Total: {total})</p>
            {payload.map((entry: any) => {
                const value = entry.value; // 百分比
                const rawValue = currentData[`${entry.dataKey.split('_')[0]}_find`]; // 原始數值
                
                return (
                <div key={entry.name} className="flex items-center gap-2 mb-1" style={{ color: entry.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span className="font-medium capitalize">{entry.name}: </span>
                    <span>
                    {/* 格式要求: f'{find} / {total}' 和 f'{percentage}%' */}
                    {rawValue} / {total} ({value.toFixed(2)}%)
                    </span>
                </div>
                );
            })}
            </div>
        );
        }
        return null;
    };

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                dataKey="date" 
                stroke="#9CA3AF" 
                tickFormatter={(str) => format(parseISO(str), 'MM-dd')}
                tick={{ fontSize: 12 }}
                />
                <YAxis 
                stroke="#9CA3AF" 
                unit="%" 
                domain={[0, 100]} 
                tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                
                {/* 定義四條線，存的是計算好的百分比 */}
                <Line type="monotone" dataKey="discover_pct" name="Discover" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="fetch_pct" name="Fetch" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="upload_pct" name="Upload" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rank_pct" name="Rank" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default MetricTrendChart;