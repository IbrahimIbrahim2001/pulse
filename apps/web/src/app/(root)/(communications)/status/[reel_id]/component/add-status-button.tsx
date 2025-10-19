import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function AddStatusButton() {
  return (
    <div className="aspect-[3/4] w-32 flex-shrink-0 rounded-xl relative overflow-hidden group cursor-pointer flex items-center justify-center">
      <Link href={{ pathname: "status/new-status" }} className="w-full h-full">
        <Button className="w-full h-full">
          <PlusIcon className="size-6" />
        </Button>
      </Link>
    </div>
  )
}
