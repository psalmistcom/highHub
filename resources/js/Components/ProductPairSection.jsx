import { Link } from '@inertiajs/react';

export default function ProductPairSection({ eyebrow, data, tone = 'chalk' }) {
    const bg = tone === 'bark' ? 'bg-bark text-chalk' : 'bg-chalk text-bark';
    const cardBg = tone === 'bark' ? 'bg-bark-light' : 'bg-heartwood-100/50';
    const bodyText = tone === 'bark' ? 'text-chalk/70' : 'text-bark/70';

    return (
        <section className={bg}>
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
                <p className="font-mono text-xs uppercase tracking-widest2 text-heartwood-400">
                    {eyebrow}
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    {data.title}
                </h2>
                <p className={`mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${bodyText}`}>
                    {data.body}
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    {data.products.map((product) => (
                        <div key={product.name} className={`rounded-sm p-7 ${cardBg}`}>
                            <h3 className="font-display text-lg font-semibold">
                                {product.name}
                            </h3>
                            <p className={`mt-3 text-sm leading-relaxed ${bodyText}`}>
                                {product.description}
                            </p>
                            <Link
                                href={product.href}
                                className="focus-ring mt-4 inline-block text-sm font-medium text-heartwood-400 hover:text-rust"
                            >
                                Read more →
                            </Link>
                        </div>
                    ))}
                </div>

                <Link
                    href={data.cta.href}
                    className="focus-ring mt-9 inline-block rounded-sm bg-rust px-6 py-3 text-sm font-semibold text-chalk hover:bg-rust/90"
                >
                    {data.cta.label}
                </Link>
            </div>
        </section>
    );
}
