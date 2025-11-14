import GroupCard from "./GroupStatCard"
import { type GroupCardProps } from "../type"

export default function MetricsCard({metrics}: {metrics: GroupCardProps[]}){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {metrics.map((metric) => (
                <GroupCard key={metric.title} title={metric.title} values={metric.values} />
            ))}
        </div>
    )
}