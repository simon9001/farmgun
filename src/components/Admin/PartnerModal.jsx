import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Award, Check, AlertCircle, Link as LinkIcon, Globe } from 'lucide-react';
import {
    useCreatePartnerMutation,
    useUpdatePartnerMutation
} from '../../features/Api/partnersApi';
import ImageUpload from '../common/ImageUpload';

const PartnerModal = ({ isOpen, onClose, partnerToEdit }) => {
    const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
    const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();

    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'Other',
        website_url: '',
        logo_media_id: '',
        is_featured: false,
        is_active: true,
    });

    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (partnerToEdit) {
            setForm({
                name: partnerToEdit.name || '',
                description: partnerToEdit.description || '',
                category: partnerToEdit.category || 'Other',
                website_url: partnerToEdit.website_url || '',
                logo_media_id: partnerToEdit.logo_media_id || '',
                is_featured: !!partnerToEdit.is_featured,
                is_active: !!partnerToEdit.is_active,
            });
        } else {
            setForm({
                name: '',
                description: '',
                category: 'Other',
                website_url: '',
                logo_media_id: '',
                is_featured: false,
                is_active: true,
            });
        }
    }, [partnerToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        try {
            if (partnerToEdit) {
                await updatePartner({ id: partnerToEdit.id, ...form }).unwrap();
                setStatus({ success: true, message: 'Partner updated successfully!' });
            } else {
                await createPartner(form).unwrap();
                setStatus({ success: true, message: 'Partner added successfully!' });
            }
            setTimeout(() => {
                onClose();
                setStatus(null);
            }, 1500);
        } catch (err) {
            setStatus({ success: false, message: err.data?.error || 'Operation failed' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Award className="w-6 h-6 text-green-600" />
                        {partnerToEdit ? 'Edit Partner' : 'Add New Partner'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Logo Upload */}
                        <div className="w-full md:w-1/3">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Partner Logo</label>
                            <ImageUpload
                                value={form.logo_media_id}
                                onChange={(mediaId) => setForm({ ...form, logo_media_id: mediaId })}
                                category="partner"
                            />
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Company Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="Suppliers">Suppliers</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Markets">Markets</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Website URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={form.website_url}
                                        onChange={e => setForm({ ...form, website_url: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 pl-10 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 h-24 text-gray-900 dark:text-white"
                            placeholder="Short 1-2 line description of the partner..."
                        />
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl cursor-pointer group hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={form.is_featured}
                                onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                                className="w-5 h-5 text-green-600 rounded-lg focus:ring-green-500 border-gray-300"
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Featured Partner</p>
                                <p className="text-xs text-gray-500">Show in the featured section</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl cursor-pointer group hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                className="w-5 h-5 text-green-600 rounded-lg focus:ring-green-500 border-gray-300"
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Active Status</p>
                                <p className="text-xs text-gray-500">Publicly visible on the page</p>
                            </div>
                        </label>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {status.message}
                        </div>
                    )}

                    <div className="pt-4 flex flex-col md:flex-row gap-4 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="flex-[2] bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 dark:shadow-none"
                        >
                            {(isCreating || isUpdating) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            {partnerToEdit ? 'Save Changes' : 'Add Partner'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PartnerModal;
