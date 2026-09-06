import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, Loader2, AlertCircle, Phone, Lock } from 'lucide-react';

import { useCreateBookingMutation, useGetSlotsQuery } from '../features/Api/bookingsApi';
import { useGetPublicServicesQuery } from '../features/Api/publicApi';
import { useInitiatePaymentMutation } from '../features/Api/paymentsApi';
import { selectIsAuthenticated } from '../features/Slice/AuthSlice';
import PaymentModal from '../components/PaymentModal';
import { PageHeader } from '../components/common/Page';
import { SITE } from '../config/site';

const bookingSchema = z.object({
    service_id: z.string().uuid('Choose a service'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Choose a time slot'),
    payment_phone: z.string().regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, 'Enter a valid Kenyan phone number, e.g. 0712345678'),
    user_notes: z.string().optional(),
    pricing_option: z.string().optional(),
});

/* Holds a visitor's selection across the sign-in detour, so nobody has to
   fill this form twice. */
const DRAFT_KEY = 'farmwithirene:bookingDraft';

const FieldError = ({ children }) => children ? (
    <p className="field-error flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        {children}
    </p>
) : null;

const Bookings = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedServiceId = searchParams.get('serviceId');
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [createBooking, { isLoading: isBooking, error: bookingError }] = useCreateBookingMutation();
    const [, { isLoading: isInitiating }] = useInitiatePaymentMutation();
    const { data: servicesData, isLoading: servicesLoading } = useGetPublicServicesQuery({});

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            service_id: preSelectedServiceId || '',
            date: '', start_time: '', payment_phone: '', user_notes: '', pricing_option: '',
        },
    });

    // Restore a draft left behind before signing in.
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(DRAFT_KEY);
            if (saved) {
                reset(JSON.parse(saved));
                sessionStorage.removeItem(DRAFT_KEY);
                return;
            }
        } catch { /* sessionStorage unavailable — fall through */ }

        if (preSelectedServiceId) setValue('service_id', preSelectedServiceId);
    }, [preSelectedServiceId, reset, setValue]);

    const selectedServiceId = watch('service_id');
    const selectedDate = watch('date');
    const selectedTime = watch('start_time');
    const selectedOption = watch('pricing_option');

    const { data: slotsData, isLoading: slotsLoading, isFetching: slotsFetching } = useGetSlotsQuery(
        { date: selectedDate, service_id: selectedServiceId },
        { skip: !selectedDate || !selectedServiceId }
    );

    const services = servicesData?.services || [];
    const availableSlots = slotsData?.slots || [];
    const activeService = services.find(s => s.id === selectedServiceId);
    const pricingOptions = activeService?.pricing_options || [];

    const [paymentModalData, setPaymentModalData] = useState({
        isOpen: false, bookingId: null, initialPhone: '', amount: 0, serviceName: '',
    });

    const onSubmit = async (data) => {
        // The sign-in wall sits here rather than at the door: a visitor can choose a
        // service, see real availability and pick a slot before being asked for an
        // account, and their selection survives the detour.
        if (!isAuthenticated) {
            try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch { /* ignore */ }
            navigate('/login', { state: { from: { pathname: '/booking' } } });
            return;
        }

        try {
            const result = await createBooking(data).unwrap();

            let finalPrice = activeService?.price;
            if (data.pricing_option && pricingOptions.length) {
                const opt = pricingOptions.find(o => o.label === data.pricing_option);
                if (opt && !opt.is_custom && opt.price) finalPrice = opt.price;
            }

            setPaymentModalData({
                isOpen: true,
                bookingId: result.booking.id,
                initialPhone: data.payment_phone,
                amount: finalPrice || result.booking.service.price,
                serviceName: result.booking.service.name,
            });
        } catch (err) {
            console.error('Booking failed:', err);
        }
    };

    const busy = isBooking || isInitiating;

    return (
        <>
            <PaymentModal
                {...paymentModalData}
                onClose={() => {
                    setPaymentModalData(prev => ({ ...prev, isOpen: false }));
                    navigate('/dashboard');
                }}
            />

            <PageHeader
                title="Book a consultation"
                lead="Choose what you need, pick a time that works, and we will confirm. Payment happens by M-Pesa once the slot is held."
                action={<a href={SITE.phoneHref} className="btn btn-outline tnum">Or call {SITE.phoneDisplay}</a>}
            />

            <div className="shell py-12 sm:py-16">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] items-start">

                    <div className="panel p-6 sm:p-8 space-y-6">

                        <div>
                            <label htmlFor="service_id" className="field-label">Service</label>
                            <select
                                id="service_id"
                                {...register('service_id')}
                                aria-invalid={!!errors.service_id}
                                className="field-input"
                                disabled={servicesLoading}
                            >
                                <option value="">
                                    {servicesLoading ? 'Loading services…' : 'Choose a service'}
                                </option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                        {service.duration_mins > 0 ? ` — ${service.duration_mins} mins` : ''}
                                        {service.price ? ` — Ksh ${Number(service.price).toLocaleString('en-KE')}` : ''}
                                    </option>
                                ))}
                            </select>
                            <FieldError>{errors.service_id?.message}</FieldError>
                        </div>

                        {pricingOptions.length > 0 && (
                            <fieldset>
                                <legend className="field-label">Plan</legend>
                                <div className="space-y-2">
                                    {pricingOptions.map((opt, i) => (
                                        <label
                                            key={i}
                                            className={`flex items-center justify-between gap-4 p-4 rounded-md border cursor-pointer transition-colors
                                                ${selectedOption === opt.label ? 'border-field bg-field-tint' : 'border-rule hover:border-field'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <input type="radio" {...register('pricing_option')} value={opt.label}
                                                    className="w-4 h-4 accent-[#1f4d33]" />
                                                <span>
                                                    <span className="block font-medium">{opt.label}</span>
                                                    {opt.note && <span className="block text-sm text-quiet mt-0.5">{opt.note}</span>}
                                                </span>
                                            </span>
                                            <span className="font-medium tnum whitespace-nowrap">
                                                {opt.is_custom ? 'On quote' : `Ksh ${Number(opt.price).toLocaleString('en-KE')}`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        )}

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="field-label">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-quiet pointer-events-none" aria-hidden="true" />
                                    <input
                                        id="date"
                                        type="date"
                                        {...register('date', {
                                            onChange: () => setValue('start_time', ''),
                                        })}
                                        min={new Date().toISOString().split('T')[0]}
                                        aria-invalid={!!errors.date}
                                        className="field-input pl-10"
                                    />
                                </div>
                                <FieldError>{errors.date?.message}</FieldError>
                            </div>

                            <div>
                                <label htmlFor="payment_phone" className="field-label">M-Pesa phone number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-quiet pointer-events-none" aria-hidden="true" />
                                    <input
                                        id="payment_phone"
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        placeholder="0712345678"
                                        {...register('payment_phone')}
                                        aria-invalid={!!errors.payment_phone}
                                        className="field-input pl-10 tnum"
                                    />
                                </div>
                                <FieldError>{errors.payment_phone?.message}</FieldError>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="user_notes" className="field-label">
                                Anything we should know? <span className="text-quiet font-normal">(optional)</span>
                            </label>
                            <textarea
                                id="user_notes"
                                rows={3}
                                {...register('user_notes')}
                                placeholder="Acreage, water source, what you have grown before."
                                className="field-input resize-y"
                            />
                        </div>
                    </div>

                    {/* Time slots + submit */}
                    <div className="panel p-6 lg:sticky lg:top-28">
                        <h2 className="t-h3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-field" aria-hidden="true" />
                            Available times
                        </h2>

                        <div className="mt-4" aria-live="polite">
                            {!selectedDate || !selectedServiceId ? (
                                <p className="text-sm text-quiet py-8 text-center">
                                    Choose a service and a date to see open slots.
                                </p>
                            ) : slotsLoading || slotsFetching ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin text-field" />
                                    <p className="text-sm text-quiet">Checking availability</p>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            type="button"
                                            disabled={!slot.available}
                                            aria-pressed={selectedTime === slot.time}
                                            onClick={() => setValue('start_time', slot.time, { shouldValidate: true })}
                                            className={`py-2.5 rounded-md text-sm tnum border transition-colors
                                                ${selectedTime === slot.time
                                                    ? 'bg-field text-white border-field font-medium'
                                                    : slot.available
                                                        ? 'bg-white border-rule hover:border-field hover:text-field'
                                                        : 'bg-husk border-transparent text-quiet/50 line-through cursor-not-allowed'}`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-quiet py-8 text-center">
                                    Nothing open on that date. Try another day, or call {SITE.phoneDisplay}.
                                </p>
                            )}
                        </div>

                        <FieldError>{errors.start_time?.message}</FieldError>

                        {bookingError && (
                            <div className="mt-4 p-3.5 rounded-md bg-bulb-tint text-bulb text-sm flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-px" aria-hidden="true" />
                                <span>{bookingError?.data?.error || 'That booking did not go through. Check the details and try again.'}</span>
                            </div>
                        )}

                        <button type="submit" disabled={busy || !selectedTime} className="btn btn-primary btn-block mt-5">
                            {busy
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Working</>
                                : isAuthenticated
                                    ? 'Confirm and pay'
                                    : 'Continue'}
                        </button>

                        {!isAuthenticated && (
                            <p className="mt-3 text-xs text-quiet flex items-start gap-1.5">
                                <Lock className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
                                <span>
                                    You will sign in on the next step so we can hold the slot in your name.
                                    Your selection is kept.{' '}
                                    <Link to="/register" className="link">Create an account</Link>
                                </span>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default Bookings;
