import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function IdeaShow() {
    return (
        <AppLayout active="ideas">
            <Head title="Idea Detail | IdeaForge" />
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                In Discussion
                            </span>
                            <span className="text-on-surface-variant text-xs">Updated 2h ago</span>
                        </div>
                        <h1 className="text-4xl font-bold text-on-surface tracking-tight">
                            Eco-Sync: Collaborative Resource Allocation for Urban Farming
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30">
                                <span className="text-sm font-medium text-on-surface">GreenGrid Collective</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-outline text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit
                            </button>
                            <button className="px-4 py-2 bg-on-surface text-background text-sm font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                                Status
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                        </div>
                        {/* Vote bar */}
                        <div className="bg-surface-container rounded-xl p-1 border border-outline-variant flex items-center shadow-sm">
                            <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-white rounded-lg transition-all active:scale-90">
                                <span className="material-symbols-outlined">thumb_up</span>
                            </button>
                            <div className="px-4 text-center">
                                <p className="text-2xl font-bold text-on-surface leading-none">124</p>
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Score</p>
                            </div>
                            <button className="p-3 text-on-surface-variant hover:text-error hover:bg-white rounded-lg transition-all active:scale-90">
                                <span className="material-symbols-outlined">thumb_down</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Structured content cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {[
                        {
                            icon: 'error_outline',
                            iconBg: 'bg-error-container/20',
                            iconColor: 'text-error',
                            title: 'The Problem',
                            body: 'Urban farming collectives struggle to coordinate the sharing of heavy machinery and water resources, leading to 40% resource idling and significant logistical friction during peak harvest seasons.',
                        },
                        {
                            icon: 'auto_awesome',
                            iconBg: 'bg-secondary-container/20',
                            iconColor: 'text-secondary',
                            title: 'The Solution',
                            body: 'Eco-Sync is a decentralized scheduling platform that automates resource handovers using a fair-use algorithm that prioritizes farms based on crop urgency and historical contribution.',
                        },
                        {
                            icon: 'person_pin_circle',
                            iconBg: 'bg-primary-container/10',
                            iconColor: 'text-primary',
                            title: 'Target User',
                            body: 'Urban farming collectives and community garden networks with 5–50 plots, primarily run by volunteers with limited technical expertise.',
                        },
                        {
                            icon: 'warning',
                            iconBg: 'bg-error-container/10',
                            iconColor: 'text-error',
                            title: 'Biggest Risk',
                            body: 'Low adoption due to the digital literacy barrier among older farmers. The onboarding flow must be extremely simple or the product fails.',
                        },
                    ].map((card) => (
                        <div key={card.title} className="bg-white p-6 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor}`}>
                                    <span className="material-symbols-outlined">{card.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-on-surface">{card.title}</h3>
                            </div>
                            <p className="text-on-surface-variant leading-relaxed">{card.body}</p>
                        </div>
                    ))}
                </div>

                {/* ── Comments ── */}
                <div className="bg-white rounded-xl border border-outline-variant/50 shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-on-surface mb-6">Discussion</h3>

                    {/* Comment input */}
                    <div className="flex gap-3 mb-8">
                        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm shrink-0">
                            A
                        </div>
                        <div className="flex-1">
                            <textarea
                                rows={3}
                                placeholder="Add a comment..."
                                className="w-full p-3 bg-surface-container rounded-lg text-sm border-none outline-none focus:ring-2 focus:ring-primary-container resize-none placeholder:text-on-surface-variant/60"
                            />
                            <div className="flex justify-end mt-2">
                                <button className="px-4 py-2 bg-primary-container text-on-primary-container text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all">
                                    Post comment
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comment list */}
                    <div className="space-y-6">
                        {[
                            { name: 'Sarah K.', time: '1 hour ago', body: 'The fair-use algorithm sounds promising. How would it handle disputes between farms?', replies: [] },
                            { name: 'David L.', time: '3 hours ago', body: 'I think the digital literacy risk is real. Could we build a WhatsApp interface layer on top?', replies: ['Great point David — that would remove the app barrier entirely.'] },
                        ].map((comment, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-sm shrink-0">
                                    {comment.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-on-surface">{comment.name}</span>
                                        <span className="text-xs text-on-surface-variant">{comment.time}</span>
                                    </div>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">{comment.body}</p>
                                    <button className="text-xs text-primary font-medium mt-2 hover:underline">Reply</button>

                                    {/* Replies */}
                                    {comment.replies.map((reply, j) => (
                                        <div key={j} className="flex gap-3 mt-4 pl-4 border-l-2 border-outline-variant">
                                            <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-bold shrink-0">
                                                Y
                                            </div>
                                            <p className="text-sm text-on-surface-variant leading-relaxed">{reply}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}