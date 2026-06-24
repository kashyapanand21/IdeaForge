import { Head, useForm, router, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AppLayout from '@/layouts/AppLayout';
import type { Auth } from '@/types/auth';
import type { Team, TeamInvite, TeamMember } from '@/types/models';

interface Props {
    team: Team & {
        members: TeamMember[]
    }
    invites: TeamInvite[]
}

interface SharedProps {
    auth: Auth
    [key: string]: unknown
}

export default function TeamSettings({ team, invites }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const isOwner = team.owner_id === auth.user.id;

    const teamForm = useForm({
        name: team.name,
        description: team.description ?? '',
    });

    const inviteForm = useForm({
        email: '',
        role: 'member' as 'admin' | 'member',
    });

    const submitTeam: FormEventHandler = (e) => {
        e.preventDefault();
        teamForm.patch(route('teams.update', team.id));
    };

    const submitInvite: FormEventHandler = (e) => {
        e.preventDefault();
        inviteForm.post(route('teams.invites.store', team.id), {
            onSuccess: () => inviteForm.reset(),
        });
    };

    const removeMember = (userId: number) => {
        if (confirm('Remove this member from the team?')) {
            router.delete(route('teams.members.destroy', { team: team.id, user: userId }));
        }
    };

    const revokeInvite = (inviteId: number) => {
        router.delete(route('teams.invites.destroy', { team: team.id, invite: inviteId }));
    };

    const deleteTeam = () => {
        if (confirm('This will permanently delete the team and all its data. Are you sure?')) {
            router.delete(route('teams.destroy', team.id));
        }
    };

    return (
        <AppLayout active="teams">
            <Head title={`${team.name} Settings | IdeaForge`} />
            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <p className="text-sm text-on-surface-variant mb-1">
                        <a href={route('teams.index')} className="hover:text-primary">Teams</a>
                        {' / '}
                        <a href={route('teams.show', team.id)} className="hover:text-primary">{team.name}</a>
                        {' / Settings'}
                    </p>
                    <h1 className="text-3xl font-bold text-on-surface">Team Settings</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">

                        {/* Team profile */}
                        <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Team Profile</h2>
                            <form onSubmit={submitTeam} className="space-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-on-surface-variant">Team Name</label>
                                    <input
                                        type="text"
                                        value={teamForm.data.name}
                                        onChange={(e) => teamForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-white text-on-surface outline-none focus:ring-2 focus:ring-primary-container focus:border-primary"
                                    />
                                    {teamForm.errors.name && (
                                        <p className="text-xs text-error">{teamForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-on-surface-variant">Description</label>
                                    <textarea
                                        rows={3}
                                        value={teamForm.data.description}
                                        onChange={(e) => teamForm.setData('description', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-white text-on-surface outline-none focus:ring-2 focus:ring-primary-container focus:border-primary resize-none"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={teamForm.processing}
                                        className="px-6 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-60"
                                    >
                                        {teamForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Members */}
                        <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">
                                Members
                                <span className="ml-2 text-sm font-normal text-on-surface-variant">
                                    {team.members.length} total
                                </span>
                            </h2>
                            <div className="space-y-3">
                                {team.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 border border-outline-variant/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm text-on-surface-variant">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-on-surface">{member.name}</p>
                                                <p className="text-xs text-on-surface-variant">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold uppercase text-outline">
                                                {member.pivot.role}
                                            </span>
                                            {member.pivot.role !== 'owner' && (
                                                <button
                                                    onClick={() => removeMember(member.id)}
                                                    className="text-on-surface-variant hover:text-error transition-colors p-1"
                                                >
                                                    <span className="material-symbols-outlined text-xl">person_remove</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-6">

                        {/* Invite form */}
                        <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm">
                            <h3 className="text-lg font-semibold mb-5">Invite Member</h3>
                            <form onSubmit={submitInvite} className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-on-surface-variant">Email</label>
                                    <input
                                        type="email"
                                        placeholder="colleague@example.com"
                                        value={inviteForm.data.email}
                                        onChange={(e) => inviteForm.setData('email', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white text-on-surface outline-none focus:ring-2 focus:ring-primary-container focus:border-primary text-sm placeholder:text-outline-variant"
                                        required
                                    />
                                    {inviteForm.errors.email && (
                                        <p className="text-xs text-error">{inviteForm.errors.email}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-on-surface-variant">Role</label>
                                    <select
                                        value={inviteForm.data.role}
                                        onChange={(e) => inviteForm.setData('role', e.target.value as 'admin' | 'member')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white text-on-surface outline-none focus:ring-2 focus:ring-primary-container text-sm"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={inviteForm.processing}
                                    className="w-full py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">send</span>
                                    {inviteForm.processing ? 'Sending...' : 'Send Invite'}
                                </button>
                            </form>

                            {invites.length > 0 && (
                                <div className="mt-6 pt-5 border-t border-outline-variant/30">
                                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                                        Pending Invites
                                    </h4>
                                    <div className="space-y-3">
                                        {invites.map((invite) => (
                                            <div key={invite.id} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-on-surface">{invite.email}</p>
                                                    <p className="text-xs text-on-surface-variant capitalize">{invite.role}</p>
                                                </div>
                                                <button
                                                    onClick={() => revokeInvite(invite.id)}
                                                    className="text-xs text-error hover:underline font-medium"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Danger zone */}
                        {isOwner && (
                            <section className="bg-surface-container-lowest rounded-xl p-6 border-2 border-error/20 shadow-sm">
                                <h3 className="text-lg font-semibold text-error mb-2">Danger Zone</h3>
                                <p className="text-sm text-on-surface-variant mb-4">
                                    These actions cannot be undone.
                                </p>
                                <button
                                    onClick={deleteTeam}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-error/20 hover:bg-error-container/30 transition-all"
                                >
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-error">Delete Team</p>
                                        <p className="text-xs text-on-surface-variant">Permanently remove all data.</p>
                                    </div>
                                    <span className="material-symbols-outlined text-error">delete</span>
                                </button>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}