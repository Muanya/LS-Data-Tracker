import type { ActivityName } from '../../utils/types';

export const ACTIVITIES: ActivityName[] = ["Med", "Retreat", "Recollection", "Circle"];

export const ACCENT: Record<ActivityName, string> = {
    Med: "#818cf8",
    Retreat: "#38bdf8",
    Recollection: "#34d399",
    Circle: "#fbbf24",
};

export const ACTIVITY_ICON: Record<ActivityName, string> = {
    Med: "🧘",
    Retreat: "⛺",
    Recollection: "📖",
    Circle: "🔵",
};
