import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"

interface FormElements extends HTMLFormControlsCollection {
    quickAccessCode: HTMLInputElement
}
interface QuickAccessCodeFormElement extends HTMLFormElement {
    readonly elements: FormElements
}

export function SiteHeader() {
    const router = useRouter();

    function handleQuickAccessSearch(event: React.FormEvent<QuickAccessCodeFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            quickAccessCode: HTMLInputElement
        };

        const code = event.currentTarget.elements.quickAccessCode.value;

        router.push(`/plant/${code}`);
    }

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center lg:gap-2 lg:px-6">
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
                                color: '#1b1b1b',
                            }}>PLANT</span>
                            <span style={{
                                color: '#1180be',
                            }}>FINDER</span>
                        </span>
                    </Link>
                </h1>
                <div className="ml-auto flex items-center gap-2">
                    <Separator
                        orientation="vertical"
                        className="mr-2 ml-2 data-[orientation=vertical]:h-4"
                    />
                    <form onSubmit={handleQuickAccessSearch} className='flex mr-2 ml-2 relative'>
                        <IconArrowRight className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <Input id='quickAccessCode' className="pl-2 max-w-24" placeholder="Code" />
                        {/*<Button type='submit' variant='outline' className='ml-2'><IconArrowRight /></Button>*/}
                    </form>
                </div>
            </div>
        </header>
    )
}
