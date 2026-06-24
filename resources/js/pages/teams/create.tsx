import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AppLayout from '@/layouts/AppLayout';

export default function TeamCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('teams.store'));
    };

    return (
        <AppLayout active="teams">
            <Head title="Create Team | IdeaForge" />
            <div className="max-w-2xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface">Create a team</h1>
                    <p className="text-on-surface-variant mt-1">
                        Bring people together around your ideas.
                    </p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-semibold text-on-surface-variant">
                                Team Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="e.g. The Vigilantes"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-white text-on-surface outline-none focus:ring-2 focus:ring-primary-container focus:border-primary placeholder:text-outline-variant"
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-error">{errors.name}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="description" className="text-sm font-semibold text-on-surface-variant">
                                Description
                                <span className="font-normal text-outline ml-1">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                placeholder="What is this team working on?"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-white text-on-surface outline-none focus:ring-2 focus:ring-primary-container focus:border-primary resize-none placeholder:text-outline-variant"
                            />
                            {errors.description && (
                                <p className="text-xs text-error">{errors.description}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <a
                                href={route('teams.index')}
                                className="px-5 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                            >
                                {processing ? 'Creating...' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}