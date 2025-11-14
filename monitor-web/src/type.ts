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
    values: StatCardProps[];
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
