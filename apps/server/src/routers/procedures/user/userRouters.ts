import { router } from "@/lib/trpc";
import { deleteUserRooms } from "./deleteUserRooms";

export const UserRouter = router({
    deleteUserRooms: deleteUserRooms()
})