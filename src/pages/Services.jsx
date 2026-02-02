import React from 'react';
import { useGetPublicServicesQuery } from '../features/Api/publicApi';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    const { data, isLoading, error } = useGetPublicServicesQuery({});

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
                <p>Failed to load services. Please try again later.</p>
            </div>
        );
    }

    const services = data?.services || [];

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Our Services
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Professional agricultural consultation and support
                </p>
            </motion.div>

            {services.length === 0 ? (
                <p className="text-center text-gray-500">No services available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                        >
                            <div className="h-48 bg-green-100 dark:bg-green-900/30 flex items-center justify-center overflow-hidden">
                                {service.featured_media?.optimized_url ? (
                                    <img
                                        src={service.featured_media.optimized_url}
                                        alt={service.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-green-600 font-medium">No Image</span>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {service.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-green-600">
                                        {service.price ? `Ksh ${service.price}` : 'Contact for Price'}
                                    </span>
                                    <Link
                                        to={`/booking?serviceId=${service.id}`}
                                        className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Services;
