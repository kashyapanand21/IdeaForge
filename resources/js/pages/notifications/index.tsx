import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

interface Notification {
    id: number;
    name: string;
    action: string;
    type: string;
    time: string;
    unread: boolean;
    tag?: string;
    tagColor?: string;
}

const initialNotifications: Notification[] = [
    { id: 1, name: 'Sarah Chen', action: 'invited you to join the Eco-Track Dashboard team.', type: 'Team Invitation', time: '2 mins ago', unread: true },
    { id: 2, name: 'Marcus Holloway', action: 'commented on your idea "Decentralized Energy Grids".', type: 'New Comment', time: '15 mins ago', unread: true },
    { id: 3, name: 'Lena Volkov', action: 'validated the Carbon Capture Prototype.', type: 'Idea Validated', time: '3 hours ago', unread: false, tag: 'Validated', tagColor: 'bg-secondary-container text-on-secondary-container' },
    { id: 4, name: 'System', action: 'Your idea "Hyperlocal Groceries" has reached 50 upvotes!', type: 'Milestone', time: '6 hours ago', unread: false },
    { id: 5, name: 'Aria Smith', action: 'updated the roadmap for Project Aurora.', type: 'Roadmap Update', time: '8 hours ago', unread: false },
];

const typeIcon: Record<string, string> = {
    'Team Invitation': 'group',
    'New Comment': 'chat_bubble',
    'Idea Validated': 'verified',
    'Milestone': 'rocket_launch',
    'Roadmap Update': 'edit_calendar',
};

export default function NotificationsIndex() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [allRead, setAllRead] = useState(false);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        setAllRead(true);
    };

    const recent = notifications.slice(0, 2);
    const earlier = notifications.slice(2);

    return (
        <AppLayout active="notifications">
            <Head title="Notifications | IdeaForge" />
            <div className="max-w-3xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-on-surface">Notifications</h1>
                        <p className="text-on-surface-variant mt-1">Stay updated with your active ideas and team movements.</p>
                    </div>
                    <button
                        onClick={markAllRead}
                        disabled={allRead}
                        className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant text-sm font-medium rounded-lg hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-lg">{allRead ? 'check_circle' : 'done_all'}</span>
                        {allRead ? 'All Read' : 'Mark all as read'}
                    </button>
                </div>

                <div className="space-y-1">

                    {/* Recent */}
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-2 mb-2">Recent</p>
                    {recent.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                    ))}

                    {/* Earlier */}
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-2 pt-6 mb-2">Earlier Today</p>
                    {earlier.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function NotificationItem({ notification: n }: { notification: Notification }) {
    return (
        <div className={`group flex items-start gap-4 p-4 rounded-xl relative transition-all cursor-pointer
            ${n.unread
                ? 'bg-white border border-outline-variant/30 hover:shadow-sm'
                : 'bg-surface-container-lowest/50 border border-transparent hover:bg-surface-container-low'
            }`}>

            {/* Unread dot */}
            {n.unread && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
            )}

            {/* Avatar / icon */}
            <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined">{typeIcon[n.type] ?? 'notifications'}</span>
            </div>

            {/* Content */}
            <div className="flex-1 pr-6">
                <p className="text-sm text-on-surface">
                    <span className="font-semibold text-primary">{n.name}</span>{' '}
                    {n.action}
                </p>
                <div className="flex items-center gap-2 mt-1 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-sm">{typeIcon[n.type] ?? 'notifications'}</span>
                    <span>{n.type}</span>
                    <span>•</span>
                    <span>{n.time}</span>
                </div>
            </div>

            {/* Optional tag */}
            {n.tag && (
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight self-center shrink-0 ${n.tagColor}`}>
                    {n.tag}
                </div>
            )}
        </div>
    );
}