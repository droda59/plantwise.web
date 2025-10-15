import React from 'react';

import { IconSearch, IconX } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
    className?: string;
    filter: string;
    setFilter: (filter: string) => void;
}

export const SearchInput = (props: SearchInputProps) => (
    <div className={`relative ${props.className}`}>
        <IconSearch className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
        <Input className="pl-8" placeholder="Filtrer" value={props.filter || ''} onChange={e => props.setFilter(e.target.value)} />
        <Button className='ml-2' variant='outline' size='icon' onClick={() => props.setFilter('')}>
            <IconX />
        </Button>
    </div>
);
