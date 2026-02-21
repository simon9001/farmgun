import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sprout, Check, AlertCircle } from 'lucide-react';
import {
    useCreateServiceMutation,
    useUpdateServiceMutation
} from '../../features/Api/adminApi';
import { useGetPublicCropsQuery } from '../../features/Api/publicApi';
import ImageUpload from '../common/ImageUpload';

const ServiceModal = ({ isOpen, onClose, serviceToEdit }) => {
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const { data: cropsData } = useGetPublicCropsQuery({});

    const [form, setForm] = useState({
        name: '',
        tagline: '',
        description: '',
        price: '',
        duration_mins: 60,
        featured_media_id: '',
        what_get: [],
        pricing_options: [],
        crops: []
    });

    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (serviceToEdit) {
            setForm({
                name: serviceToEdit.name,
                tagline: serviceToEdit.tagline || '',
                description: serviceToEdit.description,
                price: serviceToEdit.price,
                duration_mins: serviceToEdit.duration_mins || serviceToEdit.duration || 60,
                featured_media_id: serviceToEdit.featured_media_id || '',
                what_get: serviceToEdit.what_get || [],
                pricing_options: serviceToEdit.pricing_options || [],
                crops: serviceToEdit.service_crops?.map(c => c.id) || []
            });
        }
    }, [serviceToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                duration_mins: parseInt(form.duration_mins),
                what_get: form.what_get.filter(item => item.trim() !== ''),
                pricing_options: form.pricing_options
                    .filter(opt => opt.label.trim() !== '')
                    .map(opt => ({
                        ...opt,
                        price: opt.price ? parseFloat(opt.price) : undefined
                    }))
            };
            // Remove duration if it conflicts differently or map it correctly. 
            // The schema expects duration_mins, but form has duration. 
            // In init: duration: 30.
            // Let's verify backend schema: duration_mins.

            if (serviceToEdit) {
                await updateService({ id: serviceToEdit.id, ...payload }).unwrap();
                setStatus({ success: true, message: 'Service updated successfully!' });
            } else {
                await createService(payload).unwrap();
                setStatus({ success: true, message: 'Service created successfully!' });
            }
            setTimeout(() => {
                onClose();
                setStatus(null);
            }, 1500);
        } catch (err) {
            setStatus({ success: false, message: err.data?.error || 'Operation failed' });
        }
    };

    const toggleCrop = (cropId) => {
        setForm(prev => ({
            ...prev,
            crops: prev.crops.includes(cropId)
                ? prev.crops.filter(id => id !== cropId)
                : [...prev.crops, cropId]
        }));
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
                        <Sprout className="w-6 h-6 text-green-600" />
                        {serviceToEdit ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Service Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                placeholder="Consultation Type"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Price (KES)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                placeholder="2500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Duration (Minutes)</label>
                            <select
                                value={form.duration_mins}
                                onChange={e => setForm({ ...form, duration_mins: parseInt(e.target.value) })}
                                className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                required
                            >
                                <option value={30}>30 Minutes</option>
                                <option value={60}>1 Hour</option>
                                <option value={90}>1.5 Hours</option>
                                <option value={120}>2 Hours</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Tagline</label>
                        <input
                            type="text"
                            value={form.tagline}
                            onChange={e => setForm({ ...form, tagline: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                            placeholder="Short catchy phrase"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 h-24 text-gray-900 dark:text-white"
                            placeholder="Describe what is covered in this session..."
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">What You Get (Benefits)</label>
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, what_get: [...prev.what_get, ''] }))}
                                className="text-xs text-green-600 font-bold hover:underline"
                            >
                                + Add Benefit
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.what_get.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => {
                                            const newWhat = [...form.what_get];
                                            newWhat[index] = e.target.value;
                                            setForm({ ...form, what_get: newWhat });
                                        }}
                                        className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 text-sm text-gray-900 dark:text-white"
                                        placeholder={`Benefit ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newWhat = form.what_get.filter((_, i) => i !== index);
                                            setForm({ ...form, what_get: newWhat });
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Pricing Options</label>
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({
                                    ...prev,
                                    pricing_options: [...prev.pricing_options, { label: '', price: '', currency: 'KES', note: '', is_custom: false }]
                                }))}
                                className="text-xs text-green-600 font-bold hover:underline"
                            >
                                + Add Pricing Tier
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.pricing_options.map((opt, index) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-3 relative border border-gray-100 dark:border-gray-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newOptions = form.pricing_options.filter((_, i) => i !== index);
                                            setForm({ ...form, pricing_options: newOptions });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
                                            <input
                                                type="text"
                                                value={opt.label}
                                                onChange={e => {
                                                    const newOptions = [...form.pricing_options];
                                                    newOptions[index] = { ...opt, label: e.target.value };
                                                    setForm({ ...form, pricing_options: newOptions });
                                                }}
                                                className="w-full bg-white dark:bg-gray-800 border-none rounded-lg p-2 text-sm text-gray-900 dark:text-white"
                                                placeholder="e.g. Virtual"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Price</label>
                                            <input
                                                type="number"
                                                value={opt.price}
                                                disabled={opt.is_custom}
                                                onChange={e => {
                                                    const newOptions = [...form.pricing_options];
                                                    newOptions[index] = { ...opt, price: e.target.value };
                                                    setForm({ ...form, pricing_options: newOptions });
                                                }}
                                                className="w-full bg-white dark:bg-gray-800 border-none rounded-lg p-2 text-sm text-gray-900 dark:text-white disabled:opacity-50"
                                                placeholder="5000"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={opt.is_custom}
                                                onChange={e => {
                                                    const newOptions = [...form.pricing_options];
                                                    newOptions[index] = { ...opt, is_custom: e.target.checked, price: e.target.checked ? '' : opt.price };
                                                    setForm({ ...form, pricing_options: newOptions });
                                                }}
                                                className="rounded text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Custom Price (Quote)</span>
                                        </label>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Note (Optional)</label>
                                        <input
                                            type="text"
                                            value={opt.note}
                                            onChange={e => {
                                                const newOptions = [...form.pricing_options];
                                                newOptions[index] = { ...opt, note: e.target.value };
                                                setForm({ ...form, pricing_options: newOptions });
                                            }}
                                            className="w-full bg-white dark:bg-gray-800 border-none rounded-lg p-2 text-sm text-gray-900 dark:text-white"
                                            placeholder="e.g. transport separate"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Linked Crops</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {cropsData?.crops?.map(crop => (
                                <button
                                    key={crop.id}
                                    type="button"
                                    onClick={() => toggleCrop(crop.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${form.crops.includes(crop.id)
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:border-green-600'
                                        }`}
                                >
                                    <Sprout className="w-3 h-3" />
                                    {crop.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {status.message}
                        </div>
                    )}

                    <div className="pt-4 flex flex-col md:flex-row gap-4">
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
                            {serviceToEdit ? 'Save Changes' : 'Create Service'}
                        </button>
                    </div>
                </form>
            </motion.div>

        </div>
    );
};

export default ServiceModal;
