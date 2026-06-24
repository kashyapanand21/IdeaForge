import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import type { Auth } from '@/types/auth';
import type { Idea, Team, TeamMember } from '@/types/models';
interface Props {
    team: Team & {
        members: TeamMember[]
        ideas: Idea[]
    }
}

interface SharedProps {
    auth: Auth
    [key: string]: unknown
}

const statusColors: Record<string, string> = {
    raw: 'bg-outline/10 text-outline',
    in_discussion: 'bg-primary-container/20 text-primary',
    validated: 'bg-secondary-container/20 text-secondary',
    shelved: 'bg-error-container/20 text-error',
}

const statusLabels: Record<string, string> = {
    raw: 'Raw',
    in_discussion: 'In Discussion',
    validated: 'Validated',
    shelved: 'Shelved',
}

export default function TeamShow({ team }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const currentUserRole = team.members.find(m => m.id === auth.user.id)?.pivot.role;
    const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';
    const isOwner = currentUserRole === 'owner';

    const handleLeave = () => {
        if (confirm('Are you sure you want to leave this team?')) {
            router.delete(route('teams.leave', team.id));
        }
    };

    return (
        <AppLayout active="teams">
            <Head title={`${team.name} | IdeaForge`} />
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-3xl shrink-0">
                            {team.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-on-surface">{team.name}</h1>
                            {team.description && (
                                <p className="text-on-surface-variant mt-1">{team.description}</p>
                            )}
                            <p className="text-sm text-outline mt-1">
                                {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {!isOwner && (
                            <button
                                onClick={handleLeave}
                                className="px-4 py-2 border border-error/30 text-error text-sm font-medium rounded-lg hover:bg-error-container/20 transition-colors"
                            >
                                Leave team
                            </button>
                        )}
                        {canManage && (
                            <Link
                                href={route('teams.edit', team.id)}
                                className="px-4 py-2 border border-outline text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">settings</span>
                                Settings
                            </Link>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Ideas */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-semibold text-on-surface">Ideas</h2>
                            <Link
                                href={route('ideas.create')}
                                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-base">add</span>
                                New idea
                            </Link>
                        </div>

                        {team.ideas.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-outline-variant rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-outline-variant">lightbulb</span>
                                <p className="mt-3 text-on-surface-variant text-sm">No ideas shared to this team yet.</p>
                            </div>
                        ) : (
                            team.ideas.map((idea) => (
                                <Link
                                    key={idea.id}
                                    href={route('ideas.show', idea.id)}
                                    className="block bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {idea.is_pinned && (
                                                    <span className="material-symbols-outlined text-primary text-sm">push_pin</span>
                                                )}
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${statusColors[idea.status]}`}>
                                                    {statusLabels[idea.status]}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-on-surface">{idea.title}</h3>
                                            <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{idea.problem}</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5 text-on-surface-variant shrink-0">
                                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                            <span className="text-xs">{idea.comments_count}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Members sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-on-surface mb-4">Members</h3>
                            <div className="space-y-3">
                                {team.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm text-on-surface-variant">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-on-surface">{member.name}</p>
                                                <p className="text-xs text-on-surface-variant">{member.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold uppercase text-outline">
                                            {member.pivot.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}