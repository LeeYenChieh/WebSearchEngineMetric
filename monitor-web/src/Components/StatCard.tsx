import type { StatCardProps } from "../type";

export default function StatCard({ title, value }: StatCardProps){
    return(
        <div className="p-8 bg-white shadow-xl rounded-3xl flex flex-col items-center">
            <div className="text-3xl font-semibold">{title}</div>
            <div className="text-5xl font-bold mt-4">{value}</div>
        </div>
    )
}