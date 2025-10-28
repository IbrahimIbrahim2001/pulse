import type { Metadata } from 'next';
import { PageHeader } from '../components/page-header';
import SettingConfig from './components/settings-config';

export const metadata: Metadata = {
    title: 'User settings',
    description: 'user setting theme, delete account, etc...',
}

export default function SettingPage() {
    return (
        <div className='col-span-12 mt-12 md:mt-0'>
            <PageHeader pageTitle="Settings" />
            <SettingConfig />
        </div>
    )
}
