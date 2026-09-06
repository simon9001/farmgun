import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Loader2, Phone, Star, TrendingUp, TrendingDown, Minus, Quote
} from 'lucide-react';
import {
    useGetPublicCropsQuery,
    useGetPublicProjectsQuery,
    useGetPublicTestimonialsQuery,
    useGetPublicServicesQuery,
    useGetPublicTipsQuery,
    useGetCropPricesQuery,
} from '../features/Api/publicApi';
import About from '../components/About';
import ProjectCropDetailModal from '../components/common/ProjectCropDetailModal';
import { SITE, FACTS } from '../config/site';

import heroField from '../assets/002.jpeg';

/* What an onion and garlic agronomy practice actually covers. Kept honest and
   concrete — this is the question a farmer is asking before they pay anyone. */
const CAPABILITIES = [
    { title: 'Land preparation', body: 'Soil testing, ploughing depth and bed layout before a single seed goes in.' },
    { title: 'Variety & seed rate', body: 'Choosing the variety that suits your soil, altitude and target market.' },
    { title: 'Drip irrigation', body: 'Line spacing, emitter choice and a watering schedule your water source can sustain.' },
    { title: 'Pest & disease', body: 'Thrips, downy mildew and purple blotch — what to spray, when, and what to skip.' },
    { title: 'Curing & storage', body: 'Getting the crop off the field and into store without losing weight or grade.' },
    { title: 'Selling', body: 'Reading the market, timing the harvest and finding a buyer who pays properly.' },
];

const STEPS = [
    { n: 1, title: 'Tell us about your land', body: 'Acreage, water source, altitude and what you have grown before. A short call is enough to start.' },
    { n: 2, title: 'We plan the crop together', body: 'Variety, spacing, irrigation layout, an input schedule and a budget you can actually fund.' },
    { n: 3, title: 'We stay on until harvest', body: 'Check-ins through the season, help when something goes wrong, and support finding a buyer.' },
];

/* Cards show one still image. The auto-rotating carousel stays in the detail
   modal, where it is asked for — a grid of nine simultaneously cross-fading
   carousels is what made the old page feel restless. */
const Thumb = ({ src, alt }) => (
    src ? (
        <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
        />
    ) : (
        <div className="w-full h-full grid place-items-center bg-field-tint text-field font-display text-2xl">
            {alt?.charAt(0)?.toUpperCase() || '·'}
        </div>
    )
);

const SectionHead = ({ title, children, action }) => (
    <div className="section-head flex flex-wrap items-end justify-between gap-4">
        <div>
            <h2 className="t-h2">{title}</h2>
            {children && <p className="t-lead mt-3">{children}</p>}
        </div>
        {action}
    </div>
);

const PriceChange = ({ value }) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n === 0) {
        return <span className="inline-flex items-center gap-1 text-quiet"><Minus className="w-3.5 h-3.5" />0%</span>;
    }
    const up = n > 0;
    const Icon = up ? TrendingUp : TrendingDown;
    return (
        <span className={`inline-flex items-center gap-1 font-medium ${up ? 'text-field' : 'text-bulb'}`}>
            <Icon className="w-3.5 h-3.5" />
            {up ? '+' : ''}{n}%
        </span>
    );
};

const Home = () => {
    const { data: cropsData, isLoading: cropsLoading } = useGetPublicCropsQuery({ featured: true, limit: 9 });
    const { data: projectsData, isLoading: projectsLoading } = useGetPublicProjectsQuery({ featured: true, limit: 6 });
    const { data: testimonialsData, isLoading: testimonialsLoading } = useGetPublicTestimonialsQuery({ featured: true, limit: 3 });
    const { data: servicesData, isLoading: servicesLoading } = useGetPublicServicesQuery({ featured: true, limit: 100 });
    const { data: tipsData } = useGetPublicTipsQuery({ limit: 3 });
    const { data: cropPricesData, isLoading: pricesLoading } = useGetCropPricesQuery({});

    const [selectedItem, setSelectedItem] = useState(null);
    const [detailType, setDetailType] = useState('project');
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const openDetail = (item, type) => {
        setSelectedItem(item);
        setDetailType(type);
        setIsDetailOpen(true);
    };

    const crops = cropsData?.crops || [];
    const projects = projectsData?.projects || [];
    const testimonials = testimonialsData?.testimonials || [];
    const services = servicesData?.services || [];
    const tips = tipsData?.tips || [];
    const prices = (cropPricesData?.prices || []).slice(0, 6);
    const priceDate = cropPricesData?.price_date;

    return (
        <>
            {/* ── Hero ───────────────────────────────────────────────
                A single photograph of a managed crop, not a slideshow.
                Text sits on solid colour so it is legible in daylight on a
                cheap screen — no relying on an overlay for contrast. */}
            <section className="relative bg-field">
                {/* Stacks above the copy on a phone; bleeds off the right edge on
                    desktop while the copy stays on the page grid, so the headline
                    lines up with the wordmark in the header. */}
                <div className="h-56 sm:h-72 lg:h-auto lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        src={heroField}
                        alt="A drip-irrigated red onion crop in the field, bulbs forming at the base of the leaves"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        decoding="async"
                        width="1125"
                        height="1125"
                    />
                </div>

                <div className="shell relative">
                    <div className="lg:w-1/2 lg:pr-14 py-12 lg:py-24 lg:min-h-[34rem] flex flex-col justify-center">
                        <h1 className="t-display text-white rise rise-1">
                            Onions and garlic,<br />grown to sell.
                        </h1>

                        <p className="mt-6 text-white/80 leading-relaxed text-[1.0625rem] sm:text-lg max-w-[34rem] rise rise-2">
                            I am {SITE.person}. I advise Kenyan farmers on land preparation,
                            spacing, irrigation and pest control &mdash; and on getting a fair price
                            when the crop comes off. Everything I teach, I have run on my own farm first.
                        </p>

                        <div className="mt-9 flex flex-col sm:flex-row gap-3 rise rise-3">
                            <Link to="/booking" className="btn btn-onfield">
                                Book a consultation
                            </Link>
                            <a href={SITE.phoneHref} className="btn btn-ghost-onfield">
                                <Phone className="w-4 h-4" />
                                <span className="tnum">{SITE.phoneDisplay}</span>
                            </a>
                        </div>

                        {(FACTS.basedIn || FACTS.yearsFarming) && (
                            <p className="mt-8 text-sm text-white/55 rise rise-4">
                                {[FACTS.yearsFarming && `${FACTS.yearsFarming} years in the field`, FACTS.basedIn]
                                    .filter(Boolean)
                                    .join(' — ')}
                            </p>
                        )}
                    </div>
                </div>
            </section>


            {/* ── What the work covers ─────────────────────────────── */}
            <section className="section bg-white">
                <div className="shell">
                    <SectionHead title="What a consultation covers">
                        The whole season, not just the planting. Most losses happen after the
                        crop is already in the ground.
                    </SectionHead>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-rule">
                        {CAPABILITIES.map(({ title, body }) => (
                            <div key={title} className="border-b border-r border-rule p-6 lg:p-7">
                                <h3 className="t-h3">{title}</h3>
                                <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Services, with prices in the open ─────────────────── */}
            <section className="section bg-husk">
                <div className="shell">
                    <SectionHead
                        title="Services and what they cost"
                        action={<Link to="/services" className="link">See all services</Link>}
                    >
                        No hidden pricing. Pick what you need and book a time that suits you.
                    </SectionHead>

                    {servicesLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-field" /></div>
                    ) : services.length === 0 ? (
                        <p className="text-quiet">Services are being updated. Call {SITE.phoneDisplay} and we will talk it through.</p>
                    ) : (
                        <ul className="panel divide-y divide-rule overflow-hidden">
                            {services.slice(0, 6).map((service) => {
                                const img = service.featured_media?.optimized_url || service.featured_media?.url;
                                return (
                                    <li key={service.id}>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 hover:bg-husk/60 transition-colors">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(service, 'service')}
                                                className="flex items-center gap-4 text-left flex-1 min-w-0"
                                            >
                                                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-field-tint shrink-0 grid place-items-center text-field font-display text-xl">
                                                    {img
                                                        ? <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                        : service.name?.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block font-medium text-ink">{service.name}</span>
                                                    <span className="block text-sm text-quiet mt-1 line-clamp-2">{service.description}</span>
                                                </span>
                                            </button>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:shrink-0 pl-20 sm:pl-0">
                                                <span className="font-medium tnum whitespace-nowrap">
                                                    {service.price ? `Ksh ${Number(service.price).toLocaleString('en-KE')}` : 'On request'}
                                                </span>
                                                <Link to={`/booking?serviceId=${service.id}`} className="btn btn-primary btn-sm">
                                                    Book
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </section>

            {/* ── How it works. Numbered because it genuinely is a sequence. */}
            <section className="section bg-white">
                <div className="shell">
                    <SectionHead title="How working together goes" />

                    <ol className="grid gap-8 md:grid-cols-3">
                        {STEPS.map(({ n, title, body }) => (
                            <li key={n}>
                                <span className="block font-display text-3xl text-bulb tnum leading-none">{n}</span>
                                <h3 className="t-h3 mt-4">{title}</h3>
                                <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed">{body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ── Market prices. Real, dated data — the reason to come back. */}
            {(pricesLoading || prices.length > 0) && (
                <section className="section bg-husk">
                    <div className="shell">
                        <SectionHead title="What crops are fetching right now">
                            {priceDate
                                ? `Market prices recorded ${new Date(priceDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                                : 'Recent market prices, so you can time your harvest.'}
                        </SectionHead>

                        {pricesLoading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-field" /></div>
                        ) : (
                            <div className="panel overflow-x-auto">
                                <table className="w-full text-sm min-w-[34rem]">
                                    <thead>
                                        <tr className="text-left text-quiet border-b border-rule">
                                            <th scope="col" className="font-medium px-5 py-3">Crop</th>
                                            <th scope="col" className="font-medium px-5 py-3">Market</th>
                                            <th scope="col" className="font-medium px-5 py-3 text-right">Price</th>
                                            <th scope="col" className="font-medium px-5 py-3 text-right">Day change</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-rule">
                                        {prices.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-5 py-3.5 font-medium">{item.crop_name}</td>
                                                <td className="px-5 py-3.5 text-quiet">{item.market}</td>
                                                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                                    Ksh {Number(item.price_per_unit).toLocaleString('en-KE')}
                                                    <span className="text-quiet"> /{item.unit}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <PriceChange value={item.price_change} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── Crops ─────────────────────────────────────────────── */}
            <section className="section bg-white">
                <div className="shell">
                    <SectionHead
                        title="Crops we work with"
                        action={<Link to="/crops" className="link">All crops</Link>}
                    >
                        High-value crops where good agronomy makes a visible difference to the cheque.
                    </SectionHead>
                </div>

                {cropsLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-field" /></div>
                ) : (
                    <div className="shell">
                        <ul className="rail no-scrollbar">
                            {crops.map((crop) => (
                                <li
                                    key={crop.id}
                                    className="panel overflow-hidden flex flex-col relative hover:border-field transition-colors"
                                >
                                    <div className="h-44 bg-husk overflow-hidden">
                                        <Thumb
                                            src={crop.featured_media?.optimized_url || crop.featured_media?.url}
                                            alt={crop.name}
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-medium text-ink font-sans text-base">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(crop, 'crop')}
                                                className="text-left after:absolute after:inset-0 after:content-['']"
                                            >
                                                {crop.name}
                                            </button>
                                        </h3>
                                        <p className="text-sm text-quiet mt-1.5 line-clamp-3 leading-relaxed">{crop.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* ── Field work ────────────────────────────────────────── */}
            {(projectsLoading || projects.length > 0) && (
                <section className="section bg-husk">
                    <div className="shell">
                        <SectionHead
                            title="Field work"
                            action={<Link to="/projects" className="link">All projects</Link>}
                        >
                            Farms we have planned, planted and seen through to harvest.
                        </SectionHead>

                        {projectsLoading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-field" /></div>
                        ) : (
                            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project) => (
                                    <li
                                        key={project.id}
                                        className="relative h-64 rounded-[0.625rem] overflow-hidden bg-ink"
                                    >
                                        <Thumb
                                            src={project.featured_media?.optimized_url || project.featured_media?.url}
                                            alt={project.name}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink via-ink/70 to-transparent">
                                            <h3 className="font-medium text-white font-sans text-base">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetail(project, 'project')}
                                                    className="text-left after:absolute after:inset-0 after:content-['']"
                                                >
                                                    {project.name}
                                                </button>
                                            </h3>
                                            <p className="text-sm text-white/70 mt-1 line-clamp-2">{project.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}

            {/* ── Field notes. Was a floating pop-up; now it just sits on the page. */}
            {tips.length > 0 && (
                <section className="section bg-white">
                    <div className="shell">
                        <SectionHead
                            title="Field notes"
                            action={<Link to="/blogs" className="link">Read the guides</Link>}
                        />
                        <ul className="grid gap-6 md:grid-cols-3">
                            {tips.map((tip) => (
                                <li key={tip.id} className="border-l-2 border-bulb pl-5">
                                    <h3 className="font-medium text-ink">{tip.title}</h3>
                                    <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed line-clamp-4">
                                        {tip.excerpt || tip.content}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* ── About ─────────────────────────────────────────────── */}
            <About />

            {/* ── Testimonials ──────────────────────────────────────── */}
            {(testimonialsLoading || testimonials.length > 0) && (
                <section className="section bg-white">
                    <div className="shell">
                        <SectionHead
                            title="What farmers say"
                            action={<Link to="/testimonials" className="link">More results</Link>}
                        />

                        {testimonialsLoading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-field" /></div>
                        ) : (
                            <ul className="grid gap-6 md:grid-cols-3">
                                {testimonials.map((t) => (
                                    <li key={t.id} className="panel p-6 flex flex-col">
                                        <Quote className="w-6 h-6 text-field-tint shrink-0" aria-hidden="true" />
                                        <blockquote className="mt-3 flex-1 font-display text-[1.0625rem] leading-relaxed text-ink">
                                            {t.comment}
                                        </blockquote>
                                        <div className="mt-5 pt-5 border-t border-rule flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full overflow-hidden bg-field-tint grid place-items-center text-field font-semibold shrink-0">
                                                {t.user_media?.optimized_url
                                                    ? <img src={t.user_media.optimized_url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                    : t.user_name?.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{t.user_name}</p>
                                                <p className="flex gap-0.5 mt-1" aria-label={`${t.rating || 5} out of 5`}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            aria-hidden="true"
                                                            className={`w-3.5 h-3.5 ${i < (t.rating || 5) ? 'fill-bulb text-bulb' : 'text-rule'}`}
                                                        />
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}

            {/* ── Close ─────────────────────────────────────────────── */}
            <section className="bg-field">
                <div className="shell py-16 sm:py-20 text-center">
                    <h2 className="t-h2 text-white">Planning your next crop?</h2>
                    <p className="mt-4 text-white/75 max-w-xl mx-auto leading-relaxed">
                        Bring your acreage and your water source. We will work out what to plant,
                        what it will cost, and what you should expect back.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/booking" className="btn btn-onfield">Book a consultation</Link>
                        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-onfield">
                            Message on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {isDetailOpen && (
                <ProjectCropDetailModal
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    data={selectedItem}
                    type={detailType}
                />
            )}
        </>
    );
};

export default Home;
