import { type GroupCardProps } from "../type"

export default function GroupCard({ title, values }: GroupCardProps){
    return (
        <div className="p-8 bg-white shadow-xl rounded-3xl">
            <div className="text-3xl font-semibold mb-6">{title}</div>
            <div className="grid grid-cols-2 gap-4">
                {values.map((value) => (
                    <div key={value.title} className="p-4 bg-gray-100 rounded-2xl flex flex-col items-center">
                        <div className="text-xl font-medium">{value.title}</div>
                        <div className="text-3xl font-bold mt-2">{value.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}