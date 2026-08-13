import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";

const QUICK_LINKS = [
    ["Wood Decking", "/hardwood-decking"],
    ["Wood Cladding", "/wood-cladding"],
    ["Thermowood", "/thermowood-decking-thermory"],
    ["Accoya", "/accoya-wood-decking"],
    ["Mass Timber & Glulam", "/mass-timber-middleeast"],
    ["Contact Us", "/contact-us"],
];

const SOCIAL = [
    ["X", "https://twitter.com/timberasolutions"],
    ["Facebook", "https://www.facebook.com/timberasolutions/"],
    ["Instagram", "https://www.instagram.com/timberasolutions/"],
    ["LinkedIn", "https://www.linkedin.com/company/timberasolutions/"],
];

export default function Footer() {
    const { nav = [] } = usePage().props;

    return (
        <footer className="bg-bark text-chalk">
            <div className="plank-divider" />
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
                <div>
                    <span className="font-display text-xl font-semibold">
                        <ApplicationLogo className="h-10" />
                    </span>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-chalk/65">
                        Timbera, Timber and Landscaping Solutions supplies wood
                        decking, cladding, mass timber and construction wood to
                        contractors, developers and homeowners across Nigeria.
                    </p>
                    <div className="mt-5 flex gap-3">
                        {SOCIAL.map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-chalk/25 text-xs text-chalk/80 hover:border-heartwood-300 hover:text-heartwood-300"
                                aria-label={label}
                            >
                                {label[0]}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest2 text-heartwood-300">
                        Quick Links
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                        {nav.map((label, index) => (
                            <li key={index}>
                                <Link
                                    href={label.href}
                                    className="focus-ring text-sm text-chalk/75 hover:text-chalk"
                                >
                                    {label.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest2 text-heartwood-300">
                        Contact
                    </h3>
                    <address className="mt-4 space-y-1 text-sm not-italic text-chalk/75">
                        <p>10, Afe Olusegun street</p>
                        <p>Ishashi, Berger, Lagos state,</p>
                        <p>Nigeria</p>
                        <p className="pt-2">
                            <a
                                href="mailto:info@timberasolutions.com"
                                className="focus-ring hover:text-chalk"
                            >
                                info@timberasolutions.com
                            </a>
                        </p>
                        <p>
                            <a
                                href="tel:+2347038923017"
                                className="focus-ring hover:text-chalk"
                            >
                                +234 703 892 3017
                            </a>
                        </p>
                    </address>
                </div>
            </div>
            <div className="border-t border-chalk/10 px-5 py-5 text-center text-xs text-chalk/50 lg:px-8">
                © {new Date().getFullYear()} Timbera Solutions. All rights
                reserved | Built by{" "}
                <a
                    href="https://highq.com.ng/"
                    target="_blank"
                    rel=""
                    className="text-fuchsia-100 focus-ring hover:text-chalk"
                >
                    HighQ Innovations
                </a>
            </div>
        </footer>
    );
}
