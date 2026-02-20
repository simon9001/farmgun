import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Calendar, ArrowRight } from 'lucide-react';
import { useVerifyPaymentMutation } from '../features/Api/paymentsApi';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    const actualReference = reference || trxref;

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);
    const verificationAttempted = useRef(false);

    const [verifyPayment] = useVerifyPaymentMutation();

    useEffect(() => {
        const handleVerification = async () => {
            if (verificationAttempted.current) return;
            if (!actualReference) {
                setStatus('error');
                setError('No payment reference found.');
                return;
            }

            verificationAttempted.current = true;
            try {
                const result = await verifyPayment({ reference: actualReference }).unwrap();
                if (result.status === 'success') {
                    setStatus('success');
                    setBooking(result.booking);
                } else {
                    setStatus('error');
                    setError(result.message || 'Payment verification failed.');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
                setError(err.data?.error || 'Failed to verify payment. Please contact support.');
            }
        };

        handleVerification();
    }, [actualReference, verifyPayment]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8 text-center"
            >
                {status === 'verifying' && (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <Loader2 className="w-16 h-16 animate-spin text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying Payment</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please wait while we confirm your transaction with Paystack...
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 italic">SUCCESS!</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your booking has been confirmed. A confirmation email has been sent to your inbox.
                            </p>
                        </div>

                        {booking && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 text-left border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-600" /> Booking Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Service:</span>
                                        <span className="font-semibold dark:text-gray-300">{booking.service?.name}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Date:</span>
                                        <span className="font-semibold dark:text-gray-300">{booking.date}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Time:</span>
                                        <span className="font-semibold dark:text-gray-300">{booking.start_time} - {booking.end_time}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-xl shadow-green-100 dark:shadow-none transition-all"
                        >
                            Go to Dashboard <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Verification Failed</h2>
                            <p className="text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/booking')}
                            className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
                        >
                            Try Booking Again
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentCallback;
