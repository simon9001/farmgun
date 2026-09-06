import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetPublicCropsQuery } from '../features/Api/publicApi';
import ProjectCropDetailModal from '../components/common/ProjectCropDetailModal';
import { PageHeader, LoadingState, ErrorState, EmptyState, Thumb } from '../components/common/Page';

const Crops = () => {
    const { data, isLoading, error } = useGetPublicCropsQuery({});
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const crops = data?.crops || [];

    return (
        <>
            <PageHeader
                title="Crops we work with"
                lead="Onions and garlic are the specialty, but the same agronomy applies across these crops. Open any one to see varieties, spacing and what to watch for."
                action={<Link to="/booking" className="btn btn-primary">Book a consultation</Link>}
            />

            <div className="shell py-12 sm:py-16">
                {isLoading ? (
                    <LoadingState label="Loading crops" />
                ) : error ? (
                    <ErrorState what="the crop list" />
                ) : crops.length === 0 ? (
                    <EmptyState message="No crops are listed right now." />
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {crops.map((crop) => (
                            <li
                                key={crop.id}
                                className="panel overflow-hidden flex flex-col relative hover:border-field transition-colors"
                            >
                                <div className="h-48 bg-husk overflow-hidden">
                                    <Thumb
                                        src={crop.featured_media?.optimized_url || crop.featured_media?.url}
                                        alt={crop.name}
                                    />
                                </div>

                                <div className="p-6">
                                    <h2 className="t-h3">
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedCrop(crop); setIsDetailOpen(true); }}
                                            className="text-left after:absolute after:inset-0 after:content-['']"
                                        >
                                            {crop.name}
                                        </button>
                                    </h2>
                                    <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed line-clamp-3">
                                        {crop.description}
                                    </p>
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
                    data={selectedCrop}
                    type="crop"
                />
            )}
        </>
    );
};

export default Crops;
