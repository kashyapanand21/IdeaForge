import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

type MilestoneStatus = 'done' | 'pending' | 'raw';

interface Milestone {
    title: string;
    assignee: string;
    due: string;
    status: MilestoneStatus;
}

const initialMilestones: Milestone[] = [
    { title: 'Initial Architecture & DB Schema', assignee: 'Alex River', due: 'Oct 14', status: 'done' },
    { title: 'API Integration & Frontend Scaffold', assignee: 'Sarah Chen', due: 'Oct 18', status: 'pending' },
    { title: 'User Authentication & Profile Logic', assignee: 'Jamie Fox', due: 'Oct 22', status: 'raw' },
];

export default function HackathonShow() {
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);

    const toggleMilestone = (index: number) => {
        setMilestones(prev => prev.map((m, i) => {
            if (i !== index) {
                return m;
            }

            return { ...m, status: m.status === 'done' ? 'pending' : 'done' };
        }));
    };

    const completedCount = milestones.filter(m => m.status === 'done').length;
    const progressPercent = Math.round((completedCount / milestones.length) * 100);

    return (
        <AppLayout active="ideas">
            <Head title="Hackathon Detail | IdeaForge" />
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

                {/* ── Header bento ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main info */}
                    <div className="md:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-outline-variant/30">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">Building</span>
                                    <span className="text-on-surface-variant text-sm">Hackathon Detail</span>
                                </div>
                                <h1 className="text-4xl font-bold text-on-surface">Global Buildathon 2024</h1>
                                <p className="text-on-surface-variant text-lg mt-1">
                                    Organized by <span className="font-semibold text-primary">ForgeX Ecosystem</span>
                                </p>
                            </div>
                            <a href="#" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                                <span>Visit Site</span>
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>

                        {/* Info row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-outline-variant/20">
                            {[
                                { icon: 'cloud', label: 'Mode', value: 'Remote' },
                                { icon: 'location_on', label: 'Location', value: 'Global / SF Hub' },
                                { icon: 'groups', label: 'Team Size', value: '2–5 Members' },
                                { icon: 'calendar_month', label: 'Dates', value: 'Oct 12–28' },
                            ].map((info) => (
                                <div key={info.label} className="flex flex-col">
                                    <span className="text-on-surface-variant text-xs font-semibold uppercase">{info.label}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="material-symbols-outlined text-primary text-lg">{info.icon}</span>
                                        <span className="text-sm font-medium">{info.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Linked idea */}
                    <div className="bg-surface-container rounded-xl p-6 shadow-sm flex flex-col justify-between border border-outline-variant/50">
                        <div>
                            <span className="text-on-surface-variant text-xs font-semibold uppercase">Linked Idea</span>
                            <h3 className="text-2xl font-semibold text-primary mt-2">EcoTrace Analytics</h3>
                            <p className="text-on-surface-variant text-sm mt-2 line-clamp-3">
                                A supply chain transparency platform leveraging distributed ledgers to track carbon footprints in real-time.
                            </p>
                        </div>
                        <Link href="/ideas/1" className="text-primary text-sm font-semibold hover:underline mt-4 block">
                            View Idea →
                        </Link>
                    </div>
                </div>

                {/* ── Milestones + sidebar ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Milestones */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                            <div className="px-8 py-5 flex justify-between items-center border-b border-outline-variant/20">
                                <h2 className="text-xl font-semibold text-on-surface">Development Milestones</h2>
                                <button className="flex items-center gap-2 bg-primary px-4 py-2 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                                    <span className="material-symbols-outlined text-sm">add_task</span>
                                    Add Milestone
                                </button>
                            </div>
                            <div className="divide-y divide-outline-variant/10">
                                {milestones.map((m, i) => (
                                    <div
                                        key={i}
                                        className="group flex items-center gap-4 px-8 py-4 hover:bg-surface-container-low transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleMilestone(i)}
                                            className="shrink-0 transition-opacity"
                                        >
                                            <span className={`material-symbols-outlined text-2xl ${m.status === 'done' ? 'text-secondary' : 'text-outline-variant'}`}>
                                                {m.status === 'done' ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </button>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className={`text-sm font-semibold ${m.status === 'done' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                                    {m.title}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                                    ${m.status === 'done' ? 'bg-secondary/10 text-secondary' :
                                                      m.status === 'pending' ? 'bg-primary-container/20 text-primary' :
                                                      'bg-surface-variant text-on-surface-variant'}`}>
                                                    {m.status === 'done' ? 'Done' : m.status === 'pending' ? 'In Progress' : 'Raw'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    {m.assignee}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    {m.due}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-primary transition-all">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">

                        {/* Progress */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/30">
                            <div className="flex justify-between items-end mb-4">
                                <h4 className="text-sm font-semibold text-on-surface">Overall Progress</h4>
                                <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-surface-container rounded-full h-3 mb-4">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-700"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <div className="space-y-2 text-xs text-on-surface-variant">
                                <div className="flex justify-between">
                                    <span>Milestones Completed</span>
                                    <span className="font-bold">{completedCount} / {milestones.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Days Remaining</span>
                                    <span className="font-bold">12 Days</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-2 border border-outline text-outline rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors">
                                Update Status
                            </button>
                        </div>

                        {/* Project assets */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/30">
                            <h4 className="text-sm font-semibold text-on-surface mb-4">Project Assets</h4>
                            <div className="space-y-3">
                                {[
                                    { icon: 'code', bg: 'bg-on-surface', text: 'text-white', label: 'GitHub Repository', sub: 'private-repo/ecotrace' },
                                    { icon: 'rocket_launch', bg: 'bg-secondary-container', text: 'text-on-secondary-container', label: 'Live Deployment', sub: 'ecotrace-demo.vercel.app' },
                                    { icon: 'description', bg: 'bg-primary-container', text: 'text-on-primary-container', label: 'Submission Deck', sub: 'Last updated 2h ago' },
                                ].map((link) => (
                                    <a key={link.label} href="#" className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors group">
                                        <div className={`w-8 h-8 rounded ${link.bg} flex items-center justify-center ${link.text} shrink-0`}>
                                            <span className="material-symbols-outlined text-sm">{link.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-on-surface">{link.label}</p>
                                            <p className="text-[10px] text-on-surface-variant">{link.sub}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}