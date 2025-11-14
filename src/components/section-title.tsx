interface SectionTitleProps {
    icon: any;
    title: string;
    children?: React.ReactNode;
}

export function SectionTitle({ icon: Icon, title, children }: SectionTitleProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            {children}
        </div>
    );
}
