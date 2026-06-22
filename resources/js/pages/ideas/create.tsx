import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEventHandler } from 'react';

export default function IdeaCreate() {
    const { data, setData, post, processing } = useForm({
        title: '',
        problem: '',
        solution: '',
        target_user: '',
        biggest_risk: '',
        status: 'raw',
        is_private: true,
    });

    const [isPrivate, setIsPrivate] = useState(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/ideas');
    };

    return (
        <>
            <Head title="Create Idea | IdeaForge" />

            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-10 h-16 flex items-center justify-between border-b border-outline-variant/30">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-outline-variant" />
                    <span className="text-sm font-medium text-outline italic">Drafting new entry...</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant opacity-60">Auto-saved</span>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg border border-outline text-on-surface text-sm font-medium hover:bg-surface-container transition-colors"
                    >
                        Discard
                    </Link>
                </div>
            </header>

            <form onSubmit={submit}>
                <main className="pt-32 pb-32 px-10 max-w-350 mx-auto grid grid-cols-12 gap-6">

                    {/* Left: Notebook form */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-16">

                        {/* Title */}
                        <section>
                            <input
                                type="text"
                                placeholder="Untitled Idea"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-5xl font-bold text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none"
                                spellCheck={false}
                            />
                            <div className="h-1 w-24 bg-primary-container rounded-full mt-3" />
                        </section>

                        {/* Fields */}
                        <div className="space-y-16">
                            {[
                                { key: 'problem' as const, icon: 'psychology', label: 'The Problem', placeholder: 'What friction or pain point does this solve? Describe the world as it is today...' },
                                { key: 'solution' as const, icon: 'lightbulb', label: 'The Solution', placeholder: 'How do we fix it? What is the unique approach of this idea?' },
                                { key: 'target_user' as const, icon: 'groups', label: 'Target User', placeholder: 'Who are we building for? Be specific about the persona...' },
                                { key: 'biggest_risk' as const, icon: 'warning', label: 'Biggest Risk', placeholder: 'What could go wrong? What is the one thing that might kill this idea?' },
                            ].map((field) => (
                                <div key={field.key} className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">{field.icon}</span>
                                        {field.label}
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder={field.placeholder}
                                        value={data[field.key]}
                                        onChange={e => setData(field.key, e.target.value)}
                                        className="w-full bg-transparent border-none p-0 text-lg text-on-surface placeholder:text-outline-variant focus:ring-0 resize-none outline-none leading-loose border-b border-outline-variant/40 pb-4"
                                        onInput={(e) => {
                                            const t = e.target as HTMLTextAreaElement;
                                            t.style.height = 'auto';
                                            t.style.height = t.scrollHeight + 'px';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Attributes sidebar */}
                    <aside className="col-span-12 lg:col-span-4">
                        <div className="sticky top-32 flex flex-col gap-5 p-6 bg-surface-container rounded-xl shadow-sm border border-outline-variant/20">
                            <h3 className="text-xl font-semibold">Attributes</h3>

                            {/* Status */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-on-surface-variant">Current Stage</label>
                                <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container-low rounded-lg">
                                    {(['raw', 'in_discussion', 'validated', 'shelved'] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setData('status', s)}
                                            className={`px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1.5 transition-colors
                                                ${data.status === s
                                                    ? 'bg-surface-container-highest text-primary shadow-sm'
                                                    : 'text-on-surface-variant hover:bg-surface-variant/20'
                                                }`}
                                        >
                                            {data.status === s && <span className="w-2 h-2 rounded-full bg-primary" />}
                                            {s === 'raw' ? 'Raw' : s === 'in_discussion' ? 'Discussion' : s === 'validated' ? 'Validated' : 'Shelved'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-outline-variant/30" />

                            {/* Private toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-on-surface block">Private Entry</label>
                                    <p className="text-xs text-on-surface-variant">Only you can see this until shared</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPrivate(!isPrivate);
                                        setData('is_private', !isPrivate);
                                    }}
                                    className={`w-12 h-6 rounded-full relative transition-colors p-0.5 ${isPrivate ? 'bg-primary-container' : 'bg-outline-variant'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="h-px bg-outline-variant/30" />

                            {/* Info note */}
                            <p className="text-xs text-on-surface-variant">You can share this idea to a team after saving.</p>
                        </div>
                    </aside>
                </main>

                {/* Bottom bar */}
                <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-outline-variant/50 px-10 py-4 backdrop-blur-sm">
                    <div className="max-w-350 mx-auto flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="px-8 py-3 rounded-lg text-sm font-semibold text-on-surface border border-outline hover:bg-surface-container transition-all"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-12 py-3 rounded-lg text-sm font-semibold text-white bg-primary-container shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            {processing ? 'Saving...' : 'Save Idea'}
                        </button>
                    </div>
                </footer>
            </form>
        </>
    );
}