import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import type { Idea } from '@/types/models';

interface Props {
    privateIdeas: Idea[]
    sharedIdeas: Idea[]
}

export default function IdeasIndex({ privateIdeas, sharedIdeas }: Props) {
    return (
        <AppLayout active="ideas">
            <Head title="My Ideas | IdeaForge" />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-on-surface mb-8">My Ideas</h1>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-on-surface mb-4">
                        Private
                        <span className="ml-2 text-sm font-normal text-on-surface-variant">
                            {privateIdeas.length}
                        </span>
                    </h2>
                    {privateIdeas.length === 0 ? (
                        <p className="text-on-surface-variant text-sm">No private ideas yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {privateIdeas.map((idea) => (
                                <li key={idea.id} className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
                                    <p className="font-semibold text-on-surface">{idea.title}</p>
                                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{idea.problem}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-on-surface mb-4">
                        Shared
                        <span className="ml-2 text-sm font-normal text-on-surface-variant">
                            {sharedIdeas.length}
                        </span>
                    </h2>
                    {sharedIdeas.length === 0 ? (
                        <p className="text-on-surface-variant text-sm">No shared ideas yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {sharedIdeas.map((idea) => (
                                <li key={idea.id} className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
                                    <p className="font-semibold text-on-surface">{idea.title}</p>
                                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{idea.problem}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}