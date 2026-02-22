import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Loader2, Check, AlertCircle, Eye, Save } from 'lucide-react';
import {
    useCreateTipMutation,
    useUpdateTipMutation,
    useCreateBlogMutation,
    useUpdateBlogMutation
} from '../../features/Api/adminApi';
import ImageUpload from '../common/ImageUpload';

const PostModal = ({ isOpen, onClose, postToEdit, type = 'blog' }) => {
    const [createTip, { isLoading: isCreatingTip }] = useCreateTipMutation();
    const [updateTip, { isLoading: isUpdatingTip }] = useUpdateTipMutation();
    const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();
    const [updateBlog, { isLoading: isUpdatingBlog }] = useUpdateBlogMutation();

    const isCreating = type === 'blog' ? isCreatingBlog : isCreatingTip;
    const isUpdating = type === 'blog' ? isUpdatingBlog : isUpdatingTip;

    const [form, setForm] = useState({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        slug: '',
        featured_media_id: ''
    });

    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (postToEdit) {
            setForm({
                title: postToEdit.title || '',
                content: postToEdit.content || '',
                excerpt: postToEdit.excerpt || '',
                status: postToEdit.status || 'draft',
                slug: postToEdit.slug || '',
                featured_media_id: postToEdit.featured_media_id || ''
            });
        } else {
            setForm({
                title: '',
                content: '',
                excerpt: '',
                status: 'draft',
                slug: '',
                featured_media_id: ''
            });
        }
    }, [postToEdit, isOpen]);

    const handleTitleChange = (val) => {
        const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setForm({ ...form, title: val, slug });
    };

    const handleImageUpload = (mediaId) => {
        setForm(prev => ({ ...prev, featured_media_id: mediaId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...form };
            if (!dataToSubmit.featured_media_id) delete dataToSubmit.featured_media_id;

            if (postToEdit) {
                if (type === 'blog') {
                    await updateBlog({ id: postToEdit.id, ...dataToSubmit }).unwrap();
                } else {
                    await updateTip({ id: postToEdit.id, ...dataToSubmit }).unwrap();
                }
                setStatus({ success: true, message: `${type === 'blog' ? 'Blog' : 'Tip'} updated!` });
            } else {
                if (type === 'blog') {
                    await createBlog(dataToSubmit).unwrap();
                } else {
                    await createTip(dataToSubmit).unwrap();
                }
                setStatus({ success: true, message: `${type === 'blog' ? 'Blog' : 'Tip'} created!` });
            }
            setTimeout(() => {
                onClose();
                setStatus(null);
            }, 1000);
        } catch (err) {
            setStatus({ success: false, message: 'Operation failed' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-5xl border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <FileText className={`w-6 h-6 ${type === 'blog' ? 'text-green-600' : 'text-blue-600'}`} />
                        {postToEdit ? `Edit ${type === 'blog' ? 'Blog' : 'Tip'}` : `Create New ${type === 'blog' ? 'Blog' : 'Tip'}`}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 text-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => handleTitleChange(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-4 text-lg font-black focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                    placeholder={`Enter a catchy ${type} title...`}
                                    required
                                />
                                <p className="text-[10px] font-bold text-gray-400 mt-1">Slug: /${type === 'blog' ? 'blogs' : 'tips'}/{form.slug}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Content (Markdown)</label>
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-6 h-[28rem] focus:ring-2 focus:ring-green-500 font-medium text-sm text-gray-900 dark:text-white leading-relaxed resize-none"
                                    placeholder="Write your content here..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {type === 'blog' && (
                                <ImageUpload
                                    label="Featured Photography"
                                    initialMediaId={form.featured_media_id}
                                    onUploadComplete={handleImageUpload}
                                    category="blog"
                                />
                            )}

                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                                <h3 className="font-black text-xs text-gray-500 uppercase tracking-widest">Settings</h3>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Visibility</label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm({ ...form, status: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs font-bold"
                                    >
                                        <option value="draft">Save as Draft</option>
                                        <option value="published">Publish Now</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Excerpt</label>
                                    <textarea
                                        value={form.excerpt}
                                        onChange={e => setForm({ ...form, excerpt: e.target.value })}
                                        className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs h-32 resize-none font-medium"
                                        placeholder="Brief summary for social sharing..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                                <h3 className="font-bold text-sm text-green-900 dark:text-green-300 mb-2">Writing Tips</h3>
                                <ul className="text-[11px] text-green-700 dark:text-green-400 space-y-2 list-disc pl-4 font-medium">
                                    <li>Use # for large headings</li>
                                    <li>Use **bold** for emphasis</li>
                                    <li>Keep your excerpt punchy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => {/* Preview logic */ }}
                        className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all text-gray-700 dark:text-gray-300"
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>

                    <div className="flex gap-4 items-center">
                        {status && (
                            <span className={`text-[11px] font-black uppercase tracking-widest ${status.success ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </span>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={isCreating || isUpdating}
                            className="bg-green-600 text-white font-black text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 dark:shadow-none flex items-center gap-2"
                        >
                            {(isCreating || isUpdating) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {postToEdit ? 'Save Changes' : 'Publish Now'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PostModal;
