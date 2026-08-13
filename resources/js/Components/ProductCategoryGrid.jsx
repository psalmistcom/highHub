import { Link } from "@inertiajs/react";

export default function ProductCategoryGrid({ categories }) {
    return (
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-widest2 text-heartwood-500">
                    Our Products
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-bark sm:text-4xl">
                    Four ways to build in wood
                </h2>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-heartwood-200 bg-heartwood-200 sm:grid-cols-2">
                {categories.map((category, i) => (
                    <div key={category.title} className="bg-chalk p-7 sm:p-8">
                        <span className="font-mono text-xs text-heartwood-500">
                            0{i + 1}
                        </span>
                        <h3 className="mt-2 font-display text-xl font-semibold text-bark">
                            {category.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-bark/65">
                            {category.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
