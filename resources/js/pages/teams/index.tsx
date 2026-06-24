import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import type { Team } from '@/types/models';

interface Props {
    teams: Team[]
}

export default function TeamsIndex({ teams }: Props) {
    return (
        <AppLayout active="teams">
            <Head title="My Teams | IdeaForge" />
            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-on-surface">My Teams</h1>
                        <p className="text-on-surface-variant mt-1">Teams you own or belong to.</p>
                    </div>
                    <Link
                        href={route('teams.create')}
                        className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                        New Team
                    </Link>
                </div>

                {teams.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-outline-variant rounded-xl">
                        <span className="material-symbols-outlined text-5xl text-outline-variant">group</span>
                        <p className="mt-4 text-on-surface-variant">You are not part of any team yet.</p>
                        <Link href={route('teams.create')} className="mt-4 inline-block text-primary font-semibold hover:underline">
                            Create your first team
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teams.map((team) => (
                            <Link
                                key={team.id}
                                href={route('teams.show', team.id)}
                                className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg shrink-0">
                                        {team.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-on-surface">{team.name}</h2>
                                        {team.description && (
                                            <p className="text-sm text-on-surface-variant line-clamp-1">{team.description}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}