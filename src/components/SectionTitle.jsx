export function SectionTitle({ icon: Icon, title, subtitle = "" }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
    );
}
