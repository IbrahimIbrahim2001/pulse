import { protectedProcedure } from "@/lib/trpc";
import z from "zod";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
export const uploadImage = () => {
    return protectedProcedure.input(
        z.object({
            image: z.string(),
        })
    )
        .mutation(async (opts) => {
            try {
                const { image } = opts.input;
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'chat-images',
                    resource_type: 'auto',
                });
                return {
                    success: true,
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                };
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                throw new Error('Failed to upload image');
            }
        })
}