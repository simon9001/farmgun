import React, { useEffect, useRef, useId } from 'react';
import { X, Calendar, Tag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';

const TYPE_LABEL = { project: 'Project', crop: 'Crop', service: 'Service' };

const money = (value) =>
    `Ksh ${Number(value).toLocaleString('en-KE')}`;

const Meta = ({ icon: Icon, children }) => (
    <span className="inline-flex items-center gap-1.5 text-sm text-quiet bg-husk border border-rule rounded-md px-2.5 py-1.5">
        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        {children}
    </span>
);

const Block = ({ title, icon: Icon, children }) => (
    <section>
        <h3 className="flex items-center gap-2 font-medium font-sans text-base">
            {Icon && <Icon className="w-4 h-4 text-field" aria-hidden="true" />}
            {title}
        </h3>
        <div className="mt-2.5">{children}</div>
    </section>
);

const ProjectCropDetailModal = ({ isOpen, onClose, data, type }) => {
    const panelRef = useRef(null);
    const titleId = useId();

    // Escape to close, and lock the page behind the dialog.
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKeyDown);

        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        const prevOverflow = document.body.style.overflow;
        const prevPad = document.body.style.paddingRight;
        document.body.style.overflow = 'hidden';
        if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

        panelRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPad;
        };
    }, [isOpen, onClose]);

    if (!isOpen || !data) return null;

    const images = [
        data.featured_media?.optimized_url || data.featured_media?.url,
        ...(type === 'project'
            ? (data.project_media?.map(pm => pm.media?.optimized_url || pm.media?.url) || [])
            : type === 'service'
                ? (data.service_crops?.map(sc => sc.featured_media?.optimized_url || sc.featured_media?.url) || [])
                : (data.crop_media?.map(cm => cm.media?.optimized_url || cm.media?.url) || [])
        ),
    ].filter(Boolean);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60"
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[0.75rem] w-full max-w-4xl max-h-[90dvh] overflow-hidden flex flex-col md:flex-row border border-rule shadow-2xl outline-none"
            >
                <div className="w-full md:w-1/2 h-56 md:h-auto bg-husk relative shrink-0">
                    <ImageCarousel images={images} className="h-full" />
                </div>

                <div className="w-full md:w-1/2 flex flex-col min-h-0">
                    <div className="flex items-start justify-between gap-4 p-6 pb-0">
                        <div>
                            <p className="text-sm text-bulb">{TYPE_LABEL[type] || type}</p>
                            <h2 id={titleId} className="t-h2 text-[1.5rem] mt-1">{data.name}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="p-2 -mr-2 -mt-1 text-quiet hover:text-ink transition-colors shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-6 pt-4 space-y-6 flex-1">
                        {data.tagline && (
                            <p className="font-display text-lg text-field leading-snug">{data.tagline}</p>
                        )}

                        {(data.start_date || data.end_date || data.scientific_name || data.status) && (
                            <div className="flex flex-wrap gap-2">
                                {data.status && <Meta icon={Tag}>{data.status}</Meta>}
                                {data.start_date && (
                                    <Meta icon={Calendar}>
                                        From <time dateTime={data.start_date}>{new Date(data.start_date).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</time>
                                    </Meta>
                                )}
                                {data.end_date && (
                                    <Meta icon={Calendar}>
                                        To <time dateTime={data.end_date}>{new Date(data.end_date).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</time>
                                    </Meta>
                                )}
                                {data.scientific_name && <Meta icon={Tag}><i>{data.scientific_name}</i></Meta>}
                            </div>
                        )}

                        <Block title="About">
                            <p className="text-[0.9375rem] text-quiet leading-relaxed">
                                {data.description || 'No description has been added yet.'}
                            </p>
                        </Block>

                        {type === 'service' && data.what_get?.length > 0 && (
                            <Block title="What you get" icon={Check}>
                                <ul className="space-y-2">
                                    {data.what_get.map((item, i) => (
                                        <li key={i} className="flex gap-2.5 text-[0.9375rem] text-quiet">
                                            <Check className="w-4 h-4 text-field shrink-0 mt-0.5" aria-hidden="true" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Block>
                        )}

                        {type === 'service' && data.pricing_options?.length > 0 && (
                            <Block title="Pricing" icon={Tag}>
                                <ul className="divide-y divide-rule border border-rule rounded-md">
                                    {data.pricing_options.map((opt, i) => (
                                        <li key={i} className="flex items-center justify-between gap-4 p-3.5">
                                            <span className="min-w-0">
                                                <span className="block text-sm font-medium">{opt.label}</span>
                                                {opt.note && <span className="block text-xs text-quiet mt-0.5">{opt.note}</span>}
                                            </span>
                                            <span className="text-sm font-medium tnum whitespace-nowrap">
                                                {opt.is_custom ? 'On quote' : money(opt.price)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Block>
                        )}

                        {type === 'crop' && data.service_crops?.length > 0 && (
                            <Block title="Related services" icon={Tag}>
                                <ul className="divide-y divide-rule border border-rule rounded-md">
                                    {data.service_crops.map(service => (
                                        <li key={service.id} className="flex items-center justify-between gap-4 p-3.5">
                                            <span className="text-sm font-medium">{service.name}</span>
                                            <span className="text-sm tnum whitespace-nowrap">
                                                {service.price ? money(service.price) : 'On request'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Block>
                        )}
                    </div>

                    <div className="p-6 pt-4 border-t border-rule shrink-0">
                        <Link
                            to={type === 'service' ? `/booking?serviceId=${data.id}` : '/booking'}
                            onClick={onClose}
                            className="btn btn-primary btn-block"
                        >
                            Book a consultation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCropDetailModal;
