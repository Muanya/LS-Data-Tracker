import React, { useState } from 'react';
import type { Activity } from '../utils/types';
import { Card } from './ui/Card';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface ActivitySelectModalProps {
    selectedActivity: string;
    isOpen: boolean;
    onClose: () => void;
    activities: Activity[];
    onSelectActivity: (activity: Activity) => void;
}

const ActivitySelectModal: React.FC<ActivitySelectModalProps> = ({
    selectedActivity,
    isOpen,
    activities,
    onClose,
    onSelectActivity
}) => {
    if (!isOpen) return null;

    const [selectedActivityState, setSelectedActivity] = useState<string>(selectedActivity);

    const handleSelectActivity = (activity: Activity) => {
        setSelectedActivity(activity.id);
        onSelectActivity(activity);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative w-full max-w-4xl">
                    <Card className="animate-slide-up max-h-[90vh] flex flex-col">
                        {/* Modal content */}
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                            Select One
                        </h3>
                        {activities.map((activity) => (
                            <button
                                key={activity.id}
                                onClick={() => handleSelectActivity(activity)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${selectedActivityState === activity.id
                                    ? `border-${activity.color}-500 bg-${activity.color}-50 ring-2 ring-${activity.color}-200`
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${activity.gradient} rounded-xl flex items-center justify-center`}>
                                    <div className="w-6 h-6 text-white">
                                        {activity.icon}
                                    </div>
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold text-gray-900">{activity.name}</div>
                                    <div className="text-sm text-gray-500">{activity.frequency}</div>
                                </div>
                                {selectedActivityState === activity.id && (
                                    <CheckCircle className="w-5 h-5 text-primary-500" />
                                )}
                            </button>
                        ))}

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                fullWidth
                                className="sm:flex-1"
                            >
                                Close
                            </Button>

                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ActivitySelectModal;