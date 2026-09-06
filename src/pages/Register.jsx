import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegisterMutation } from '../features/Api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/Slice/AuthSlice';
import { Loader2, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Enter your name'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, 'Enter a valid Kenyan phone number, e.g. 0712345678'),
    password: z.string().min(6, 'Use at least 6 characters'),
    role: z.enum(['client', 'agent', 'admin']).default('client'),
});

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [registerUser, { isLoading, error }] = useRegisterMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'client' },
    });

    const from = location.state?.from?.pathname;

    const onSubmit = async (data) => {
        try {
            const result = await registerUser(data).unwrap();
            dispatch(setCredentials({ ...result, isAuthenticated: true }));
            navigate(
                result.user?.role === 'admin' ? '/admin' : (from || '/dashboard'),
                { replace: true }
            );
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="shell flex justify-center py-16 sm:py-24">
            <div className="w-full max-w-md">
                <div className="panel p-8">
                    <h1 className="t-h2 text-[1.75rem]">Create an account</h1>
                    <p className="text-quiet mt-2 text-[0.9375rem]">
                        {from === '/booking'
                            ? 'One step and your slot is held. Your booking details are saved.'
                            : 'So we can hold your bookings and keep your farm records in one place.'}
                    </p>

                    <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="name" className="field-label">Full name</label>
                            <input id="name" type="text" autoComplete="name"
                                aria-invalid={!!errors.name} className="field-input" {...register('name')} />
                            {errors.name && <p className="field-error">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="field-label">Email</label>
                            <input id="email" type="email" autoComplete="email" inputMode="email"
                                aria-invalid={!!errors.email} className="field-input" {...register('email')} />
                            {errors.email && <p className="field-error">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="field-label">Phone number</label>
                            <input id="phone" type="tel" autoComplete="tel" inputMode="tel"
                                placeholder="0712345678"
                                aria-invalid={!!errors.phone} className="field-input tnum" {...register('phone')} />
                            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="field-label">Password</label>
                            <input id="password" type="password" autoComplete="new-password"
                                aria-invalid={!!errors.password} className="field-input" {...register('password')} />
                            {errors.password
                                ? <p className="field-error">{errors.password.message}</p>
                                : <p className="text-xs text-quiet mt-1.5">At least 6 characters.</p>}
                        </div>

                        <input type="hidden" {...register('role')} />

                        {error && (
                            <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-md bg-bulb-tint text-bulb text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-px" aria-hidden="true" />
                                <span>{error.data?.error || 'We could not create that account. Check the details and try again.'}</span>
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
                            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account</> : 'Create account'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-quiet">
                    Already have an account?{' '}
                    <Link to="/login" state={location.state} className="link">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
