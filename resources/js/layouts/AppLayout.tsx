import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Auth } from '@/types/auth';

interface Props {
    children: ReactNode;
    active: 'dashboard' | 'ideas' | 'teams' | 'notifications' | 'profile';
}

interface SharedProps {
    auth: Auth;
    name: string;
    flash: { status: string | null };
    [key: string]: unknown;
}

const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { key: 'ideas', label: 'My Ideas', icon: 'lightbulb', href: '/ideas' },
    { key: 'teams', label: 'My Teams', icon: 'group', href: '/teams' },
    { key: 'notifications', label: 'Notifications', icon: 'notifications', href: '/notifications' },
    { key: 'profile', label: 'Profile', icon: 'person', href: '/profile' },
] as const;

export default function AppLayout({ children, active }: Props) {
    const { auth, flash } = usePage<SharedProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background">

            {/* ── Mobile overlay — closes sidebar when clicking outside ── */}
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
                <div className="px-6 mb-8">
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-primary">IdeaForge</h1>
                        <p className="text-xs text-on-surface-variant mt-0.5">Build the future</p>
                    </Link>
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
            <header className={`
                fixed top-0 right-0 h-16 z-40
                bg-background/80 backdrop-blur-md
                border-b border-outline-variant
                flex items-center gap-4 px-6
                transition-all duration-300
                ${sidebarOpen ? 'lg:left-64' : 'left-0'}
            `}>

                {/* Hamburger — works on ALL screen sizes, toggles sidebar open/closed */}
                <button
                    className="text-on-surface-variant hover:bg-surface-container p-2 rounded-lg transition-colors shrink-0"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <span className="material-symbols-outlined">
                        {sidebarOpen ? 'menu_open' : 'menu'}
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

                {/* Right side — notifications + avatar + logout */}
                <div className="flex items-center gap-3 ml-auto">
                    <Link
                        href="/notifications"
                        className="relative text-on-surface-variant hover:bg-surface-container
                            p-2 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                    </Link>

                    <Link href="/profile" className="flex items-center gap-2">
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

                    {/* Logout */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="text-on-surface-variant hover:bg-surface-container
                            p-2 rounded-full transition-colors"
                        aria-label="Log out"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </header>

            {/* ── Flash message ── */}
            {flash.status && (
                <div className="fixed top-20 right-6 z-50 bg-secondary-container
                    text-on-secondary-container px-4 py-3 rounded-lg shadow-md text-sm font-medium
                    animate-in fade-in slide-in-from-top-2">
                    {flash.status}
                </div>
            )}

            {/* ── Main content ── */}
            <main className={`
                pt-16 min-h-screen transition-all duration-300
                ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}
            `}>
                {children}
            </main>
        </div>
    );
}