import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetPublicServicesQuery } from '../features/Api/publicApi';
import ProjectCropDetailModal from '../components/common/ProjectCropDetailModal';
import { PageHeader, LoadingState, ErrorState, EmptyState, Thumb } from '../components/common/Page';
import { SITE } from '../config/site';

const Services = () => {
    const { data, isLoading, error } = useGetPublicServicesQuery({});
    const [selectedService, setSelectedService] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const services = data?.services || [];

    return (
        <>
            <PageHeader
                title="Services"
                lead="Pick the help you need. Prices are per consultation unless the service says otherwise — no hidden charges, and no obligation to continue."
                action={<a href={SITE.phoneHref} className="btn btn-outline tnum">Call {SITE.phoneDisplay}</a>}
            />

            <div className="shell py-12 sm:py-16">
                {isLoading ? (
                    <LoadingState label="Loading services" />
                ) : error ? (
                    <ErrorState what="the service list" />
                ) : services.length === 0 ? (
                    <EmptyState message="No services are listed right now." />
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <li
                                key={service.id}
                                className="panel overflow-hidden flex flex-col relative hover:border-field transition-colors"
                            >
                                <div className="h-44 bg-husk overflow-hidden">
                                    <Thumb
                                        src={service.featured_media?.optimized_url || service.featured_media?.url}
                                        alt={service.name}
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    {service.tagline && (
                                        <p className="text-sm text-bulb mb-1.5">{service.tagline}</p>
                                    )}

                                    <h2 className="t-h3">
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedService(service); setIsDetailOpen(true); }}
                                            className="text-left after:absolute after:inset-0 after:content-['']"
                                        >
                                            {service.name}
                                        </button>
                                    </h2>

                                    <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed line-clamp-3 flex-1">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 pt-5 border-t border-rule flex items-center justify-between gap-3">
                                        <span className="font-medium tnum">
                                            {service.price
                                                ? `Ksh ${Number(service.price).toLocaleString('en-KE')}`
                                                : 'On request'}
                                        </span>
                                        <Link
                                            to={`/booking?serviceId=${service.id}`}
                                            className="btn btn-primary btn-sm relative z-10"
                                        >
                                            Book
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isDetailOpen && (
                <ProjectCropDetailModal
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    data={selectedService}
                    type="service"
                />
            )}
        </>
    );
};

export default Services;
