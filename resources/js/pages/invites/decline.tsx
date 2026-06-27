import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import type { TeamInvite } from '@/types/models';

interface Props {
    invite: TeamInvite & {
        team: { id: number; name: string }
    }
    token: string
}

export default function InviteDecline({ invite, token }: Props) {
    const { post, processing } = useForm({});

    const decline: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('invites.decline', token));
    };

    return (
        <>
            <Head title="Decline Invitation | IdeaForge" />
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ backgroundColor: '#fcf9f5' }}>
                <main className="w-full max-w-md">
                    <div className="bg-white rounded-xl p-8 border border-outline-variant/30 shadow-sm">
                        <h2 className="text-2xl font-semibold text-on-surface mb-2">
                            Decline invitation
                        </h2>
                        <p className="text-on-surface-variant mb-6">
                            Are you sure you want to decline the invitation to join{' '}
                            <span className="font-semibold text-primary">{invite.team.name}</span>?
                        </p>

                        <form onSubmit={decline}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-error text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-60 mb-3"
                            >
                                {processing ? 'Declining...' : 'Decline Invitation'}
                            </button>
                        </form>

                        <a
                            href={route('invites.confirm', token)}
                            className="block text-center text-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                            Go back
                        </a>
                    </div>
                </main>
            </div>
        </>
    );
}