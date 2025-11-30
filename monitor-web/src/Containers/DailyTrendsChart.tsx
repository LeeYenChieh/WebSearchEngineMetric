/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
// import { type NameType, type ValueType } from 'recharts/types/component/DefaultTooltipContent';

// 引入剛剛定義的 Interface (如果放在同個檔案就不用 import)
import { type ServerDailyStat } from '../type'; // 假設您放在 types.ts

interface DailyTrendsChartProps {
    data: ServerDailyStat[];
}

// 擴充資料型別以包含 displayDate，這是我們在 render 前計算出來的
interface ChartData extends ServerDailyStat {
    displayDate: string;
}

const formatNumber = (num: number): string => {
    if (num > 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num > 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
};

const formatPercent = (decimal: number): string => `${(decimal * 100).toFixed(1)}%`;

const DailyTrendsChart: React.FC<DailyTrendsChartProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // 資料轉換
    const chartData: ChartData[] = data.map((item) => ({
        ...item,
        displayDate: item.stat_date.slice(5), // '2025-11-23' -> '11-23'
    }));

    // 自定義 Tooltip Formatter 的型別處理
    const tooltipFormatter = (value: any, name: any): [string, string] | string => {
        // 雖然 ValueType 可能是 string | number | array，但在這裡我們知道是 number
        const val = Number(value);
        
        if (name === 'Failed Rate') {
        return formatPercent(val);
        }
        return val.toLocaleString();
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg mt-6 border border-gray-800">
        <h3 className="text-white text-xl font-bold mb-4">Daily Fetch & Health Trends</h3>
        
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                
                {/* X 軸 */}
                <XAxis 
                dataKey="displayDate" 
                stroke="#9CA3AF" 
                tick={{ fill: '#9CA3AF' }}
                />
                
                {/* 左側 Y 軸: 數量 */}
                <YAxis 
                yAxisId="left" 
                stroke="#9CA3AF" 
                tickFormatter={formatNumber}
                tick={{ fill: '#9CA3AF' }}
                />
                
                {/* 右側 Y 軸: 百分比 */}
                <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#F87171" 
                tickFormatter={formatPercent}
                tick={{ fill: '#F87171' }}
                />
                
                <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={tooltipFormatter}
                labelStyle={{ color: '#9CA3AF' }}
                />
                
                <Legend wrapperStyle={{ paddingTop: '10px' }} />

                {/* 1. 堆疊柱狀圖：成功 */}
                <Bar 
                yAxisId="left" 
                dataKey="fetch_ok" 
                name="Fetch OK" 
                stackId="a" 
                fill="#10B981" 
                radius={[0, 0, 4, 4]} 
                />
                
                {/* 2. 堆疊柱狀圖：失敗 */}
                <Bar 
                yAxisId="left" 
                dataKey="fetch_fail" 
                name="Fetch Fail" 
                stackId="a" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]} 
                />

                {/* 3. 折線圖：新連結 (輔助觀察) */}
                <Line
                yAxisId="left"
                type="monotone"
                dataKey="new_links"
                name="New Links"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                />

                {/* 4. 折線圖：失敗率 (關鍵指標) */}
                <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="failed_rate" 
                name="Failed Rate" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ r: 4 }}
                />

            </ComposedChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default DailyTrendsChart;