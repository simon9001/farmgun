import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useGetPublicTestimonialsQuery } from '../features/Api/publicApi';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components/common/Page';

const Stars = ({ rating = 5 }) => (
    <p className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                aria-hidden="true"
                className={`w-4 h-4 ${i < rating ? 'fill-bulb text-bulb' : 'text-rule'}`}
            />
        ))}
    </p>
);

const Testimonials = () => {
    const { data, isLoading, error } = useGetPublicTestimonialsQuery({});
    const testimonials = useMemo(() => data?.testimonials || [], [data]);

    // Averaged from the reviews actually shown on this page, so the number is true.
    const average = useMemo(() => {
        const rated = testimonials.filter(t => Number(t.rating) > 0);
        if (!rated.length) return null;
        return (rated.reduce((sum, t) => sum + Number(t.rating), 0) / rated.length).toFixed(1);
    }, [testimonials]);

    return (
        <>
            <PageHeader
                title="What farmers say"
                lead="Reviews left by people who have worked with us, unedited."
                action={<Link to="/booking" className="btn btn-primary">Book a consultation</Link>}
            />

            <div className="shell py-12 sm:py-16">
                {isLoading ? (
                    <LoadingState label="Loading reviews" />
                ) : error ? (
                    <ErrorState what="the reviews" />
                ) : testimonials.length === 0 ? (
                    <EmptyState message="No reviews have been published yet." />
                ) : (
                    <>
                        {average && (
                            <div className="panel p-6 mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                                <span className="font-display text-4xl tnum leading-none">{average}</span>
                                <div>
                                    <Stars rating={Math.round(average)} />
                                    <p className="text-sm text-quiet mt-1.5">
                                        Average across {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                            {testimonials.map((t) => (
                                <li key={t.id} className="panel p-6">
                                    <Stars rating={Number(t.rating) || 5} />

                                    <blockquote className="mt-4 font-display text-[1.0625rem] leading-relaxed">
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
                                            {t.project?.name && (
                                                <p className="text-xs text-quiet truncate mt-0.5">{t.project.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
};

export default Testimonials;
