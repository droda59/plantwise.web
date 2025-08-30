import { IconBrandGithub } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">
                    <div className='flex items-center flex-col sm:flex-row'>
                        {/*<img
                            className='dark:invert'
                            src='/reliefDesign.jpg'
                            alt='ReliefDesign logo'
                            width={100}
                        /> */}
                        <span style={{
                            color: '#1b1b1b',
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
                    </div>
                </h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <a
                            href='https://github.com/droda59/plantwise.web'
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <IconBrandGithub />
                            <span>GitHub</span>
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    )
}
