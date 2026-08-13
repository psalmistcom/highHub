import { Link } from "@inertiajs/react";

export default function NavLink({
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
                "inline-flex items-center rounded-md text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none pl-4 py-3 mx-3 " +
                (active
                    ? " bg-sap-light text-white focus:border-sap "
                    : " text-gray-900  hover:text-sap-light transition-all ") +
                className
            }
        >
            {children}
        </Link>
    );
}
