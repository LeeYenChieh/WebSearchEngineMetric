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
}
