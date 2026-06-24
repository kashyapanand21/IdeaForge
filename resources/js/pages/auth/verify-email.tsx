import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function VerifyEmail() {
    const { post, processing, wasSuccessful } = useForm({});

    const resend: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    const logout: FormEventHandler = (e) => {
        e.preventDefault();
        post('/logout');
    };

    return (
        <>
            <Head title="Verify Email | IdeaForge" />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fcf9f5' }}>
                <main className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-container/20 mb-6">
                        <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            mark_email_unread
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-on-surface mb-3">Verify your email</h1>
                    <p className="text-on-surface-variant mb-8 leading-relaxed">
                        We sent a verification link to your email address. Click it to activate your account.
                    </p>

                    {wasSuccessful && (
                        <div className="mb-6 p-3 bg-secondary-container/20 text-secondary rounded-lg text-sm">
                            New verification link sent — check your inbox.
                        </div>
                    )}

                    <form onSubmit={resend}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                        >
                            {processing ? 'Sending...' : 'Resend verification email'}
                        </button>
                    </form>

                    <form onSubmit={logout} className="mt-4">
                        <button
                            type="submit"
                            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                            Log out
                        </button>
                    </form>
                </main>
            </div>
        </>
    );
}