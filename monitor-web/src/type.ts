// src/types.ts

// 單日 'detail' 區塊的資料結構
export interface DetailData {
    new_links: number;
    fetch_fail: number;
    stat_date: string;
    typesense_ok: number;
    typesense_fail: number;
    update_rate: number;
    error_count: number;
    ingest_error: number;
    refill_error: number;
    json_read_error: number;
    offered_count: number;
    fetch_ok: number;
    update_count: number;
    failed_rate: number;
    fail_reasons: Record<string, number>;
    // ... 其他欄位
}

// 單日頂層資料結構
export interface DailyStatus {
    discovered: number;
    crawled: number;
    indexed: number;
    detail: DetailData;
}

// 整個 JSON 檔案的結構 (Key 是日期字串)
export type StatusData = Record<string, DailyStatus>;

// 圖表所需的基本資料結構
export interface ChartDataPoint {
    date: string; // 用於 Daily/Weekly/Monthly 軸標籤
    value: number;
    // ... 根據圖表需求增加其他屬性
}

export type TimeRange = 'Daily' | 'Weekly' | 'Monthly';

// 服務健康狀態類型
export type HealthStatus = 'Health' | 'Unhealth' | 'Checking';

// 假設的 BenchMark 數據結構
export interface BenchMarkData {
    date: string;
    score_a: number;
    score_b: number;
    score_c: number;
    score_d: number;
}