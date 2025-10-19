// lib/cron/storyCleanup.ts
import prisma from "@/prisma";

export async function cleanupExpiredStories() {
    try {
        const now = new Date();

        const result = await prisma.story.deleteMany({
            where: {
                expiresAt: {
                    lt: now
                }
            }
        });

        console.log(`Cleaned up ${result.count} expired stories`);
        return result.count;
    } catch (error) {
        console.error('Failed to cleanup stories:', error);
        throw error;
    }
}