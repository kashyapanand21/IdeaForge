import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Register | IdeaForge" />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-10 text-[#1c1c1a]"
                style={{
                    backgroundColor: '#fcf9f5',
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(224,123,57,0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(154,70,1,0.03) 0px, transparent 50%)'
                }}>

                <main className="w-full max-w-110">
                    {/* Branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#ebe8e4] mb-4"
                            style={{ boxShadow: '0 2px 4px rgba(28,28,26,0.05)' }}>
                            <span className="material-symbols-outlined text-[#9a4601] text-[32px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}>
                                lightbulb
                            </span>
                        </div>
                        <h1 className="text-[32px] font-bold leading-10 tracking-tight text-[#1c1c1a]"
                            style={{ fontFamily: 'DM Sans' }}>
                            IdeaForge
                        </h1>
                        <p className="text-[16px] text-[#554339] mt-1">
                            Build the future, one idea at a time
                        </p>
                    </div>

                    {/* Card */}
                    <section className="bg-white rounded-xl p-8 border border-[#dcc1b4]/30 relative overflow-hidden"
                        style={{ boxShadow: '0 2px 4px rgba(28,28,26,0.05)' }}>

                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#f6f3ef] opacity-40 transform translate-x-8 -translate-y-8 rotate-45 pointer-events-none" />

                        <header className="mb-6">
                            <h2 className="text-[24px] font-semibold text-[#1c1c1a]"
                                style={{ fontFamily: 'DM Sans' }}>
                                Create an account
                            </h2>
                            <p className="text-[14px] text-[#554339]">
                                Join our digital workshop and start crafting.
                            </p>
                        </header>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[14px] font-semibold text-[#554339] px-1"
                                    htmlFor="name">
                                    Name
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897367] text-[20px]">
                                        person
                                    </span>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#dcc1b4] bg-white text-[#1c1c1a] outline-none transition-all placeholder:text-[#dcc1b4] focus:ring-2 focus:ring-[#e07b39] focus:border-[#9a4601]"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-[12px] text-red-500 px-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[14px] font-semibold text-[#554339] px-1"
                                    htmlFor="email">
                                    Email
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897367] text-[20px]">
                                        mail
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#dcc1b4] bg-white text-[#1c1c1a] outline-none transition-all placeholder:text-[#dcc1b4] focus:ring-2 focus:ring-[#e07b39] focus:border-[#9a4601]"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-[12px] text-red-500 px-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[14px] font-semibold text-[#554339] px-1"
                                    htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897367] text-[20px]">
                                        lock
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#dcc1b4] bg-white text-[#1c1c1a] outline-none transition-all placeholder:text-[#dcc1b4] focus:ring-2 focus:ring-[#e07b39] focus:border-[#9a4601]"
                                        required
                                    />
                                </div>
                                <p className="text-[12px] text-[#897367] px-1 mt-1">
                                    Must be at least 8 characters long.
                                </p>
                                {errors.password && (
                                    <p className="text-[12px] text-red-500 px-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[14px] font-semibold text-[#554339] px-1"
                                    htmlFor="password_confirmation">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897367] text-[20px]">
                                        lock
                                    </span>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#dcc1b4] bg-white text-[#1c1c1a] outline-none transition-all placeholder:text-[#dcc1b4] focus:ring-2 focus:ring-[#e07b39] focus:border-[#9a4601]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#e07b39] text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[#9a4601] active:scale-[0.98] disabled:opacity-60"
                            >
                                {processing ? 'Creating account...' : 'Sign up'}
                                {!processing && (
                                    <span className="material-symbols-outlined text-[18px]">
                                        arrow_forward
                                    </span>
                                )}
                            </button>
                        </form>
                    </section>

                    {/* Footer */}
                    <footer className="mt-6 text-center">
                        <p className="text-[14px] text-[#554339]">
                            Already have an account?{' '}
                            <a href="/login"
                                className="text-[#9a4601] font-bold hover:underline underline-offset-4">
                                Log in
                            </a>
                        </p>
                    </footer>

                    <p className="mt-16 text-center text-[12px] text-[#897367] px-8 leading-relaxed">
                        By signing up, you agree to the{' '}
                        <a href="#" className="underline hover:text-[#1c1c1a]">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="underline hover:text-[#1c1c1a]">Privacy Policy</a>.
                    </p>
                </main>
            </div>
        </>
    );
}