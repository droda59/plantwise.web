import React from 'react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Custom404() {
    return (
        <html lang='fr' className='dark'>
            <body>
                <div className={cn('dark flex w-full flex-col h-[calc(100vh-(--spacing(16)))] text-center justify-center')}>
                    <h1 className='flex text-xl justify-center text-center'>
                        404
                        <Separator
                            orientation='vertical'
                            className='mx-2 data-[orientation=vertical]:h-8'
                        />
                        Cette page n'existe pas.
                    </h1>
                </div>
            </body>
        </html>
    );
}
