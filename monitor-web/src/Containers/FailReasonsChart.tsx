import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { ServerDailyStat, FailReasons } from '../type'; // 請依據您的專案結構引用

interface FailReasonsChartProps {
  data: ServerDailyStat[];
}

// 設定一組高對比的顏色給 Top N 使用
const COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Orange
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];
const OTHER_COLOR = '#6B7280'; // Gray for Others
const TOP_N_LIMIT = 6;

const FailReasonsChart: React.FC<FailReasonsChartProps> = ({ data }) => {
    // 資料處理邏輯 (維持不變)
    const { chartData, finalKeys } = useMemo(() => {
        if (!data || data.length === 0) return { chartData: [], finalKeys: [] };

        // 1. 計算全域總和以找出 Top N
        const globalTotals: Record<string, number> = {};
        data.forEach((day) => {
        if (!day.fail_reasons) return;
        Object.entries(day.fail_reasons).forEach(([reason, count]) => {
            const safeCount = count || 0;
            globalTotals[reason] = (globalTotals[reason] || 0) + safeCount;
        });
        });

        // 2. 排序
        const sortedReasons = Object.keys(globalTotals).sort(
        (a, b) => globalTotals[b] - globalTotals[a]
        );

        const topKeys = sortedReasons.slice(0, TOP_N_LIMIT);
        const hasOthers = sortedReasons.length > TOP_N_LIMIT;
        const keys = hasOthers ? [...topKeys, 'Others'] : topKeys;

        // 3. 轉換每日數據
        const formattedData = data.map((day) => {
        const displayDate = day.stat_date.slice(5);
        const row: { [key: string]: string | number } = { displayDate };

        let othersCount = 0;
        if (day.fail_reasons) {
            Object.entries(day.fail_reasons as FailReasons).forEach(([reason, count]) => {
            const safeCount = count || 0;
            if (topKeys.includes(reason)) {
                row[reason] = safeCount;
            } else {
                othersCount += safeCount;
            }
            });
        }
        if (hasOthers) {
            row['Others'] = othersCount;
        }
        return row;
        });

        return { chartData: formattedData, finalKeys: keys };
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="text-gray-500">No failure reason data available.</div>;
    }

    return (
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg mt-6 border border-gray-800">
        <div className="mb-4">
            <h3 className="text-white text-xl font-bold">Daily Failure Reason Breakdown</h3>
            <p className="text-gray-400 text-sm mt-1">
            Showing top {Math.min(finalKeys.length, TOP_N_LIMIT)} error types.
            </p>
        </div>

        <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                
                <XAxis 
                dataKey="displayDate" 
                stroke="#9CA3AF" 
                tick={{ fill: '#9CA3AF' }} 
                />
                
                <YAxis 
                stroke="#9CA3AF" 
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value.toString();
                }}
                />
                
                {/* 使用內建 Tooltip，但在樣式上做微調以符合深色主題 */}
                <Tooltip 
                cursor={{ fill: '#ffffff', opacity: 0.1 }}
                contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    borderRadius: '8px',
                    color: '#F3F4F6'
                }}
                itemStyle={{ color: '#E5E7EB' }}
                formatter={(value: number) => value.toLocaleString()} // 加上千分位逗號
                />
                
                <Legend 
                wrapperStyle={{ paddingTop: '20px' }} 
                iconType="circle"
                />

                {finalKeys.map((key, index) => (
                <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={key === 'Others' ? OTHER_COLOR : COLORS[index % COLORS.length]}
                    name={key}
                    barSize={50}
                />
                ))}
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default FailReasonsChart;