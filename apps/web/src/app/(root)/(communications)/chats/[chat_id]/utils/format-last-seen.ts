export function formatLastSeen(lastSeenAt: Date | null): string {
    if (!lastSeenAt) return 'recently';

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeenAt.getTime()) / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
