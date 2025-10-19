import CheckIsNotMobile from "@/app/(root)/components/check-is-not-mobile";
import List from "./components/list";
export default function SideListDefault() {

    return (
        <>
            <CheckIsNotMobile>
                <div className="hidden md:flex md:col-span-4 lg:col-span-3">
                    <div className="w-full">
                        <List />
                    </div>
                </div>
            </CheckIsNotMobile>
        </>
    )
}
