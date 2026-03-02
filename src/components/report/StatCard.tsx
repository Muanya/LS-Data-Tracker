import type { FC } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    accent?: string;
    icon?: string;
}

const StatCard: FC<StatCardProps> = ({ label, value, accent = "#e2e8f0", icon }) => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white border-[1.5px] p-4 md:p-5 flex flex-col gap-1.5 min-w-[130px] shadow-sm">
            <div 
                className="absolute -top-2 -right-2 w-12 h-12 rounded-full opacity-10"
                style={{ backgroundColor: accent }}
            />
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {label}
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 font-mono leading-none">
                {value ?? "—"}
            </span>
        </div>
    );
};

export default StatCard;
