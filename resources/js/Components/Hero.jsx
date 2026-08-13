import { Link } from '@inertiajs/react';

export default function Hero({ hero }) {
    return (
        <section className="relative overflow-hidden bg-sap text-chalk">
            <div className="growth-rings pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-chalk/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-8 top-8 h-[300px] w-[300px] rounded-full border border-chalk/10" aria-hidden="true" />
            <div className="pointer-events-none absolute right-24 top-24 h-[180px] w-[180px] rounded-full border border-heartwood-300/30" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
                <p className="font-mono text-xs uppercase tracking-widest2 text-heartwood-300">
                    {hero.eyebrow}
                </p>
                <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                    {hero.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-chalk/80 sm:text-lg">
                    {hero.subtitle}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Link
                        href={hero.ctaPrimary.href}
                        className="focus-ring rounded-sm bg-rust px-6 py-3 text-sm font-semibold text-chalk hover:bg-rust/90"
                    >
                        {hero.ctaPrimary.label}
                    </Link>
                    <a
                        href={hero.ctaSecondary.href}
                        className="focus-ring rounded-sm border border-chalk/30 px-6 py-3 text-sm font-medium text-chalk/90 hover:border-chalk/60"
                    >
                        {hero.ctaSecondary.label}
                    </a>
                </div>
            </div>
            <div className="plank-divider" />
        </section>
    );
}
