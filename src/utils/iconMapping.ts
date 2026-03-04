import React from 'react';
import { 
  Moon, Users, Activity, Target, Calendar, 
  BookOpen, Book, Heart, Star, Award, Clock,
  MapPin, Music, Camera, Gamepad2, Dumbbell,
  Coffee, Utensils, Plane, Train, Car,
  Home, Building, Trees, Mountain, Waves
} from 'lucide-react';

export type IconName = keyof typeof iconMap;

export const iconMap = {
  Moon,
  Users,
  Activity,
  Target,
  Calendar,
  BookOpen,
  Book,
  Heart,
  Star,
  Award,
  Clock,
  MapPin,
  Music,
  Camera,
  Gamepad2,
  Dumbbell,
  Coffee,
  Utensils,
  Plane,
  Train,
  Car,
  Home,
  Building,
  Trees,
  Mountain,
  Waves,
} as const;

export function getIcon(iconName: string): React.ReactElement {
  const iconKey = iconName as IconName;
  
  if (iconKey in iconMap) {
    const IconComponent = iconMap[iconKey];
    return React.createElement(IconComponent);
  }
  
  return React.createElement(Activity); // Default fallback icon
}
