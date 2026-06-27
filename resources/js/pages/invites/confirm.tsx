import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import type { TeamInvite } from '@/types/models';

interface Props {
    invite: TeamInvite & {
        team: { id: number; name: string }
    }
    token: string
}

export default function InviteConfirm({ invite, token }: Props) {
    const { post, processing } = useForm({});

    const accept: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('invites.accept', token));
    };

    return (
        <>
            <Head title="Team Invitation | IdeaForge" />
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ backgroundColor: '#fcf9f5' }}>
                <main className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-container/20 mb-4">
                            <span className="material-symbols-outlined text-primary text-4xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}>
                                group_add
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-on-surface">IdeaForge</h1>
                    </div>

                    <div className="bg-white rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                        <h2 className="text-2xl font-semibold text-on-surface mb-2">
                            You've been invited
                        </h2>
                        <p className="text-on-surface-variant mb-6">
                            You've been invited to join{' '}
                            <span className="font-semibold text-primary">{invite.team.name}</span>{' '}
                            as a <span className="font-semibold capitalize">{invite.role}</span>.
                        </p>

                        <form onSubmit={accept}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-on-primary font-semibold py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 mb-3"
                            >
                                {processing ? 'Joining...' : 'Accept Invitation'}
                            </button>
                        </form>

                        <a
                            href={route('invites.decline-page', token)}
                            className="block text-center text-sm text-on-surface-variant hover:text-error transition-colors"
                        >
                            Decline invitation
                        </a>
                    </div>
                </main>
            </div>
        </>
    );
}