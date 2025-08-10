export function formatDateTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
}

export function createSrcsetString(sources: Array<{ size: string; src: string }>): string {
    return sources.map(source => `${source.src} ${source.size}`).join(', ');
}

export function getAvatarUrl(emailHashed: string, size: number, gravatarBaseUrl: string = 'https://secure.gravatar.com/avatar/'): string {
    return `${gravatarBaseUrl}${emailHashed}?s=${size}&d=identicon`;
}

export function getAvatarSrcset(emailHashed: string, size: number, gravatarBaseUrl: string = 'https://secure.gravatar.com/avatar/'): string {
    return createSrcsetString([
        { size: '1x', src: getAvatarUrl(emailHashed, size, gravatarBaseUrl) },
        { size: '2x', src: getAvatarUrl(emailHashed, size * 2, gravatarBaseUrl) }
    ]);
}
