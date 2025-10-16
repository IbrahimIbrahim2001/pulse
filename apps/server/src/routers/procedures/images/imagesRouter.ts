import { router } from "@/lib/trpc";
import { uploadImage } from "./uploadImage";

export const imagesRouter = router({
    uploadImage: uploadImage()
})