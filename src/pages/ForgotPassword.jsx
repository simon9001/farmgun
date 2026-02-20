import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../features/Api/authApi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await forgotPassword({ email }).unwrap();
            setIsSubmitted(true);
        } catch (err) {
            setError(err.data?.error || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900 transition-colors">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                        No worries, we'll send you reset instructions.
                    </p>

                    {!isSubmitted ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-green-200 dark:shadow-none text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Sending Instructions...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="mb-4 flex justify-center">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                We've sent password reset instructions to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                            </p>
                            <p className="text-sm text-gray-500">
                                Didn't receive the email?{' '}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-green-600 hover:text-green-500 font-bold"
                                >
                                    Click to resend
                                </button>
                            </p>
                        </motion.div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
