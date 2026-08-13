export default function WhyChooseSection({ whyChoose }) {
    return (
        <section className="bg-heartwood-100/50">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
                <p className="font-mono text-xs uppercase tracking-widest2 text-heartwood-500">
                    Why TIMBERA
                </p>
                <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-bark sm:text-4xl">
                    {whyChoose.title}
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-bark/70 sm:text-base">
                    {whyChoose.intro}
                </p>

                <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {whyChoose.columns.map((column) => (
                        <div
                            key={column.heading}
                            className="border-t-2 border-rust pt-6"
                        >
                            <h3 className="font-display text-xl font-semibold text-bark">
                                {column.heading}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-bark/65">
                                {column.body}
                            </p>
                            <ul className="mt-5 space-y-3">
                                {column.points.map((point) => (
                                    <li
                                        key={point}
                                        className="flex items-start gap-3 text-sm text-bark/80"
                                    >
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sap" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
