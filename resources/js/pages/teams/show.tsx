import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

const ideas = [
    { title: 'Sustainable Micro-Grid Logic', status: 'Validated', statusColor: 'bg-secondary/10 text-secondary', score: 85, comments: 24, desc: 'A decentralized protocol for managing localized solar energy sharing in residential neighborhoods using dynamic pricing models.' },
    { title: 'Automated Carbon Credit Ledger', status: 'In Discussion', statusColor: 'bg-primary-container/10 text-primary', score: 62, comments: 12, desc: 'Blockchain-based verification system for industrial carbon offset projects to prevent double-spending and ensure transparency.' },
    { title: 'AI-Driven UI Prototyping Engine', status: 'Raw', statusColor: 'bg-outline/10 text-outline', score: 47, comments: 8, desc: 'Generating functional React components from low-fidelity whiteboard sketches using computer vision and LLMs.' },
];

const activity = [
    { name: 'Alex M.', action: 'upvoted "Sustainable Micro-Grid"', time: '2 minutes ago', color: 'bg-primary-container' },
    { name: 'Sarah K.', action: 'commented on "Carbon Ledger"', time: '1 hour ago', color: 'bg-secondary-container' },
    { name: 'System', action: 'moved "Micro-Grid Logic" to Validated', time: '4 hours ago', color: 'bg-outline-variant' },
    { name: 'David L.', action: 'commented on "AI UI Prototyping"', time: 'Yesterday', color: 'bg-tertiary-fixed' },
    { name: 'Emma R.', action: 'joined the team via invite', time: '2 days ago', color: 'bg-primary-container' },
];

export default function TeamShow() {
    return (
        <AppLayout active="teams">
            <Head title="Team Dashboard | IdeaForge" />
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Team header ── */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-5xl">rocket_launch</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase">Verified Team</span>
                                <span className="text-on-surface-variant text-sm">Created Oct 2023</span>
                            </div>
                            <h1 className="text-4xl font-bold text-on-surface mb-2">Alpha Nexus Builders</h1>
                            <div className="flex items-center -space-x-2">
                                {['A', 'S', 'D'].map((initial, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-background flex items-center justify-center text-xs font-bold text-on-surface-variant">
                                        {initial}
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-background flex items-center justify-center text-xs font-bold text-on-surface-variant ml-1">
                                    +12
                                </div>
                                <span className="ml-4 text-sm text-on-surface-variant font-medium">Active contributors</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/teams/1/settings" className="px-4 py-2.5 border border-outline text-on-surface text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-sm">settings</span>
                            Settings
                        </Link>
                        <button className="px-4 py-2.5 bg-primary text-on-primary text-sm font-medium rounded-lg flex items-center gap-2 hover:opacity-90 shadow-sm active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-sm">person_add</span>
                            Invite member
                        </button>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Total Ideas', value: '124', icon: 'lightbulb', iconColor: 'text-primary', sub: '+12% vs last month' },
                        { label: 'Validated', value: '42', icon: 'verified', iconColor: 'text-secondary', sub: '34% conversion rate' },
                        { label: 'Active Hackathons', value: '3', icon: 'event', iconColor: 'text-primary-container', sub: 'Next ends in 2 days' },
                        { label: 'Member Count', value: '15', icon: 'group', iconColor: 'text-outline', sub: '2 pending invites' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-on-surface-variant text-sm font-medium">{stat.label}</span>
                                <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
                            </div>
                            <p className="text-3xl font-bold text-on-surface mb-1">{stat.value}</p>
                            <p className="text-xs text-on-surface-variant">{stat.sub}</p>
                        </div>
                    ))}
                </section>

                {/* ── Main workspace ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Ideas board */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-on-surface">Top Team Ideas</h2>
                            <div className="flex bg-surface-container p-1 rounded-lg">
                                <button className="px-4 py-1.5 bg-surface-container-lowest rounded-md shadow-sm text-sm font-medium">By Score</button>
                                <button className="px-4 py-1.5 text-sm font-medium text-on-surface-variant">Recent</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {ideas.map((idea) => (
                                <div key={idea.title} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center gap-1 px-2 py-3 bg-surface-container rounded-lg h-fit">
                                            <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">arrow_drop_up</button>
                                            <span className="font-bold text-xl leading-none">{idea.score}</span>
                                            <button className="material-symbols-outlined text-on-surface-variant hover:scale-110 transition-transform">arrow_drop_down</button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`${idea.statusColor} text-xs font-bold px-2 py-0.5 rounded uppercase`}>{idea.status}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-on-surface mb-2">{idea.title}</h3>
                                            <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">{idea.desc}</p>
                                            <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                                    {idea.comments}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity feed */}
                    <aside className="lg:col-span-4">
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-on-surface mb-6">Team Activity</h3>
                            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
                                {activity.map((item, i) => (
                                    <div key={i} className="relative pl-8">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${item.color} border-4 border-surface-container-lowest`} />
                                        <p className="text-sm font-semibold text-on-surface">
                                            {item.name}{' '}
                                            <span className="font-normal text-on-surface-variant">{item.action}</span>
                                        </p>
                                        <span className="text-xs text-on-surface-variant/60">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 text-primary text-sm font-medium hover:bg-surface-container rounded-lg transition-colors">
                                View full activity log
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile FAB */}
            <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all lg:hidden">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </AppLayout>
    );
}