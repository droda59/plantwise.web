'use client';

import React, { useEffect, useState } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { IconSearch, IconSlash } from '@tabler/icons-react';
import Link from 'next/link';
import { getFunctionalGroup } from '@/types/functional-groups';
import { groupApiInstance } from '@/api/group-api';
import { createSearchParams } from '@/api/plant-api';
import { Separator } from '@/components/ui/separator';

type GroupEntry = { functionalGroup: string, genus: string, count: number };

interface SectionProps {
    group: string;
    values?: GroupEntry[];
}

const FunctionalGroupSection = ({ group, values }: SectionProps) => {
    const functionalGroup = getFunctionalGroup(group);
    if (!functionalGroup) return false;

    const createGenusSearchParams = (genus: string) => createSearchParams({
        q: genus,
        functionalGroup: functionalGroup.value
    }).toString();

    return (
        <div>
            <Separator className='my-8' />

            <h2 className='text-xl font-semibold'>{functionalGroup.value} - {functionalGroup.label}</h2>
            <div className='mt-4'>{functionalGroup.description}</div>
            <div className='mt-2 text-sm italic text-muted-foreground'>ex. {functionalGroup.species}</div>

            <div className='mt-8'>
                <h3 className='text-lg font-semibold'>Genres</h3>
                <div className='grid grid-cols-2 mt-4'>
                    {values?.map((s, j) => (
                        <div key={`genus-${j}`}>
                            <Link className='flex items-center hover:underline' href={`/search?${createGenusSearchParams(s.genus)}`}>
                                <IconSearch className="w-4 h-4 opacity-40 mr-2" />
                                <i>{s.genus}</i>&nbsp;<span className='text-muted text-sm'>({s.count})</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function FunctionalGroupListPage() {
    const [groupList, setGroupList] = useState<GroupEntry[]>();
    const [filteredList, setFilteredList] = useState<Partial<Record<string, GroupEntry[]>>>();
    const [loading, setLoading] = useState(false);

    const fetchList = async () => {
        setLoading(true);

        const genus = await groupApiInstance.getFunctionalGroups();
        setGroupList(genus);

        setLoading(false);
    };

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        if (groupList?.length) {
            const groupedGenus = Object.groupBy(groupList, ({ functionalGroup }) => functionalGroup);
            // Ensure each species object has a 'count' property
            const groupWithCount = Object.fromEntries(
                Object.entries(groupedGenus)
                    .map(([genus, arr]) => [
                        genus,
                        (arr ?? []).map(s => ({
                            ...s,
                            count: s.count ?? 0, // or provide a default value if count is missing
                        })),
                    ])
            );

            setFilteredList(groupWithCount);
        }
    }, [groupList]);

    return (
        <div className="flex min-h-svh justify-center p-6 md:p-10">
            <main className="w-full max-w-xl min-w-200">
                {!loading && (
                    <>
                        <Breadcrumb className='mb-4'>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><IconSlash /></BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/genus">Groupes fonctionnels</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex-col'>
                            <h1 className='text-3xl font-semibold'>Groupes fonctionnels</h1>

                            <div className='mt-4 text-sm'>
                                <p className='mt-2'>Puisqu'aucune espèce d'arbre ne peut résister à tous les stress, l'exposition aux risques doit être minimisée en augmentant la diversité d'arbres des parcs urbains.</p>
                                <p className='mt-2'>La diversité fonctionnelle ne fait pas référence à l'identité des espèces, mais est plutôt construite sur leurs caractéristiques, ou traits fonctionnels. Cette approche permet de mesurer l'ampleur des différences au niveau des fonctions ou caractéristiques écologiques, ou « distance fonctionnelle » entre deux espèces. Comme on s'intéresse directement aux caractéristiques des espèces, ces indices nous permettent aussi d'évaluer le risque auquel une communauté d'arbres est exposée. Cela est entre autres basé sur le fait que des arbres semblables sont susceptibles d'être affectés en même temps par le même agent perturbateur (un stress ou une maladie, par exemple). Par exemple, les espèces peu tolérantes à la sécheresse seront toutes affectées par une diminution des précipitations dans le futur causé par les changements climatiques.</p>
                                <p className='mt-2'>L'analyse des traits des espèces retrouvées dans les villes québécoises a produit 5 groupes fonctionnels principaux (classes), qu'on peut subdiviser en 10 groupes distincts.</p>
                                <div className='mt-4'>Source: <a className='text-blue-600 dark:text-blue-500 hover:underline' href='https://paqlab.uqam.ca/approche-fonctionnelle.php' target='_blank'>PaqLab</a></div>
                            </div>

                            <div className='flex flex-col'>
                                {Object.entries(filteredList || {}).sort().map(([key, values], i) =>
                                    key && (
                                        <FunctionalGroupSection key={`group-${i}`} group={key} values={values} />
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
