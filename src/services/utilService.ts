import type { User } from "../utils/types";

export class UtilService {

    static processUser(temp: User[]) {
        return temp.map(user => ({
            ...user,
            avatarColor: this.getRandomColor()
        }));
    }

    static getRandomColor() {
        const colors = [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static handleLogout() {
        localStorage.removeItem('lakeside_auth');
        window.location.href = '/';
    }
}