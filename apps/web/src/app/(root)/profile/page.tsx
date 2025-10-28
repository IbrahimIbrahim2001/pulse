import { PageHeader } from "../components/page-header";
import type { Metadata } from 'next'
import EditProfile from "./components/edit-profile";

export const metadata: Metadata = {
    title: 'User profile',
    description: 'user profile name, password, etc...',
}

export default function ProfilePage() {
    return (
        <div className="col-span-12">
            <PageHeader pageTitle="Profile" />
            <EditProfile />
        </div>
    )
}
