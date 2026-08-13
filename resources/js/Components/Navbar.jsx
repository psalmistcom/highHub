import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";

function ChevronIcon({ open }) {
    return (
        <svg
            viewBox="0 0 12 8"
            className={`h-2.5 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
        >
            <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DesktopDropdown({ group, active, isItemActive }) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef(null);

    const openNow = () => {
        clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const closeSoon = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    };

    return (
        <div
            className="relative"
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
        >
            <button
                className={`focus-ring flex items-center gap-1.5 py-2 text-sm font-medium tracking-wide hover:text-rust ${
                    active ? "text-rust" : "text-bark/90"
                }`}
                aria-expanded={open}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen((o) => !o)}
            >
                {group.label}
                <ChevronIcon open={open} />
            </button>
            {open && (
                <div className="absolute left-1/2 top-full z-30 w-72 -translate-x-1/2 rounded-sm border border-heartwood-200/70 bg-chalk shadow-xl">
                    <div className="plank-divider" />
                    <ul className="py-2">
                        {group.items.length === 0 && (
                            <li className="px-5 py-2.5 text-sm text-bark/40">
                                No items yet
                            </li>
                        )}
                        {group.items.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    aria-current={
                                        isItemActive(item.href)
                                            ? "page"
                                            : undefined
                                    }
                                    className={`focus-ring block px-5 py-2.5 text-sm hover:bg-heartwood-100/60 hover:text-rust ${
                                        isItemActive(item.href)
                                            ? "text-rust"
                                            : "text-bark/85"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function MobileGroup({ group, active, isItemActive }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-heartwood-200/60">
            <button
                className={`focus-ring flex w-full items-center justify-between py-3 text-left text-sm font-medium ${
                    active ? "text-rust" : ""
                }`}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-current={active ? "page" : undefined}
            >
                {group.label}
                <ChevronIcon open={open} />
            </button>
            {open && (
                <ul className="pb-2">
                    {group.items.length === 0 && (
                        <li className="py-2 pl-3 text-sm text-bark/40">
                            No items yet
                        </li>
                    )}
                    {group.items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={
                                    isItemActive(item.href) ? "page" : undefined
                                }
                                className={`focus-ring block py-2 pl-3 text-sm ${
                                    isItemActive(item.href)
                                        ? "text-rust"
                                        : "text-bark/75"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const { nav = [] } = usePage().props;

    const currentPath = usePage().url.split("?")[0];

    const isExactActive = (href) => currentPath === href;
    const isGroupActive = (group) =>
        currentPath === group.href || currentPath.startsWith(`${group.href}/`);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
    }, [mobileOpen]);

    return (
        <header className="sticky top-0 z-40 border-b border-heartwood-200/70 bg-chalk/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
                <Link
                    href={route("home")}
                    className="flex items-center gap-2.5"
                >
                    <ApplicationLogo className="h-12" />
                </Link>

                <nav className="hidden items-center gap-6 lg:flex">
                    <Link
                        href={route("home")}
                        aria-current={isExactActive("/") ? "page" : undefined}
                        className={`focus-ring py-2 text-sm font-medium hover:text-rust ${
                            isExactActive("/") ? "text-rust" : "text-bark/90"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href={route("about")}
                        aria-current={
                            isExactActive("/about-us") ? "page" : undefined
                        }
                        className={`focus-ring py-2 text-sm font-medium hover:text-rust ${
                            isExactActive("/about-us")
                                ? "text-rust"
                                : "text-bark/90"
                        }`}
                    >
                        About Us
                    </Link>
                    {nav.map((group) => (
                        <DesktopDropdown
                            key={group.label}
                            group={group}
                            active={isGroupActive(group)}
                            isItemActive={isExactActive}
                        />
                    ))}
                    {/* <Link
                        href="/downloads"
                        className="focus-ring py-2 text-sm font-medium text-bark/90 hover:text-rust"
                    >
                        Downloads
                    </Link>
                    <Link
                        href="/blog"
                        className="focus-ring py-2 text-sm font-medium text-bark/90 hover:text-rust"
                    >
                        Blog
                    </Link> */}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        href={route("contact.show")}
                        className="focus-ring rounded-sm bg-sap px-4 py-2 text-sm font-medium text-chalk hover:bg-sap-dark"
                    >
                        Contact Us
                    </Link>
                </div>

                <button
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-sm border border-heartwood-300 lg:hidden"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <svg viewBox="0 0 20 16" className="h-4 w-5" fill="none">
                        <path
                            d="M0 1H20M0 8H20M0 15H20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>
            </div>

            {mobileOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[100] bg-bark/40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    >
                        <div
                            className="ml-auto flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-chalk px-5 py-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-heartwood-200/60 pb-3">
                                <span className="font-display text-base font-semibold">
                                    Menu
                                </span>
                                <button
                                    className="focus-ring flex h-8 w-8 items-center justify-center"
                                    onClick={() => setMobileOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <svg
                                        viewBox="0 0 16 16"
                                        className="h-4 w-4"
                                        fill="none"
                                    >
                                        <path
                                            d="M1 1L15 15M15 1L1 15"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <Link
                                href={route("home")}
                                aria-current={
                                    isExactActive("/") ? "page" : undefined
                                }
                                className={`focus-ring border-b border-heartwood-200/60 py-3 text-sm font-medium ${
                                    isExactActive("/") ? "text-rust" : ""
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href={route("about")}
                                aria-current={
                                    isExactActive("/about-us")
                                        ? "page"
                                        : undefined
                                }
                                className={`focus-ring border-b border-heartwood-200/60 py-3 text-sm font-medium ${
                                    isExactActive("/about-us")
                                        ? "text-rust"
                                        : ""
                                }`}
                            >
                                About Us
                            </Link>
                            {nav.map((group) => (
                                <MobileGroup
                                    key={group.label}
                                    group={group}
                                    active={isGroupActive(group)}
                                    isItemActive={isExactActive}
                                />
                            ))}

                            <Link
                                href={route("contact.show")}
                                className="focus-ring mt-4 rounded-sm bg-sap px-4 py-2.5 text-center text-sm font-medium text-chalk"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>,
                    document.body,
                )}
        </header>
    );
}
