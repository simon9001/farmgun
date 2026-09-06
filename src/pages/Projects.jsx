import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useGetPublicProjectsQuery } from '../features/Api/publicApi';
import ProjectCropDetailModal from '../components/common/ProjectCropDetailModal';
import { PageHeader, LoadingState, ErrorState, EmptyState, Thumb } from '../components/common/Page';

const Projects = () => {
    const { data, isLoading, error } = useGetPublicProjectsQuery();
    const [selectedProject, setSelectedProject] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const projects = data?.projects || [];

    return (
        <>
            <PageHeader
                title="Field work"
                lead="Farms we have planned, planted and seen through to harvest. Open a project to see the crop, the approach and how it finished."
                action={<Link to="/booking" className="btn btn-primary">Book a consultation</Link>}
            />

            <div className="shell py-12 sm:py-16">
                {isLoading ? (
                    <LoadingState label="Loading projects" />
                ) : error ? (
                    <ErrorState what="the project list" />
                ) : projects.length === 0 ? (
                    <EmptyState message="No projects are published yet." />
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="panel overflow-hidden flex flex-col relative hover:border-field transition-colors"
                            >
                                <div className="h-56 bg-husk overflow-hidden relative">
                                    <Thumb
                                        src={project.featured_media?.optimized_url || project.featured_media?.url}
                                        alt={project.name}
                                    />
                                    {project.status && (
                                        <span className="absolute top-3 left-3 bg-white/95 text-ink text-xs font-medium px-2.5 py-1 rounded">
                                            {project.status}
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="t-h3">
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedProject(project); setIsDetailOpen(true); }}
                                            className="text-left after:absolute after:inset-0 after:content-['']"
                                        >
                                            {project.name}
                                        </button>
                                    </h2>

                                    <p className="mt-2 text-[0.9375rem] text-quiet leading-relaxed line-clamp-3 flex-1">
                                        {project.description}
                                    </p>

                                    {project.start_date && (
                                        <p className="mt-5 pt-5 border-t border-rule flex items-center gap-2 text-sm text-quiet">
                                            <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                                            <time dateTime={project.start_date}>
                                                {new Date(project.start_date).toLocaleDateString('en-KE', {
                                                    month: 'long', year: 'numeric',
                                                })}
                                            </time>
                                        </p>
                                    )}
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
                    data={selectedProject}
                    type="project"
                />
            )}
        </>
    );
};

export default Projects;
