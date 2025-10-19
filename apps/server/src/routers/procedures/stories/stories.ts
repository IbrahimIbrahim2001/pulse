import { router } from "@/lib/trpc";
import { newStory } from "./newStory";
import { deleteStory } from "./deleteStroy";
import { getStories } from "./getStories";
import { getStory } from "./getStroy";
import { getMyStory } from "./getMyStory";

export const storiesRouter = router({
    myStory: getMyStory(),
    getStories: getStories(),
    getStory: getStory(),
    newStory: newStory(),
    deleteStory: deleteStory()
})