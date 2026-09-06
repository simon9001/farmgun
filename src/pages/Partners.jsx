import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Award } from 'lucide-react';
import { useGetActivePartnersQuery } from '../features/Api/partnersApi';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components/common/Page';

const BENEFITS = [
    {
        title: 'Checked before they are listed',
        desc: 'Every partner here has been vetted for reliability. If they let a farmer down, they come off the list.',
    },
    {
        title: 'They know the crop',
        desc: 'Suppliers and financiers who understand onion and garlic cycles, not generic agribusiness.',
    },
    {
        title: 'One less thing to research',
        desc: 'Inputs, equipment and financing in one place, so you are not starting from scratch every season.',
    },
];

const PartnerCard = ({ partner }) => (
    <li className="panel p-6 flex flex-col hover:border-field transition-colors">
        <div className="flex items-start justify-between gap-4">
            <div className="w-14 h-14 rounded-md bg-husk border border-rule grid place-items-center overflow-hidden shrink-0">
                {partner.logo?.url
                    ? <img src={partner.logo.url} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain p-1.5" />
                    : <span className="font-display text-xl text-field">{partner.name?.charAt(0)}</span>}
            </div>
            {partner.is_featured && (
                <span className="flex items-center gap-1.5 text-xs text-bulb" title="Featured partner">
                    <Award className="w-3.5 h-3.5" aria-hidden="true" />
                    Featured
                </span>
            )}
        </div>

        {partner.category && (
            <p className="text-sm text-quiet mt-4">{partner.category}</p>
        )}

        <h2 className="t-h3 mt-1">{partner.name}</h2>

        <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed line-clamp-3 flex-1">
            {partner.description || `${partner.category || 'Agricultural'} services for Kenyan growers.`}
        </p>

        {partner.website_url && (
            <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link inline-flex items-center gap-1.5 mt-5 self-start"
            >
                Visit website
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
        )}
    </li>
);

const Partners = () => {
    const { data, isLoading, error } = useGetActivePartnersQuery();
    const [activeCategory, setActiveCategory] = useState('All');

    const partners = useMemo(() => data?.partners || [], [data]);

    const categories = useMemo(
        () => ['All', ...Array.from(new Set(partners.map(p => p.category).filter(Boolean)))],
        [partners]
    );

    const filtered = useMemo(
        () => activeCategory === 'All' ? partners : partners.filter(p => p.category === activeCategory),
        [partners, activeCategory]
    );

    return (
        <>
            <PageHeader
                title="Partners"
                lead="Suppliers, financiers and equipment providers we send farmers to. We only list people we would use ourselves."
                action={<Link to="/partners/apply" className="btn btn-outline">Become a partner</Link>}
            />

            <div className="shell py-12 sm:py-16">
                {isLoading ? (
                    <LoadingState label="Loading partners" />
                ) : error ? (
                    <ErrorState what="the partner list" />
                ) : partners.length === 0 ? (
                    <EmptyState message="No partners are listed yet." cta={false} />
                ) : (
                    <>
                        {categories.length > 2 && (
                            <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter partners by category">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        aria-pressed={activeCategory === cat}
                                        className={`px-3.5 py-2 rounded-md text-sm border transition-colors
                                            ${activeCategory === cat
                                                ? 'bg-field text-white border-field'
                                                : 'bg-white border-rule text-quiet hover:border-field hover:text-field'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        {filtered.length === 0 ? (
                            <p className="py-16 text-center text-quiet">
                                No partners listed under {activeCategory} yet.
                            </p>
                        ) : (
                            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map(partner => (
                                    <PartnerCard key={partner.id} partner={partner} />
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>

            <section className="section bg-white border-t border-rule">
                <div className="shell">
                    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <h2 className="t-h2">Why we keep a partner list</h2>
                            <p className="t-lead mt-4">
                                Most of the money farmers lose is lost off the field &mdash; on the wrong
                                seed, the wrong loan, or a supplier who never delivered.
                            </p>
                        </div>

                        <ul className="space-y-6">
                            {BENEFITS.map(({ title, desc }) => (
                                <li key={title} className="border-l-2 border-bulb pl-5">
                                    <h3 className="font-medium">{title}</h3>
                                    <p className="mt-1.5 text-[0.9375rem] text-quiet leading-relaxed">{desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bg-field">
                <div className="shell py-16 text-center">
                    <h2 className="t-h2 text-white">Work with us</h2>
                    <p className="mt-4 text-white/75 max-w-xl mx-auto leading-relaxed">
                        If you supply inputs, equipment or financing to Kenyan growers and you
                        deliver on what you promise, we would like to hear from you.
                    </p>
                    <Link to="/partners/apply" className="btn btn-onfield mt-8">Apply to be listed</Link>
                </div>
            </section>
        </>
    );
};

export default Partners;
