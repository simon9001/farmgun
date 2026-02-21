import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Loader2, AlertCircle, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useInitiatePaymentMutation, useVerifyPaymentMutation } from '../features/Api/paymentsApi';
import { useGetBookingQuery } from '../features/Api/bookingsApi';



const PaymentModal = ({ isOpen, onClose, bookingId, initialPhone, amount, serviceName }) => {
    const [paymentPhone, setPaymentPhone] = useState(initialPhone || '');
    const [step, setStep] = useState(initialPhone ? 'waiting' : 'input'); // input, waiting, success, error
    const [timer, setTimer] = useState(60); // Extended to 60s for M-Pesa
    const [initiateError, setInitiateError] = useState(null);
    const [reference, setReference] = useState(null); // ✅ Track reference from STK push
    const hasAutoInitiated = useRef(false); // ✅ Prevent double auto-initiate

    const [initiatePayment, { isLoading: isInitiating }] = useInitiatePaymentMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    // Poll booking status every 4s while waiting
    const { data: bookingData } = useGetBookingQuery(bookingId, {
        pollingInterval: step === 'waiting' ? 4000 : 0,
        skip: !bookingId || step !== 'waiting',
    });

    const booking = bookingData?.booking;
    const payment = booking?.payments?.[0];

    // ✅ React to booking/payment status from DB polling
    useEffect(() => {
        if (booking?.status === 'paid') {
            setStep('success');
        } else if (payment?.status === 'failed' && step === 'waiting') {
            setStep('error');
            setInitiateError('Payment failed. Please ensure you have sufficient funds or try a different number.');
        }
    }, [booking?.status, payment?.status]);

    // ✅ MAIN FIX: Actively poll verifyPayment using the reference as a fallback
    // This updates the DB even without a webhook (works in development)
    useEffect(() => {
        if (step !== 'waiting' || !reference) return;
        const interval = setInterval(async () => {
            try {
                const result = await verifyPayment({ reference }).unwrap();
                if (result.status === 'success') {
                    setStep('success');
                    clearInterval(interval);
                }
            } catch {
                // Not successful yet, keep waiting
            }
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [step, reference]);

    // Timer countdown + auto-initiate on mount
    useEffect(() => {
        // Auto-trigger STK Push if phone is pre-filled (from Bookings page)
        // Guards: useRef prevents re-entry, isInitiating prevents concurrent calls
        if (isOpen && initialPhone && step === 'waiting' && !hasAutoInitiated.current && !isInitiating) {
            hasAutoInitiated.current = true;
            handleInitiate(initialPhone);
        }

        let interval;
        if (step === 'waiting' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && step === 'waiting') {
            setStep('error');
            setInitiateError("Time's up. We didn't get a confirmation. If you entered your PIN, please wait a moment — we'll still detect the payment automatically.");
        }
        return () => clearInterval(interval);
    }, [step, timer, isOpen]);


    const formatPhone = (phone) => {
        let formatted = phone.replace(/\s+/g, '');
        if (formatted.startsWith('0')) {
            formatted = '+254' + formatted.substring(1);
        } else if (!formatted.startsWith('+')) {
            if (formatted.startsWith('254')) {
                formatted = '+' + formatted;
            } else {
                formatted = '+254' + formatted;
            }
        }
        return formatted;
    };

    const handleInitiate = async (phoneToUse) => {
        try {
            setInitiateError(null);
            const targetPhone = phoneToUse || paymentPhone;
            const formatted = formatPhone(targetPhone);
            setStep('waiting');
            setTimer(60);

            const result = await initiatePayment({
                booking_id: bookingId,
                payment_phone: formatted
            }).unwrap();

            // ✅ Store the reference so we can poll verifyPayment
            if (result.reference) {
                setReference(result.reference);
            }

        } catch (err) {
            console.error('Payment initiation failed:', err);
            setInitiateError(err?.data?.error || err.message || 'Failed to trigger prompt');
            setStep('error');
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-border/50"
            >
                {/* Header */}
                <div className="bg-green-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        M-Pesa Payment
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-green-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'input' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Paying for</p>
                                <h4 className="font-bold text-lg dark:text-white">{serviceName || 'Consultation'}</h4>
                                <div className="text-2xl font-black text-green-600 mt-1">Ksh {amount}</div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Confirm M-Pesa Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={paymentPhone}
                                        onChange={(e) => setPaymentPhone(e.target.value)}
                                        className="w-full pl-12 rounded-xl border-border border-2 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all text-lg font-medium"
                                        placeholder="0712345678"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => handleInitiate()}
                                disabled={isInitiating || !paymentPhone}
                                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-200 dark:shadow-green-950/20"
                            >
                                {isInitiating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                Send Payment Prompt
                            </button>

                        </div>
                    )}

                    {step === 'waiting' && (
                        <div className="text-center space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-gray-100 dark:text-gray-800"
                                    />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={251.2 * (1 - timer / 60)}
                                        strokeLinecap="round"
                                        className="text-green-600 transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold dark:text-white">
                                    {timer}s
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold dark:text-white mb-2">Check your Phone</h3>
                                <p className="text-gray-500 text-sm">
                                    An M-Pesa STK Push has been sent to <strong>{paymentPhone}</strong>. Please enter your PIN.
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium animate-pulse">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Waiting for confirmation...
                                </div>
                                <button
                                    onClick={() => setStep('input')}
                                    className="text-xs text-green-600 hover:text-green-700 transition-colors uppercase font-bold tracking-widest"
                                >
                                    Use Different Number
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 scale-110">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold dark:text-white mb-2">Payment Received!</h3>
                                <p className="text-gray-500 text-sm">
                                    Your booking for <strong>{serviceName}</strong> is now confirmed. We've sent a confirmation email to your address.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 dark:shadow-green-950/20"
                            >
                                Great!
                            </button>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold dark:text-white mb-2">Payment Interrupted</h3>
                                <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                                    {initiateError}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setStep('input')}
                                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg"
                                >
                                    Use Different Number
                                </button>
                                <button
                                    onClick={() => handleInitiate()}
                                    className="text-sm text-gray-500 font-bold hover:text-foreground"
                                >
                                    Retry with same number
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default PaymentModal;
