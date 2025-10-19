import cron from 'node-cron';
import { cleanupExpiredStories } from './storyCleanup';

export function setupCronJobs() {
    // Run every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log('Running story cleanup job...');
        await cleanupExpiredStories();
    });

    console.log('Cron jobs scheduled');
}