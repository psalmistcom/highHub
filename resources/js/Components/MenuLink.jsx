import { Link } from "@inertiajs/react";

export default function MenuLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            prefetch
            className={
                "py-2 text-sm font-medium text-bark/90 hover:text-rust " +
                (active ? " text-rust" : "") +
                className
            }
        >
            {children}
        </Link>
    );
}
