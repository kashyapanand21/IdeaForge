import { Head, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AppLayout from '@/layouts/AppLayout';
import type { Auth } from '@/types/auth';

interface SharedProps {
    auth: Auth;
    name: string;
    [key: string]: unknown;
}

export default function ProfileIndex() {
    const { auth } = usePage<SharedProps>().props;

    const { data, setData, patch, processing } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/profile');
    };

    return (
        <AppLayout active="profile">
            <Head title="Profile Settings | IdeaForge" />
            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* Breadcrumb */}
                <nav className="mb-2 flex items-center gap-1 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                    <span>Account</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-primary">Profile Settings</span>
                </nav>

                <h1 className="text-3xl font-bold text-on-surface mb-2">Profile Settings</h1>
                <p className="text-on-surface-variant mb-8">Manage your identity and account security.</p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ── Left column ── */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* General info */}
                        <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">General Information</h2>
                            <form onSubmit={submit} className="space-y-6">

                                {/* Avatar */}
                                <div className="flex items-center gap-8 pb-6 border-b border-outline-variant/20">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-outline-variant bg-primary-container flex items-center justify-center">
                                            {auth.user.avatar ? (
                                                <img src={auth.user.avatar} alt={auth.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl font-bold text-on-primary-container">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                            <span className="material-symbols-outlined text-white">upload</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold">Profile Picture</h3>
                                        <p className="text-xs text-on-surface-variant mt-1">JPG, GIF or PNG. Max 800KB.</p>
                                        <div className="flex gap-2 mt-3">
                                            <button type="button" className="px-3 py-1.5 bg-surface-container-high rounded-lg text-xs font-semibold hover:bg-surface-variant transition-colors">
                                                Update
                                            </button>
                                            <button type="button" className="px-3 py-1.5 text-error rounded-lg text-xs font-semibold hover:bg-error-container/20 transition-colors">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-on-surface-variant">Display Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-on-surface-variant">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary text-on-primary px-8 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Security */}
                        <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Security</h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">lock</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold">Change Password</p>
                                            <p className="text-xs text-on-surface-variant">Update your account password regularly</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                                </button>
                                <div className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-secondary">verified_user</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Two-Factor Authentication</p>
                                            <p className="text-xs text-on-surface-variant">Currently enabled via authenticator app</p>
                                        </div>
                                    </div>
                                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── Right column ── */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Account meta */}
                        <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/30">
                            <h4 className="text-sm font-semibold text-on-surface mb-4">Account Metadata</h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Account Created', value: auth.user.created_at ? new Date(auth.user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A' },
                                    { label: 'Email Verified', value: auth.user.email_verified_at ? 'Yes' : 'Not verified' },
                                    { label: 'Plan', value: 'Free Builder' },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-outline-variant/20 last:border-0">
                                        <span className="text-sm text-on-surface-variant">{item.label}</span>
                                        <span className="text-sm font-semibold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status guide */}
                        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm">
                            <h4 className="text-sm font-semibold text-on-surface mb-4">Idea Status Guide</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-widest">Raw</span>
                                <span className="px-3 py-1 bg-primary-container/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">In Discussion</span>
                                <span className="px-3 py-1 bg-secondary-container/20 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest">Validated</span>
                                <span className="px-3 py-1 bg-error-container/20 text-error rounded-full text-[10px] font-bold uppercase tracking-widest">Shelved</span>
                            </div>
                        </div>

                        {/* Danger */}
                        <div className="mt-2">
                            <button className="flex items-center gap-2 text-error/60 hover:text-error transition-colors text-sm font-medium">
                                <span className="material-symbols-outlined">delete</span>
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}