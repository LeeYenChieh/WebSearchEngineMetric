import { type ServerNumStatsProps } from "../type"
import StatCard from "./StatCard"

export default function URLNumber({ statsTop }: { statsTop: ServerNumStatsProps}){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <StatCard title="Discovered" value={statsTop.a} />
            <StatCard title="Crawled" value={statsTop.b} />
            <StatCard title="Indexed" value={statsTop.c} />
        </div>
    )
}