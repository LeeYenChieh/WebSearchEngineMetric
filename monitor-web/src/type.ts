// src/types.ts

export interface ServerStatusProps {
    server1: ServerStatusType;
    server2: ServerStatusType;
}

// Top Stats
export interface ServerNumStatsProps {
    a: number;
    b: number;
    c: number
}

// GroupCard props
export interface GroupCardProps {
    title: string;
    values: PerformanceStatCardProps[];
}

// Server 狀態
export type ServerStatusType = "loading" | "healthy" | "unhealthy";

// StatusDot props
export interface StatusDotProps {
    status: ServerStatusType;
}

// 卡片 props
export interface StatCardProps {
    title: string;
    value: number;
}

export interface PerformanceStatCardProps {
    title: string;
    performance: number;
    total: number;
    percent: string;
}

export interface ServerStatusContextProps {
    serverStatus: ServerStatusProps;
    setServerStatus: React.Dispatch<React.SetStateAction<ServerStatusProps>>;
    serverNumStats: ServerNumStatsProps;
    setServerNumStats: React.Dispatch<React.SetStateAction<ServerNumStatsProps>>;
    metrics: GroupCardProps[];
    setMetrics: React.Dispatch<React.SetStateAction<GroupCardProps[]>>;
    daily: ServerDailyStat[];
    setDaily: React.Dispatch<React.SetStateAction<ServerDailyStat[]>>;
}

// 根據您提供的 JSON 結構定義介面
export interface ServerDailyStat {
    fetch_ok: number;
    update_count: number;
    typesense_fail: number;
    failed_rate: number;
    fail_reasons: FailReasons; // 或 Record<string, any>，因為沒用到細節先用 any
    upload_error: number;
    offer_error: number;
    maintenance_error: number;
    new_links: number;
    offered_count: number;
    stat_date: string; // '2025-11-23'
    fetch_fail: number;
    typesense_ok: number;
    update_rate: number;
    error_count: number;
    ingest_error: number;
    refill_error: number;
    json_read_error: number;
}

export interface FailReasons {
    [key: string]: number;
}