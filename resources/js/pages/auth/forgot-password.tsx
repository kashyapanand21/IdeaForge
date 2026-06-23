import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Forgot Password | IdeaForge" />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fcf9f5' }}>
                <main className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-container-high mb-4">
                            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                lock_reset
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-on-surface">IdeaForge</h1>
                        <p className="text-on-surface-variant mt-1">Reset your password</p>
                    </div>

                    <div className="bg-white rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                        <h2 className="text-2xl font-semibold text-on-surface mb-2">Forgot password?</h2>
                        <p className="text-sm text-on-surface-variant mb-6">
                            Enter your email and we'll send a reset link. If the account exists, you'll receive an email.
                        </p>

                        {wasSuccessful && (
                            <div className="mb-4 p-3 bg-secondary-container/20 text-secondary rounded-lg text-sm">
                                Reset link sent — check your inbox.
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="text-sm font-semibold text-on-surface-variant">Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-white text-on-surface outline-none placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container focus:border-primary"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-error px-1">{errors.email}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
                            >
                                {processing ? 'Sending...' : 'Send reset link'}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-on-surface-variant">
                        Remembered it?{' '}
                        <a href="/login" className="text-primary font-bold hover:underline underline-offset-4">Back to login</a>
                    </p>
                </main>
            </div>
        </>
    );
}