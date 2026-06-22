import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Auth } from '@/types/auth';

interface Props {
    children: ReactNode;
    // active tells the layout which nav item to highlight
    active: 'dashboard' | 'ideas' | 'teams' | 'notifications' | 'profile';
}

interface SharedProps {
    auth: Auth;
    name: string;
    [key: string]: unknown;
}

// Nav items defined once, reused in both desktop sidebar and mobile menu
const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { key: 'ideas', label: 'My Ideas', icon: 'lightbulb', href: '/ideas' },
    { key: 'teams', label: 'My Teams', icon: 'group', href: '/teams' },
    { key: 'notifications', label: 'Notifications', icon: 'notifications', href: '/notifications' },
    { key: 'profile', label: 'Profile', icon: 'person', href: '/profile' },
] as const;

export default function AppLayout({ children, active }: Props) {
    const { auth } = usePage<SharedProps>().props;

    // controls mobile sidebar open/close
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background">

            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 z-50
                bg-background border-r border-outline-variant
                flex flex-col py-6
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="px-6 mb-8 flex justify-between">
                    <div className="">
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-primary">IdeaForge</h1>
                            <p className="text-xs text-on-surface-variant mt-0.5">Build the future</p>
                        </Link>
                    </div>
                    <button
                        className="text-on-surface-variant p-1"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                        <span className="material-symbols-outlined">
                            {sidebarOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = active === item.key;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3
                                    font-medium text-sm transition-colors duration-150
                                    ${isActive
                                        ? 'bg-surface-container text-primary border-l-4 border-primary'
                                        : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
                                    }
                                `}
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* New idea button */}
                <div className="px-4 mt-auto">
                    <Link
                        href="/ideas/create"
                        className="w-full py-3 bg-primary-container text-on-primary-container
                            font-semibold text-sm rounded-lg flex items-center justify-center
                            gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Idea
                    </Link>
                </div>
            </aside>

            {/* ── Top bar ── */}
            <header
                className={`
                    fixed top-0 right-0 h-16 z-40
                    bg-background/80 backdrop-blur-md
                    border-b border-outline-variant
                    flex items-center justify-between px-6
                    transition-all duration-300
                    ${sidebarOpen
                        ? 'lg:w-[calc(100%-16rem)]'
                        : 'w-full'}
                `}
            >

                {/* Hamburger — mobile only */}
                <button
                    className="lg:hidden text-on-surface-variant p-1"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <span className="material-symbols-outlined">
                        {sidebarOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* Search */}
                <div className="relative flex-1 max-w-sm hidden sm:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2
                        -translate-y-1/2 text-on-surface-variant text-[20px]">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search ideas, teams..."
                        className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg
                            text-sm border-none outline-none focus:ring-2
                            focus:ring-primary-container placeholder:text-on-surface-variant/60"
                    />
                </div>

                {/* Right side — notifications + avatar */}
                <div className="flex items-center gap-4 ml-auto">
                    <Link
                        href="/notifications"
                        className="relative text-on-surface-variant hover:bg-surface-container
                            p-2 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {/* Unread dot — we'll make this dynamic later */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                    </Link>

                    <Link href="/profile" className="flex items-center gap-2">
                        {/* Avatar — shows initials if no avatar uploaded */}
                        <div className="w-9 h-9 rounded-full bg-primary-container
                            flex items-center justify-center text-on-primary-container
                            font-bold text-sm border-2 border-primary-container overflow-hidden">
                            {auth.user.avatar
                                ? <img src={auth.user.avatar} alt={auth.user.name}
                                    className="w-full h-full object-cover" />
                                : auth.user.name.charAt(0).toUpperCase()
                            }
                        </div>
                        <span className="hidden md:block text-sm font-medium text-on-surface">
                            {auth.user.name}
                        </span>
                    </Link>
                </div>
            </header>

            {/* ── Main content ── */}
            {/* lg:ml-64 pushes content right of the fixed sidebar on desktop */}
            {/* pt-16 pushes content below the fixed topbar */}
            <main
                className={`
                    pt-16 min-h-screen
                    transition-all duration-300
                    ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
                `}
            >
                {children}
            </main>
        </div>
    );
}