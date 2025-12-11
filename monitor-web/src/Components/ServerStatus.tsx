// src/components/ServerStatus.tsx
import React, { useState, useEffect } from 'react';
import type { HealthStatus } from '../type';

interface StatusProps {
    name: string;
    apiUrl: string;
}

const ServerStatus: React.FC<StatusProps> = ({ name, apiUrl }) => {
    const [status, setStatus] = useState<HealthStatus>('Checking');

    useEffect(() => {
        const checkHealth = async () => {
            setStatus('Checking');
            try {
                // 這裡假設 API 成功回應 HTTP 200 即為 Health
                await axios.get(apiUrl, { timeout: 5000 });
                setStatus('Health');
            } catch (error) {
                setStatus('Unhealth');
            }
        };
        checkHealth();
        // 每 60 秒檢查一次
        const interval = setInterval(checkHealth, 60000); 
        return () => clearInterval(interval);
    }, [apiUrl]);

    const colorMap: Record<HealthStatus, string> = {
        Health: 'bg-green-500',
        Unhealth: 'bg-red-500',
        Checking: 'bg-yellow-500',
    };

    return (
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow">
            <div className={`w-3 h-3 rounded-full ${colorMap[status]}`} />
            <span className="font-semibold">{name} Status:</span>
            <span className={`font-bold ${status === 'Health' ? 'text-green-600' : status === 'Unhealth' ? 'text-red-600' : 'text-yellow-600'}`}>
                {status}
            </span>
        </div>
    );
};

export default ServerStatus;