// src/context/ServerStatusContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type ServerNumStatsProps, type ServerStatusProps, type GroupCardProps } from "../../type";
import { CRAWLER_URL, CRAWLER_HEALTH_ENDPOINT } from "../../consts";

interface ServerStatusContextProps {
    serverStatus: ServerStatusProps;
    setServerStatus: React.Dispatch<React.SetStateAction<ServerStatusProps>>;
	serverNumStats: ServerNumStatsProps;
	setServerNumStats: React.Dispatch<React.SetStateAction<ServerNumStatsProps>>;
	metrics: GroupCardProps[];
	setMetrics: React.Dispatch<React.SetStateAction<GroupCardProps[]>>;
}

// 建立 context
const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

// Provider
export const ServerStatusProvider = ({ children }: { children: ReactNode }) => {
	// Server status mock
	const [serverStatus, setServerStatus] = useState<ServerStatusProps>({
		server1: "loading",
		server2: "loading",
	});
	// Top Stats mock data
	const [serverNumStats, setServerNumStats] = useState<ServerNumStatsProps>({ a: -1, b: -1, c: -1});

	// Bottom Metrics mock data (可擴充)
	const [metrics, setMetrics] = useState<GroupCardProps[]>([
		{
			title: 'loading',
			values: []
		}, 
	]);
	
	// 模擬 server health check
	useEffect(() => {
		const checkScheduleHealth = async () => {
			try{
				const res = await fetch(`${CRAWLER_HEALTH_ENDPOINT}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				console.log(res)
				const data = await res.json();
				if(data != null){
					setServerStatus(prev => ({
						...prev,           // 保留其他屬性
						server1: "healthy" // 只修改 server1
					}));
					setServerNumStats({
						a: data["total_urls"],
						b: data["fetched_urls"],
						c: data["uploaded_urls"]
					})
				} else{
					setServerStatus({
						server1: "unhealthy",
						server2: "unhealthy"
					});
				}
				return data
			} catch(error){
				return null;
			}
		}

		checkScheduleHealth();
	}, []);

	return (
		<ServerStatusContext.Provider value={{ 
			serverStatus, setServerStatus,serverNumStats, setServerNumStats, metrics, setMetrics
		}}>
			{children}
		</ServerStatusContext.Provider>
	);
};

export const useServerStatus = () => {
	const context = useContext(ServerStatusContext);
	if (!context) {
		throw new Error("useServerStatus must be used within a ServerStatusProvider");
	}
	return context;
};
