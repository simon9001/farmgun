import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { ExternalLink, Loader2, Award, Users, Filter, ArrowRight } from 'lucide-react';
import { useGetActivePartnersQuery } from '../features/Api/partnersApi';

const Partners = () => {
    const { data, isLoading } = useGetActivePartnersQuery();
    const [activeCategory, setActiveCategory] = useState('All');

    const partners = data?.partners || [];

    const categories = useMemo(() => {
        const cats = new Set(partners.map(p => p.category));
        return ['All', ...Array.from(cats)];
    }, [partners]);

    const filteredPartners = useMemo(() => {
        if (activeCategory === 'All') return partners;
        return partners.filter(p => p.category === activeCategory);
    }, [partners, activeCategory]);

    const featuredPartners = useMemo(() => {
        return partners.filter(p => p.is_featured);
    }, [partners]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-green-900 to-green-800 text-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-green-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-sm font-semibold mb-8"
                    >
                        <Award className="w-4 h-4" />
                        Our Trusted Network
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Success is Better <span className="text-green-400">Together</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-green-50/80 max-w-3xl mx-auto leading-relaxed"
                    >
                        We collaborate with industry leaders in finance, equipment, and supply to provide our farmers with the best resources, ensuring sustainable growth and professional support at every step.
                    </motion.p>
                </div>
            </section>

            {/* Featured Partners Section */}
            {featuredPartners.length > 0 && (
                <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">Featured Partners</h2>
                                <p className="text-gray-600 dark:text-gray-400">Our primary strategic alliances</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredPartners.map((partner, index) => (
                                <PartnerCard key={partner.id} partner={partner} index={index} featured />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Partners with Filtering */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-3xl font-bold dark:text-white">Professional Network</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Verified partners across multiple sectors.</p>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <Filter className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                        ${activeCategory === cat
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredPartners.map((partner, index) => (
                                <PartnerCard key={partner.id} partner={partner} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredPartners.length === 0 && (
                        <div className="text-center py-20">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No partners found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-24 bg-green-50 dark:bg-green-900/10 border-y border-green-100 dark:border-green-900/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 dark:text-white">How our partnerships benefit <span className="text-green-600">You</span></h2>
                            <div className="space-y-6">
                                <ImpactItem
                                    icon={Award}
                                    title="Verified Quality"
                                    desc="Every partner undergoes a strict vetting process to ensure they meet our standards for reliability and professional integrity."
                                />
                                <ImpactItem
                                    icon={Users}
                                    title="Tailored Support"
                                    desc="Partners work closely with our consultants to provide specialized services that address your specific farming needs."
                                />
                                <ImpactItem
                                    icon={ExternalLink}
                                    title="Direct Access"
                                    desc="Save time and research by accessing our pre-vetted network of suppliers, financiers, and equipment providers."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-green-500/20 to-green-600/5 rounded-3xl border border-green-200 dark:border-green-800 p-8 flex items-center justify-center overflow-hidden">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 opacity-10"
                                >
                                    <div className="w-full h-full border-[40px] border-dashed border-green-900 rounded-full" />
                                </motion.div>
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-green-600 mb-2">{partners.length}+</div>
                                    <div className="text-xl font-semibold dark:text-white">Active Partners</div>
                                    <p className="text-gray-500 mt-2">And growing every month</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Become a Partner Section */}
            <section className="py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-gray-900 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Users className="w-32 h-32" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Join Our Ecosystem</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Are you a company that shares our vision of modernizing agriculture? Apply to become a verified partner and reach thousands of farmers.
                    </p>
                    <RouterLink to="/partners/apply" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 inline-flex items-center gap-2 mx-auto">
                        Become a Partner <ArrowRight className="w-5 h-5" />
                    </RouterLink>
                </div>
            </section>
        </div>
    );
};

const PartnerCard = ({ partner, index, featured = false }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className={`group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-green-500/30
                ${featured ? 'p-8 flex flex-col items-center text-center shadow-lg border-green-100 dark:border-green-900/30' : 'p-6'}`}
        >
            <div className={`relative mb-6 ${featured ? 'w-24 h-24' : 'w-16 h-16'} rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700`}>
                {partner.logo?.url ? (
                    <img
                        src={partner.logo.url}
                        alt={partner.name}
                        className="w-full h-full object-contain p-2"
                    />
                ) : (
                    <div className="text-2xl font-bold text-green-600">
                        {partner.name?.charAt(0)}
                    </div>
                )}
            </div>

            <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                        {partner.category}
                    </span>
                    {partner.is_featured && !featured && (
                        <Award className="w-4 h-4 text-yellow-500" />
                    )}
                </div>
                <h3 className={`font-bold dark:text-white mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
                    {partner.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                    {partner.description || `Leading ${partner.category} solutions for modern agriculture.`}
                </p>

                {partner.website_url && (
                    <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 font-semibold text-sm transition-colors
                            ${featured
                                ? 'bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700'
                                : 'text-green-600 hover:text-green-700'}`}
                    >
                        Visit Website <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>
        </motion.div>
    );
};

const ImpactItem = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h4 className="font-bold dark:text-white mb-1">{title}</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Partners;
