import StatusDot from "./StatusDot"
import { type ServerStatusProps } from "../type"


export default function ServerStatus({serverStatus}: {serverStatus: ServerStatusProps}){
    return (
        <div className="p-8 bg-white shadow-xl rounded-3xl mb-12">
            <div className="text-3xl font-semibold mb-6">Server 狀態</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
                <StatusDot status={serverStatus.server1} />
                <span className="text-xl">Scheduler Server：{serverStatus.server1}</span>
            </div>
            <div className="flex items-center gap-4">
                <StatusDot status={serverStatus.server2} />
                <span className="text-xl">Typesense Server：{serverStatus.server2}</span>
            </div>
            </div>
        </div>
    )
    
}