import { Link } from "@inertiajs/react";

export default function WabiSection({ wabi }) {
    return (
        <section className="bg-heartwood-100/50">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
                <div className="order-2 aspect-[4/3] rounded-sm bg-rust lg:order-1">
                    <div
                        className="growth-rings h-full w-full rounded-sm opacity-70"
                        aria-hidden="true"
                    >
                        <img
                            src={wabi.image}
                            alt=""
                            className="h-full w-full rounded-sm object-cover"
                        />
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <p className="font-mono text-xs uppercase tracking-widest2 text-heartwood-500">
                        Modular Construction
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-bark sm:text-4xl">
                        {wabi.title}
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-bark/70 sm:text-base">
                        {wabi.body}
                    </p>
                    <ul className="mt-6 space-y-2">
                        {wabi.useCases.map((useCase) => (
                            <li
                                key={useCase}
                                className="flex items-start gap-2.5 text-sm text-bark/80"
                            >
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rust" />
                                {useCase}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-5 text-sm leading-relaxed text-bark/60">
                        {wabi.note}
                    </p>
                    <Link
                        href={wabi.cta.href}
                        className="focus-ring mt-7 inline-block rounded-sm bg-bark px-6 py-3 text-sm font-medium text-chalk hover:bg-bark-light"
                    >
                        {wabi.cta.label}
                    </Link>
                </div>
            </div>
        </section>
    );
}
