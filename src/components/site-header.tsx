'use client';

import { IconArrowRight } from "@tabler/icons-react"

import Link from "next/link"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { VSeparator } from '@/components/vertical-separator';
import { useProject } from "./project-context";
import { Badge } from "./ui/badge";

interface FormElements extends HTMLFormControlsCollection {
    quickAccessCode: HTMLInputElement
}
interface QuickAccessCodeFormElement extends HTMLFormElement {
    readonly elements: FormElements
}

export function SiteHeader({ className }: { className?: string }) {
    const router = useRouter();
    const { projectPlants } = useProject();

    function handleQuickAccessSearch(event: React.FormEvent<QuickAccessCodeFormElement>) {
        event.preventDefault();
        const code = event.currentTarget.elements.quickAccessCode.value;

        router.push(`/plant/${code}`);
    }

    return (
        <header className={cn("flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)", className)}>
            <div className="flex w-full items-center lg:gap-2 lg:px-4">
                <h1 className="text-base font-medium">
                    <Link className='flex items-center flex-col p-4' href='/'>
                        {/*<img
                            className='dark:invert'
                            src='/reliefDesign.jpg'
                            alt='ReliefDesign logo'
                            width={100}
                        /> */}
                        <span style={{
                            fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
                            fontWeight: 'normal',
                        }}>
                            <span style={{
                                color: '#e2e5e8',
                            }}>PLANT</span>
                            <span style={{
                                color: '#1180be',
                            }}>FINDER</span>
                        </span>
                    </Link>
                </h1>
                <div className="ml-auto flex items-center gap-2">
                    <Link className={cn('text-sm', !projectPlants.length && 'text-muted-foreground')} href='/project' style={!projectPlants.length ? { pointerEvents: 'none' } : {}}>
                        Projet
                        {projectPlants.length > 0 &&
                            <Badge
                                className="h-5 min-w-5 rounded-full px-1 ml-2 font-mono tabular-nums"
                                variant="outline"
                            >
                                {projectPlants.length > 99 ? '99+' : projectPlants.length}
                            </Badge>
                        }
                    </Link>
                    <VSeparator />
                    <Link className='text-sm' href='/functional-groups'>Groupes fonctionnels</Link>
                    <VSeparator />
                    <Link className='text-sm' href='/genus'>Par genre</Link>
                    <VSeparator />
                    <Link className='text-sm' href='/species'>Par espèce</Link>
                    <VSeparator />
                    <form onSubmit={handleQuickAccessSearch} className='flex mr-2 ml-2 relative'>
                        <IconArrowRight className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <Input id='quickAccessCode' className="pl-2 max-w-24" placeholder="Code" />
                    </form>
                </div>
            </div>
        </header>
    )
}
