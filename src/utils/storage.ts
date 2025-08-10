interface UserInfo {
    name: string;
    email: string;
    website: string;
}

const STORAGE_KEY = 'pomment_user_info';

export function getPommentDefaultUser(): UserInfo | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

export function setPommentDefaultUser(userInfo: UserInfo): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
    } catch {
        // Ignore storage errors
    }
}
