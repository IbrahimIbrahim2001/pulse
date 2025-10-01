export function formatLastMessageTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return "now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h`;
    } else if (diffInDays === 1) {
        return "1d";
    } else if (diffInDays < 7) {
        return `${diffInDays}d`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks}w`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}