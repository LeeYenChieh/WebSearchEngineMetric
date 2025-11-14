import { type ServerStatusType } from "../type";

export default function StatusDot({ status }: { status: ServerStatusType }){
    const color =
        status === "healthy"
        ? "bg-green-500"
        : status === "unhealthy"
        ? "bg-red-500"
        : "bg-gray-400 animate-pulse";
    return <div className={`w-5 h-5 rounded-full ${color}`}></div>;
};