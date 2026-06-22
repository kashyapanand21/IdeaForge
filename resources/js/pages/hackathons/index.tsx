import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

type TabKey = 'All' | 'Interested' | 'Registered' | 'Building' | 'Submitted';

const tabs: TabKey[] = ['All', 'Interested', 'Registered', 'Building', 'Submitted'];

const hackathons = [
    {
        name: 'Serverless Summit 2024',
        organizer: 'AWS',
        status: 'Building' as TabKey,
        statusColor: 'bg-secondary-container/30 text-on-secondary-fixed-variant',
        icon: 'cloud_done',
        linkedIdea: 'EcoSync Analytics Engine',
        progress: 75,
        deadline: '2 Days Left',
        deadlineColor: 'text-error',
    },
    {
        name: 'Code for Climate',
        organizer: 'UN Global',
        status: 'Registered' as TabKey,
        statusColor: 'bg-primary-container/20 text-on-primary-fixed-variant',
        icon: 'terminal',
        linkedIdea: null,
        progress: 0,
        deadline: 'Starts in 12 Days',
        deadlineColor: 'text-on-surface',
    },
    {
        name: 'AI Agents Workshop',
        organizer: 'Anthropic',
        status: 'Interested' as TabKey,
        statusColor: 'bg-surface-variant/40 text-on-surface-variant',
        icon: 'neurology',
        linkedIdea: null,
        progress: null,
        deadline: null,
        deadlineColor: '',
    },
    {
        name: 'Web3 World Builders',
        organizer: 'Ethereum Foundation',
        status: 'Submitted' as TabKey,
        statusColor: 'bg-secondary-fixed/30 text-on-secondary-fixed-variant',
        icon: 'grid_view',
        linkedIdea: 'DeFi Pulse Protocol',
        progress: 40,
        deadline: 'Results in 4 Days',
        deadlineColor: 'text-on-surface',
    },
];

export default function HackathonIndex() {
    const [activeTab, setActiveTab] = useState<TabKey>('All');

    const filtered = activeTab === 'All'
        ? hackathons
        : hackathons.filter(h => h.status === activeTab);

    return (
        <AppLayout active="teams">
            <Head title="Hackathon Hub | IdeaForge" />
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Page header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-on-background mb-2">Hackathon Hub</h1>
                        <p className="text-on-surface-variant text-lg max-w-2xl">Track participation, manage deadlines, and build with your team.</p>
                    </div>
                    <button className="bg-primary text-on-primary text-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-sm active:scale-95">
                        <span className="material-symbols-outlined">rocket_launch</span>
                        Add Hackathon
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-2xl w-fit mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors
                                ${activeTab === tab
                                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                                    : 'text-on-surface-variant hover:bg-surface-variant/20'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((h) => (
                        <div key={h.name} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-5 relative hover:-translate-y-1 hover:shadow-md transition-all duration-150">

                            {/* Status badge */}
                            <div className="absolute top-0 right-0 p-4">
                                <span className={`${h.statusColor} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                                    {h.status}
                                </span>
                            </div>

                            {/* Icon + name */}
                            <div className="flex items-start gap-4 pr-24">
                                <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-3xl">{h.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-on-surface leading-tight">{h.name}</h3>
                                    <p className="text-sm text-on-surface-variant opacity-60">{h.organizer}</p>
                                </div>
                            </div>

                            {/* Linked idea */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold text-on-surface-variant uppercase">
                                    <span>Linked Idea</span>
                                    <span className="text-primary cursor-pointer">{h.linkedIdea ? 'View Details' : 'Assign Idea'}</span>
                                </div>
                                {h.linkedIdea ? (
                                    <div className="p-3 bg-surface-container-low rounded-lg flex items-center gap-3">
                                        <span className="material-symbols-outlined text-outline">psychology</span>
                                        <span className="text-sm font-medium">{h.linkedIdea}</span>
                                    </div>
                                ) : (
                                    <button className="w-full border border-dashed border-outline-variant p-3 rounded-lg flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm">
                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                        Link an Idea to start building
                                    </button>
                                )}
                            </div>

                            {/* Progress */}
                            {h.progress !== null && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                                        <span>Milestone Progress</span>
                                        <span>{h.progress}%</span>
                                    </div>
                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-700"
                                            style={{ width: `${h.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-auto pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                                {h.deadline ? (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-on-surface-variant uppercase opacity-60">Deadline</span>
                                        <span className={`text-sm font-bold flex items-center gap-1 ${h.deadlineColor}`}>
                                            <span className="material-symbols-outlined text-sm">timer</span>
                                            {h.deadline}
                                        </span>
                                    </div>
                                ) : (
                                    <div />
                                )}
                                {h.status === 'Interested' ? (
                                    <button className="flex-grow ml-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                                        Register Now
                                    </button>
                                ) : (
                                    <Link
                                        href="/hackathons/1"
                                        className="p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all"
                                    >
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Empty state card */}
                    <div className="border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center p-8 gap-4 text-center hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-4xl">explore</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-on-surface">Find your next challenge</h4>
                            <p className="text-sm text-on-surface-variant mt-1">Browse active hackathons on the IdeaForge network.</p>
                        </div>
                        <button className="text-sm font-semibold text-primary border-b-2 border-primary/20 hover:border-primary transition-all">
                            Explore Marketplace
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}