import React, { useState } from 'react';
import { useGetPublicCropsQuery } from '../features/Api/publicApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ArrowRight, Sprout } from 'lucide-react';
import ImageCarousel from '../components/common/ImageCarousel';
import ProjectCropDetailModal from '../components/common/ProjectCropDetailModal';

const Crops = () => {
    const { data, isLoading, error } = useGetPublicCropsQuery({});
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh] text-red-500">
                <AlertCircle className="w-10 h-10 mb-2" />
                <p>Failed to load crops. Please try again later.</p>
            </div>
        );
    }

    const crops = data?.crops || [];

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Crops I Deal With
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    High-yield crops and modern farming expertise
                </p>
            </motion.div>

            {crops.length === 0 ? (
                <p className="text-center text-gray-500">No crops available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {crops.map((crop, index) => (
                        <motion.div
                            key={crop.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group h-full flex flex-col cursor-pointer"
                            onClick={() => {
                                setSelectedCrop(crop);
                                setIsDetailOpen(true);
                            }}
                        >
                            <div className="h-48 relative overflow-hidden">
                                <ImageCarousel
                                    images={[
                                        crop.featured_media?.optimized_url || crop.featured_media?.url,
                                        ...(crop.crop_media?.map(cm => cm.media?.optimized_url || cm.media?.url) || [])
                                    ].filter(Boolean)}
                                />
                                <div className="absolute top-3 right-3">
                                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Sprout className="w-5 h-5 text-green-500" />
                                    {crop.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {crop.description}
                                </p>
                                <div className="mt-auto">
                                    <button
                                        className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {isDetailOpen && (
                    <ProjectCropDetailModal
                        isOpen={isDetailOpen}
                        onClose={() => setIsDetailOpen(false)}
                        data={selectedCrop}
                        type="crop"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Crops;
