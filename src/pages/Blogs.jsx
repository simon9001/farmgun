import React from 'react';
import { useGetPublicBlogsQuery, useGetPublicTipsQuery } from '../features/Api/publicApi';
import { useDeleteBlogMutation, useDeleteTipMutation } from '../features/Api/adminApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/Slice/AuthSlice';
import PostModal from '../components/Admin/PostModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader2, BookOpen, X, Share2, Clock, Bookmark, Plus, Edit3, Trash2, Sprout } from 'lucide-react';

const BlogCard = ({ blog, onClick, onEdit, onDelete, isAdmin }) => {
    return (
        <motion.div
            layoutId={`card-${blog.id}`}
            whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.2)" }}
            onClick={onClick}
            className="w-full bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 cursor-pointer group flex flex-col h-full relative"
        >
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10 flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => onEdit(blog)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(blog.id)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
            <div className="relative h-56 overflow-hidden flex-shrink-0">
                <motion.img
                    layoutId={`image-${blog.id}`}
                    src={blog.featured_media?.optimized_url || blog.featured_media?.url || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=800'}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                        {blog.category || 'Agricultural Insight'}
                    </span>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.published_at || blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.ceil((blog.content?.length || 0) / 1000) + 2} min
                    </span>
                </div>

                <motion.h3
                    layoutId={`title-${blog.id}`}
                    className="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
                >
                    {blog.title}
                </motion.h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-400">
                            {blog.author?.name?.charAt(0) || 'I'}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{blog.author?.name || 'Irene'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                        Read <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const TipCard = ({ tip, onClick, onEdit, onDelete, isAdmin }) => {
    return (
        <motion.div
            layoutId={`card-${tip.id}`}
            whileHover={{ scale: 1.02, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            onClick={onClick}
            className="w-full bg-green-50/50 dark:bg-gray-900/50 rounded-[2rem] p-8 border border-green-100 dark:border-gray-800 cursor-pointer group flex flex-col h-full relative"
        >
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10 flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => onEdit(tip)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-sm text-green-600 hover:bg-green-50 transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(tip.id)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
            <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-green-200 dark:shadow-none">
                <Sprout className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-3 text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em] mb-4">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(tip.created_at).toLocaleDateString()}
            </div>

            <motion.h3
                layoutId={`title-${tip.id}`}
                className="text-xl font-black text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors"
            >
                {tip.title}
            </motion.h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-4 leading-relaxed flex-1">
                {tip.excerpt || tip.content?.substring(0, 150) + '...'}
            </p>

            <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all pt-4 border-t border-green-100/50 dark:border-gray-800">
                View Tip <ArrowRight className="w-4 h-4" />
            </div>
        </motion.div>
    );
};

const BlogReader = ({ blog, blogs, onNext, onPrev, onClose }) => {
    if (!blog) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 bg-gray-900/40 dark:bg-black/60 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                layoutId={`card-${blog.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full md:max-w-6xl md:h-[92vh] bg-white dark:bg-gray-950 md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative border-none md:border md:border-white/20 dark:md:border-gray-800"
            >
                {/* Left Side: Dynamic Image Cover */}
                <div className="w-full md:w-[42%] h-64 md:h-full relative overflow-hidden flex-shrink-0">
                    <motion.img
                        layoutId={`image-${blog.id}`}
                        src={blog.featured_media?.optimized_url || blog.featured_media?.url || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=800'}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Navigation Buttons for Mobile */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center md:hidden">
                        <button
                            onClick={onClose}
                            className="p-3 bg-black/30 backdrop-blur-xl rounded-2xl text-white transition-all border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={onPrev}
                                className="p-3 bg-black/30 backdrop-blur-xl rounded-2xl text-white border border-white/10"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                            <button
                                onClick={onNext}
                                className="p-3 bg-black/30 backdrop-blur-xl rounded-2xl text-white border border-white/10"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-8 md:bottom-16 left-8 md:left-12 right-8 md:right-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 md:space-y-6"
                        >
                            <span className="px-4 py-1.5 md:px-5 md:py-2 bg-green-600/90 backdrop-blur-md text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl inline-block border border-green-400/30">
                                {blog.category || 'Expert Journal'}
                            </span>
                            <h2 className="text-2xl md:text-5xl font-black text-white leading-[1.2] drop-shadow-2xl">
                                {blog.title}
                            </h2>
                            <div className="flex items-center gap-3 md:gap-4 text-white/70 text-[10px] md:text-sm font-bold tracking-wide">
                                <span className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 md:w-4 h-4 text-green-400" />
                                    {Math.ceil((blog.content?.length || 0) / 1000) + 2} min
                                </span>
                                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500" />
                                <span className="hidden sm:inline">Professional Series</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: The Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-950 flex flex-col">
                    {/* Header Action Bar (Desktop only) */}
                    <div className="hidden md:flex sticky top-0 right-0 p-10 justify-between items-center z-10 pointer-events-none">
                        <div className="flex gap-3 pointer-events-auto">
                            <button
                                onClick={onPrev}
                                className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:bg-green-600 hover:text-white rounded-[1.5rem] text-gray-500 transition-all shadow-xl border border-gray-100 dark:border-gray-800"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                            <button
                                onClick={onNext}
                                className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:bg-green-600 hover:text-white rounded-[1.5rem] text-gray-500 transition-all shadow-xl border border-gray-100 dark:border-gray-800"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:bg-red-500 hover:text-white rounded-[1.5rem] text-gray-500 transition-all pointer-events-auto shadow-xl border border-gray-100 dark:border-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto px-6 md:px-14 py-12 md:pb-24">
                        {/* Author Info */}
                        <div className="mb-10 md:mb-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-4 mb-6 md:mb-8"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 shadow-inner">
                                    <User className="w-6 h-6 md:w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm md:text-base font-black text-gray-900 dark:text-white leading-none">By {blog.author?.name || 'Irene'}</p>
                                    <p className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-widest mt-1">Agricultural Expert</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-green-600 transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.2] mb-6">
                                {blog.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-8">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" /> {new Date(blog.published_at || blog.created_at).toDateString()}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-200 hidden sm:block" />
                                <span className="flex items-center gap-2">
                                    <BookOpen className="w-3.5 h-3.5" /> {blog.category || 'Agricultural Insight'}
                                </span>
                            </div>
                        </div>

                        {/* Rich Content Area */}
                        <div
                            className="blog-content prose dark:prose-invert max-w-none text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* End of Page Decor */}
                        <div className="mt-16 md:mt-20 flex flex-col items-center">
                            <div className="w-12 md:w-16 h-1 bg-green-600/20 rounded-full mb-8" />
                            <div className="text-center italic text-gray-400 font-medium text-sm md:text-base">
                                "Growth starts with the right knowledge."
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Bar */}
                    <div className="mt-auto p-8 md:p-10 bg-gray-50/50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600 text-white rounded-2xl shadow-lg">
                                <Calendar className="w-5 h-5 md:w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm md:text-base font-black text-gray-900 dark:text-white">Need personal guidance?</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Schedule a direct field call</p>
                            </div>
                        </div>
                        <a href="/booking" className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-xl text-center">
                            Book Expertise
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const TipReader = ({ tip, tips, onNext, onPrev, onClose }) => {
    if (!tip) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 bg-green-900/40 dark:bg-black/60 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                layoutId={`card-${tip.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full md:max-w-4xl md:h-[80vh] bg-white dark:bg-gray-950 md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col relative border-none md:border md:border-white/20 dark:md:border-gray-800"
            >
                <div className="sticky top-0 right-0 p-6 md:p-10 flex justify-between items-center z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b md:border-none border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-none">
                            <Sprout className="w-5 h-5 md:w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-none">Farming Tip</h2>
                            <p className="text-[9px] md:text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">{new Date(tip.created_at).toDateString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                        <button
                            onClick={onPrev}
                            className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 hover:bg-green-600 hover:text-white rounded-2xl md:rounded-[1.5rem] text-gray-500 transition-all border border-gray-100 dark:border-gray-800"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                            onClick={onNext}
                            className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 hover:bg-green-600 hover:text-white rounded-2xl md:rounded-[1.5rem] text-gray-500 transition-all border border-gray-100 dark:border-gray-800"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 hover:bg-red-500 hover:text-white rounded-2xl md:rounded-[1.5rem] text-gray-500 transition-all border border-gray-100 dark:border-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16">
                    <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-8">
                        {tip.title}
                    </h2>
                    <div
                        className="blog-content prose dark:prose-invert max-w-none text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: tip.content }}
                    />

                    <div className="mt-12 p-8 rounded-[2rem] bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                        <p className="text-green-800 dark:text-green-300 font-bold italic text-center">
                            "Precision in farming makes the difference between yield and luxury."
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Blogs = () => {
    const user = useSelector(selectCurrentUser);
    const isAdmin = user?.role === 'admin';

    const { data: blogsData, isLoading: blogsLoading } = useGetPublicBlogsQuery();
    const { data: tipsData, isLoading: tipsLoading } = useGetPublicTipsQuery();

    const [deleteBlog] = useDeleteBlogMutation();
    const [deleteTip] = useDeleteTipMutation();

    const blogs = blogsData?.blogs || [];
    const tips = tipsData?.tips || [];

    const [selectedBlog, setSelectedBlog] = React.useState(null);
    const [selectedTip, setSelectedTip] = React.useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [postToEdit, setPostToEdit] = React.useState(null);
    const [postType, setPostType] = React.useState('blog');

    const handleEdit = (post, type) => {
        setPostToEdit(post);
        setPostType(type);
        setIsModalOpen(true);
    };

    const handleCreate = (type) => {
        setPostToEdit(null);
        setPostType(type);
        setIsModalOpen(true);
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                if (type === 'blog') {
                    await deleteBlog(id).unwrap();
                } else {
                    await deleteTip(id).unwrap();
                }
            } catch (err) {
                alert(`Failed to delete ${type}`);
            }
        }
    };

    // Navigation logic
    const navigateBlogs = (direction) => {
        if (!selectedBlog) return;
        const currentIndex = blogs.findIndex(b => b.id === selectedBlog.id);
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = blogs.length - 1;
        if (nextIndex >= blogs.length) nextIndex = 0;
        setSelectedBlog(blogs[nextIndex]);
    };

    const navigateTips = (direction) => {
        if (!selectedTip) return;
        const currentIndex = tips.findIndex(t => t.id === selectedTip.id);
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = tips.length - 1;
        if (nextIndex >= tips.length) nextIndex = 0;
        setSelectedTip(tips[nextIndex]);
    };

    React.useEffect(() => {
        if (selectedBlog || selectedTip) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [selectedBlog, selectedTip]);

    if (blogsLoading || tipsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-green-600 dark:text-green-500 font-black text-xs uppercase tracking-[0.3em] mb-4"
                >
                    <BookOpen className="w-5 h-5" />
                    Knowledge Hub
                </motion.div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]"
                        >
                            Agricultural <span className="text-green-600 dark:text-green-500">Expertise</span><br /> & Field Intel
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
                        >
                            Explore in-depth field journals and quick farming tips designed to help you succeed.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Blogs Section */}
            <div className="mb-32">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">Field Journals</h2>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => handleCreate('blog')}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-100 dark:shadow-none"
                        >
                            <Plus className="w-4 h-4" /> Add Blog
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                blog={blog}
                                isAdmin={isAdmin}
                                onClick={() => setSelectedBlog(blog)}
                                onEdit={(b) => handleEdit(b, 'blog')}
                                onDelete={(id) => handleDelete(id, 'blog')}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-xl italic opacity-50">No field journals found yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips Section */}
            <div className="mb-20">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Sprout className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">Farming Tips</h2>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => handleCreate('tip')}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
                        >
                            <Plus className="w-4 h-4" /> Add Tip
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {tips.length > 0 ? (
                        tips.map((tip) => (
                            <TipCard
                                key={tip.id}
                                tip={tip}
                                isAdmin={isAdmin}
                                onClick={() => setSelectedTip(tip)}
                                onEdit={(t) => handleEdit(t, 'tip')}
                                onDelete={(id) => handleDelete(id, 'tip')}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-xl italic opacity-50">No farming tips found yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reader Experiences */}
            <AnimatePresence mode="wait">
                {selectedBlog && (
                    <BlogReader
                        key={selectedBlog.id}
                        blog={selectedBlog}
                        blogs={blogs}
                        onNext={() => navigateBlogs(1)}
                        onPrev={() => navigateBlogs(-1)}
                        onClose={() => setSelectedBlog(null)}
                    />
                )}
                {selectedTip && (
                    <TipReader
                        key={selectedTip.id}
                        tip={selectedTip}
                        tips={tips}
                        onNext={() => navigateTips(1)}
                        onPrev={() => navigateTips(-1)}
                        onClose={() => setSelectedTip(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <PostModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        postToEdit={postToEdit}
                        type={postType}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Section: CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-32 relative overflow-hidden p-8 md:p-16 rounded-[3rem] bg-green-600 text-white shadow-2xl text-center md:text-left shadow-green-200 dark:shadow-none"
            >
                <div className="absolute top-0 right-0 w-[50%] h-[200%] bg-white/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none rotate-45" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1">
                        <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] mb-4 inline-block">Direct Access</span>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Bring expert advice<br />to your field.</h2>
                        <p className="text-green-50 text-lg max-w-xl font-medium leading-relaxed opacity-90">
                            Don't just read about it. Book a session with Irene and transform your yield with precision agronomy.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <a
                            href="/booking"
                            className="px-8 py-5 bg-white text-green-700 font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl text-md text-center"
                        >
                            Book Irene Now
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-5 bg-green-700/30 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-green-700/50 transition-all text-md text-center"
                        >
                            Quick Inquiry
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Blogs;
