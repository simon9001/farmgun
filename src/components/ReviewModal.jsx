import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useCreateTestimonialMutation } from '../features/Api/publicApi';

const ReviewModal = ({ isOpen, onClose, user }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await createTestimonial({
                user_name: user?.name || 'Anonymous',
                comment,
                rating,
            }).unwrap();
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setComment('');
                setRating(5);
            }, 2000);
        } catch (err) {
            setError(err.data?.message || 'Failed to submit review. Only users with completed sessions can leave reviews.');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">Share Your Story</h2>
                            <p className="text-sm text-gray-500 mt-1">We value your farming journey</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-sm transition-all group">
                            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                        </button>
                    </div>

                    <div className="p-8">
                        {success ? (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-lg shadow-green-200/50"
                                >
                                    <CheckCircle2 className="w-12 h-12" />
                                </motion.div>
                                <h3 className="text-2xl font-bold dark:text-white mb-3 text-green-600">Review Received!</h3>
                                <p className="text-gray-500">Your experience will inspire others.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="text-center">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">
                                        Rate your experience
                                    </label>
                                    <div className="flex items-center justify-center gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="transition-all transform hover:scale-125 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-10 h-10 ${star <= rating
                                                        ? 'text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                                                        : 'text-gray-200 dark:text-gray-800'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-xs font-bold text-green-600 uppercase">
                                        {rating === 5 ? 'Excellent' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                                    </div>
                                </div>

                                <div className="relative group">
                                    <textarea
                                        required
                                        minLength={10}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Speak from the heart... How did the consultation help your farm?"
                                        rows={4}
                                        className="w-full px-6 py-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/30 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white resize-none text-lg leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                    />
                                    <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-700 pointer-events-none group-focus-within:text-green-500/20 transition-colors">
                                        <Send className="w-6 h-6" />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-2xl border border-red-100 dark:border-red-900/20 flex items-center gap-3"
                                    >
                                        <X className="w-4 h-4 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 text-white rounded-3xl font-bold shadow-xl shadow-green-200 dark:shadow-green-950/20 transition-all transform hover:translate-y-[-2px] active:translate-y-[1px] flex items-center justify-center gap-3 text-lg"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Submit Your Review
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewModal;
