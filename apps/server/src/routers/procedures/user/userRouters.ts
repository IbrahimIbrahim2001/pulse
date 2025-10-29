import { router } from "@/lib/trpc";
import { deleteUserRooms } from "./deleteUserRooms";
import { getUserData } from "./getUserData";

export const UserRouter = router({
    deleteUserRooms: deleteUserRooms(),
    getUserData: getUserData(),
})