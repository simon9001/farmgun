import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateBookingMutation, useGetSlotsQuery } from '../features/Api/bookingsApi';
import { useGetPublicServicesQuery } from '../features/Api/publicApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Loader2, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInitiatePaymentMutation } from '../features/Api/paymentsApi';
import PaymentModal from '../components/PaymentModal';



const bookingSchema = z.object({
    service_id: z.string().uuid('Please select a service'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date is required'),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Please select a time slot'),
    payment_phone: z.string().regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, 'Invalid phone number'),
    user_notes: z.string().optional(),
    pricing_option: z.string().optional(),
});



const Bookings = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedServiceId = searchParams.get('serviceId');

    const [createBooking, { isLoading: isBooking, error: bookingError }] = useCreateBookingMutation();
    const [initiatePayment, { isLoading: isInitiating }] = useInitiatePaymentMutation();
    const { data: servicesData, isLoading: servicesLoading } = useGetPublicServicesQuery({});

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_id: preSelectedServiceId || '',
            date: '',
            start_time: '',
            payment_phone: '',
            user_notes: '',
            pricing_option: ''
        }
    });

    // Pre-fill service from URL param
    useEffect(() => {
        if (preSelectedServiceId) {
            setValue('service_id', preSelectedServiceId);
        }
    }, [preSelectedServiceId, setValue]);

    const selectedServiceId = watch('service_id');
    const selectedDate = watch('date');
    const selectedTime = watch('start_time');

    // Fetch available slots
    const { data: slotsData, isLoading: slotsLoading, isFetching: slotsFetching } = useGetSlotsQuery(
        { date: selectedDate, service_id: selectedServiceId },
        { skip: !selectedDate || !selectedServiceId }
    );

    const availableSlots = slotsData?.slots || [];

    const [paymentModalData, setPaymentModalData] = useState({ isOpen: false, bookingId: null, initialPhone: '', amount: 0, serviceName: '' });



    const onSubmit = async (data) => {
        try {
            const result = await createBooking(data).unwrap();

            // Open Payment Modal
            const selectedService = servicesData?.services?.find(s => s.id === data.service_id);
            let finalPrice = selectedService?.price;

            if (data.pricing_option && selectedService?.pricing_options) {
                const opt = selectedService.pricing_options.find(o => o.label === data.pricing_option);
                if (opt && !opt.is_custom && opt.price) {
                    finalPrice = opt.price;
                }
            }

            setPaymentModalData({
                isOpen: true,
                bookingId: result.booking.id,
                initialPhone: data.payment_phone,
                amount: finalPrice || result.booking.service.price,
                serviceName: result.booking.service.name
            });


        } catch (err) {
            console.error('Booking failed:', err);
        }
    };





    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <PaymentModal
                {...paymentModalData}
                onClose={() => {
                    setPaymentModalData({ ...paymentModalData, isOpen: false });
                    navigate('/dashboard'); // Go to dashboard after closing/finishing
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                <div className="bg-green-600 px-8 py-8 text-white">
                    <h1 className="text-3xl font-bold">Book your Consultation</h1>
                    <p className="text-green-100 mt-2">Choose a service and pick a time that works for you.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Service Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    1. Select Service
                                </label>
                                <select
                                    {...register('service_id')}
                                    className="w-full rounded-xl border-gray-200 border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                                >
                                    <option value="">-- Choose a Service --</option>
                                    {servicesData?.services?.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} ({service.duration_mins} mins) - Ksh {service.price}
                                        </option>
                                    ))}
                                </select>
                                {errors.service_id && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.service_id.message}
                                    </p>
                                )}
                            </div>

                            {/* Pricing Options */}
                            {selectedServiceId && servicesData?.services?.find(s => s.id === selectedServiceId)?.pricing_options?.length > 0 && (
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        1b. Choose Plan / Option
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {servicesData.services.find(s => s.id === selectedServiceId).pricing_options.map((opt, i) => (
                                            <label
                                                key={i}
                                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${watch('pricing_option') === opt.label
                                                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                                        : 'border-gray-100 dark:border-gray-800 hover:border-green-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        {...register('pricing_option')}
                                                        value={opt.label}
                                                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                                                    />
                                                    <div>
                                                        <span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider">{opt.label}</span>
                                                        {opt.note && <p className="text-[10px] text-gray-500 italic">{opt.note}</p>}
                                                    </div>
                                                </div>
                                                <span className="font-bold text-green-600">
                                                    {opt.is_custom ? 'Quote' : `KES ${opt.price}`}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    2. Pick a Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        {...register('date')}
                                        onChange={(e) => {
                                            register('date').onChange(e);
                                            setValue('start_time', ''); // Reset time when date changes
                                        }}
                                        className="w-full pl-12 rounded-xl border-gray-200 border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {errors.date && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.date.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    3. Your Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        {...register('payment_phone')}
                                        className="w-full pl-12 rounded-xl border-gray-200 border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                                        placeholder="e.g. 0712345678"
                                    />
                                </div>
                                {errors.payment_phone && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.payment_phone.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    4. Additional Notes (Optional)
                                </label>
                                <textarea
                                    {...register('user_notes')}
                                    rows={3}
                                    className="w-full rounded-xl border-gray-200 border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all resize-none"
                                    placeholder="Tell us about your farm or specific needs..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Slot Selection */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" /> 5. Select Start Time
                            </label>

                            {!selectedDate || !selectedServiceId ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500 italic">
                                    <Calendar className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Select a service and date to view available time slots.</p>
                                </div>
                            ) : slotsLoading || slotsFetching ? (
                                <div className="flex flex-col items-center justify-center h-48">
                                    <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-2" />
                                    <p className="text-sm text-gray-500">Checking availability...</p>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            type="button"
                                            disabled={!slot.available}
                                            onClick={() => setValue('start_time', slot.time)}
                                            className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${selectedTime === slot.time
                                                ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-600 ring-offset-2'
                                                : slot.available
                                                    ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-600'
                                                    : 'bg-gray-100 dark:bg-gray-900 text-gray-400 border-transparent cursor-not-allowed line-through'
                                                }`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 text-red-500">
                                    <p>No available slots for the selected date. Please try another day.</p>
                                </div>
                            )}

                            {errors.start_time && (
                                <p className="text-red-500 text-sm mt-4 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {errors.start_time.message}
                                </p>
                            )}
                        </div>

                        {/* Booking Error */}
                        {bookingError && (
                            <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{bookingError?.data?.error || 'Unable to complete booking. Please verify details and try again.'}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={isBooking || !selectedTime}
                                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-green-100"
                            >
                                {isBooking || isInitiating ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Proceed to Payment'
                                )}

                            </button>
                        </div>
                    </form>
                </div>
            </motion.div >
        </div >
    );
};

export default Bookings;
