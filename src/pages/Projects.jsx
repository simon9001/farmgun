import React from 'react';
import { useGetPublicProjectsQuery } from '../features/Api/publicApi';
import { motion } from 'framer-motion';
import { Loader2, Calendar } from 'lucide-react';

const Projects = () => {
    const { data, isLoading, error } = useGetPublicProjectsQuery({});

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-red-500">
                Failed to load projects. Please try again later.
            </div>
        );
    }

    const projects = data?.projects || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Projects</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Take a look at some of the farming success stories and implementations we've delivered.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-green-50 dark:border-green-900 flex flex-col h-full"
                    >
                        <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                            {project.featured_media?.optimized_url ? (
                                <img
                                    src={project.featured_media.optimized_url}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                                {project.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No projects found at the moment.
                </div>
            )}
        </div>
    );
};

export default Projects;
