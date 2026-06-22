import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function TeamSettings() {
    return (
        <AppLayout active="teams">
            <Head title="Team Settings | IdeaForge" />
            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
                    <span>My Teams</span>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                    <span className="text-primary font-medium">Team Settings</span>
                </div>
                <h1 className="text-3xl font-bold text-on-surface mb-8">Settings</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ── Left column ── */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Team profile */}
                        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/20">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/30 overflow-hidden">
                                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">group</span>
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">Foundry Collective</h2>
                                    <p className="text-on-surface-variant text-sm">Team ID: foundry_2024_01</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Team Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Foundry Collective"
                                        className="w-full p-3 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Description</label>
                                    <textarea
                                        rows={4}
                                        defaultValue="A multi-disciplinary group of builders focused on creating high-impact digital tools for the modern creator economy."
                                        className="w-full p-3 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm transition-all resize-none"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button className="px-6 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-all">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Members */}
                        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Team Members</h3>
                                <span className="text-sm text-on-surface-variant">4 Active Members</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'Marcus Thorne', email: 'marcus@foundry.cc', role: 'Owner', roleColor: 'bg-secondary-container text-on-secondary-container' },
                                    { name: 'Sarah Jenkins', email: 'sarah.j@foundry.cc', role: 'Admin', roleColor: 'bg-primary-container/20 text-primary' },
                                    { name: 'David Chen', email: 'd.chen@foundry.cc', role: 'Member', roleColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
                                ].map((member) => (
                                    <div key={member.email} className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface-variant text-sm">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-on-surface">{member.name}</p>
                                                <p className="text-xs text-on-surface-variant">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${member.roleColor}`}>
                                                {member.role}
                                            </span>
                                            {member.role !== 'Owner' && (
                                                <button className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error-container/50">
                                                    <span className="material-symbols-outlined text-xl">person_remove</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ── Right column ── */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Invite */}
                        <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20">
                            <h3 className="text-xl font-semibold mb-6">Invite Members</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="colleague@email.com"
                                        className="w-full p-3 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Role</label>
                                    <select className="w-full p-3 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm appearance-none">
                                        <option>Member</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                                <button className="w-full py-3 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                    Send Invite
                                </button>
                            </div>

                            {/* Pending invites */}
                            <div className="mt-6 border-t border-outline-variant/30 pt-4">
                                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Pending Invites</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">alex.rivera@foundry.cc</p>
                                        <p className="text-xs text-on-surface-variant">Invited 2 days ago</p>
                                    </div>
                                    <button className="text-xs text-error hover:underline font-medium">Revoke</button>
                                </div>
                            </div>
                        </section>

                        {/* Danger zone */}
                        <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-2 border-error/10">
                            <h3 className="text-xl font-semibold text-error mb-2">Danger Zone</h3>
                            <p className="text-sm text-on-surface-variant mb-4">These actions are destructive and cannot be undone.</p>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-all">
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-on-surface">Transfer Ownership</p>
                                        <p className="text-xs text-on-surface-variant">Move this team to another user.</p>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-error/20 hover:bg-error-container/30 transition-all">
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-error">Delete Team</p>
                                        <p className="text-xs text-on-surface-variant">Permanently remove all data.</p>
                                    </div>
                                    <span className="material-symbols-outlined text-error">delete</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}