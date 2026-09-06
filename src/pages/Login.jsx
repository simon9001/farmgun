import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../features/Api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/Slice/AuthSlice';
import { Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [login, { isLoading, error }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const from = location.state?.from?.pathname || '/dashboard';
    const returningToBooking = from === '/booking';

    const onSubmit = async (data) => {
        try {
            const result = await login(data).unwrap();
            dispatch(setCredentials({ ...result, isAuthenticated: true }));
            navigate(result.user?.role === 'admin' ? '/admin' : from, { replace: true });
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="shell flex justify-center py-16 sm:py-24">
            <div className="w-full max-w-md">
                <div className="panel p-8">
                    <h1 className="t-h2 text-[1.75rem]">Sign in</h1>
                    <p className="text-quiet mt-2 text-[0.9375rem]">
                        {returningToBooking
                            ? 'Sign in to hold your slot. Everything you selected is still saved.'
                            : 'Access your bookings, invoices and farm records.'}
                    </p>

                    <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="field-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                aria-invalid={!!errors.email}
                                className="field-input"
                                {...register('email')}
                            />
                            {errors.email && <p className="field-error">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-baseline justify-between">
                                <label htmlFor="password" className="field-label">Password</label>
                                <Link to="/forgot-password" className="text-sm text-field hover:underline mb-1.5">
                                    Forgot it?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={!!errors.password}
                                className="field-input"
                                {...register('password')}
                            />
                            {errors.password && <p className="field-error">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-md bg-bulb-tint text-bulb text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-px" aria-hidden="true" />
                                <span>{error.data?.error || 'That email and password did not match. Try again.'}</span>
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
                            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in</> : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-quiet">
                    No account yet?{' '}
                    <Link to="/register" state={location.state} className="link">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
