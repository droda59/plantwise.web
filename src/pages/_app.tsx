import '@/styles/globals.css';
import RootLayout from './root-layout';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => (
        <RootLayout>
            {page}
        </RootLayout>
    ));
    return getLayout(<Component {...pageProps} />);
}
