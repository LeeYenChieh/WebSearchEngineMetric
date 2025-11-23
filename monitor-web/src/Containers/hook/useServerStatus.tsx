// src/context/ServerStatusContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ServerStatusContextProps, ServerNumStatsProps, ServerStatusProps, GroupCardProps, PerformanceStatCardProps } from "../../type";
import { METRIC } from "../../consts";

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
	const [metrics, setMetrics] = useState<GroupCardProps[]>([]);
	
	// 模擬 server health check
	useEffect(() => {
		const checkCrawlerHealth = async () => {
			try {
				const res = await fetch("http://127.0.0.1:4000/api/crawl/health", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				// ❌ upstream error（可能是 500 / 404 等）
				if (!res.ok) {
					setServerStatus(prev => ({
						...prev,
						server1: "unhealthy"
					}));
					return;
				}

				// ✔ 正常回傳
				const data = await res.json();

				if (data) {
					setServerStatus(prev => ({
						...prev,
						server1: "healthy"
					}));

					setServerNumStats({
						a: data["total_urls"],
						b: data["fetched_urls"],
						c: data["uploaded_urls"],
					});
				}

			} catch(error) {
				console.log(error);
				// ❌ 無法連到 backend（可能 CORS / server down）
				setServerStatus(prev => ({
					...prev,
					server1: "unhealthy",
				}));
			}
		};

		checkCrawlerHealth();
	}, []);

	useEffect(() => {
		const checkTypesenseHealth = async () => {
			try {
				const res = await fetch("http://127.0.0.1:4000/api/typesense/health", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				// ❌ upstream error（可能是 500 / 404 等）
				if (!res.ok) {
					setServerStatus(prev => ({
						...prev,
						server2: "unhealthy"
					}));
					return;
				}

				// ✔ 正常回傳
				const data = await res.json();
				if (data) {
					setServerStatus(prev => ({
						...prev,
						server2: "healthy"
					}));
				}

			} catch(error) {
				console.log(error);
				// ❌ 無法連到 backend（可能 CORS / server down）
				setServerStatus(prev => ({
					...prev,
					server1: "unhealthy",
				}));
			}
		};

		checkTypesenseHealth();
	}, [])

	const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

	useEffect(() => {
		const readFile = async () => {
			const allPerformance: GroupCardProps[] = [];
			for(const t of METRIC){
				const performance: PerformanceStatCardProps[] = [];
				const rawdata = await fetch(`result/${t}_all.json`)
				const data = await rawdata.json()
				console.log(data)
				performance.push({
					title: "Discover",
					performance: data.__total__.discover_find,
					total: data.__total__.total,
					percent: (data.__total__.discover_find / data.__total__.total * 100).toFixed(2)
				})
				performance.push({
					title: "Fetch",
					performance: data.__total__.fetch_find,
					total: data.__total__.total,
					percent: (data.__total__.fetch_find / data.__total__.total * 100).toFixed(2)
				})
				performance.push({
					title: "Upload",
					performance: data.__total__.upload_find,
					total: data.__total__.total,
					percent: (data.__total__.upload_find / data.__total__.total * 100).toFixed(2)
				})
				performance.push({
					title: "Rank",
					performance: 0,
					total: data.__total__.total,
					percent: (0 / data.__total__.total * 100).toFixed(2)
				})
				allPerformance.push({
					title: capitalize(t) + ' Dataset',
					values: performance
				})
			}
			setMetrics(allPerformance);
		}

		readFile();
	}, [])

	return (
		<ServerStatusContext.Provider value={{ 
			serverStatus, setServerStatus,serverNumStats, setServerNumStats, metrics, setMetrics
		}}>
			{children}
		</ServerStatusContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useServerStatus = () => {
	const context = useContext(ServerStatusContext);
	if (!context) {
		throw new Error("useServerStatus must be used within a ServerStatusProvider");
	}
	return context;
};
