import '@/styles/globals.css';
import RootLayout from './root-layout';

export default function App({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => (
        <RootLayout>
            {page}
        </RootLayout>
    ));
    return getLayout(<Component {...pageProps} />);
}
