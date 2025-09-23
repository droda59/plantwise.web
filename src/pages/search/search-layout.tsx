import { SiteHeader } from '@/components/site-header';
import '@/styles/globals.css';

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <SiteHeader className='fixed w-full' />
            {children}
        </div>
    )
}
