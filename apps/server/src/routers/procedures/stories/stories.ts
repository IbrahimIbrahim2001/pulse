import { router } from "@/lib/trpc";
import { newStory } from "./newStory";
import { deleteStory } from "./deleteStroy";
import { getStories } from "./getStories";
import { getStory } from "./getStory";
import { getMyStory } from "./getMyStory";
import { viewStory } from "./viewStory";

export const storiesRouter = router({
    myStory: getMyStory(),
    getStories: getStories(),
    getStory: getStory(),
    newStory: newStory(),
    deleteStory: deleteStory(),
    viewStory: viewStory(),
})