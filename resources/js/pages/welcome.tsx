import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="IdeaForge | Where ideas get built" />
            <div className="bg-background text-on-surface overflow-x-hidden">

                {/* ── Nav ── */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md p-2">
                    <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 md:px-10">
                        <span className="text-4xl font-bold text-primary">IdeaForge</span>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-on-surface-variant hover:text-primary text-xl font-medium transition-colors scroll-smooth">Features</a>
                            <a href="#how-it-works" className="text-on-surface-variant hover:text-primary text-xl font-medium transition-colors scroll-smooth">Process</a>
                            <Link href="/register" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95">
                                Start for free
                            </Link>
                        </div>
                        <Link href="/register" className="md:hidden bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-semibold">
                            Start free
                        </Link>
                    </div>
                </nav>

                <main className="pt-16">

                    {/* ── Hero ── */}
                    <section className="relative overflow-hidden min-h-screen flex items-center">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(224,123,57,0.05),transparent_50%)]" />
                        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 flex flex-col items-center text-center">
                            <h1 className="text-5xl md:text-7xl font-bold text-on-background mb-6 max-w-4xl leading-tight tracking-tight">
                                Where ideas get built
                            </h1>
                            <p className="text-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
                                Most brilliance dies in the gap between a quick note and a finished product. IdeaForge gives you the structure to capture, validate, and execute your best ideas — with your team.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <Link href="/register" className="w-full sm:w-auto bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md active:scale-95">
                                    Start for free
                                </Link>
                                <a href="#how-it-works" className="w-full sm:w-auto border border-outline px-8 py-4 rounded-xl font-semibold text-sm hover:bg-surface-container-low transition-colors text-center">
                                    See how it works
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ── Features ── */}
                    <section className="py-16 bg-surface-container-low" id="features">
                        <div className="max-w-7xl mx-auto px-4 md:px-10">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-on-background mb-4">Tools for the serious builder</h2>
                                <p className="text-on-surface-variant">Precision-engineered features to stop ideas from leaking.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:-translate-y-1 transition-all duration-300">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-4 block">dashboard</span>
                                    <h3 className="text-2xl font-semibold text-on-background mb-2">Structured Ideas</h3>
                                    <p className="text-on-surface-variant mb-6">Move beyond bullet points. Answer four key questions — problem, solution, target user, biggest risk — before your idea is saved.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Problem First', 'Target User', 'Risk Assessment'].map((tag) => (
                                            <span key={tag} className="px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-5 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:-translate-y-1 transition-all duration-300">
                                    <span className="material-symbols-outlined text-secondary text-3xl mb-4 block">how_to_vote</span>
                                    <h3 className="text-2xl font-semibold text-on-background mb-2">Team Voting</h3>
                                    <p className="text-on-surface-variant">Democratic decision making without the noise. Upvote or downvote ideas to surface the best ones.</p>
                                </div>
                                <div className="md:col-span-12 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <span className="material-symbols-outlined text-primary text-3xl mb-4 block">timer</span>
                                        <h3 className="text-2xl font-semibold text-on-background mb-2">Hackathon Tracker</h3>
                                        <p className="text-on-surface-variant mb-4">From interested to submitted. Track milestones, link your idea, and manage your team's entire hackathon in one place.</p>
                                    </div>
                                    <div className="flex-1 w-full bg-surface-container rounded-lg p-4">
                                        <div className="space-y-2">
                                            {['Registered ✓', 'Building...', 'Submit by Sunday'].map((item, i) => (
                                                <div key={i} className={`h-8 rounded flex items-center px-3 text-xs font-medium
                                                    ${i === 1 ? 'bg-primary-container/20 border-l-4 border-primary text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── How it works ── */}
                    <section className="py-16" id="how-it-works">
                        <div className="max-w-7xl mx-auto px-4 md:px-10">
                            <div className="max-w-3xl mb-12">
                                <h2 className="text-3xl font-bold text-on-background mb-4">From raw spark to validated project</h2>
                                <p className="text-on-surface-variant text-lg">A simple, linear workflow that respects the chaotic nature of creativity.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                                <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-outline-variant -z-10" />
                                {[
                                    { step: '1', title: 'Submit', desc: 'Input your raw idea using our structured template. Answer four questions that force clarity.' },
                                    { step: '2', title: 'Share', desc: 'Share it to your team when ready. Keep it private until then — your ideas are yours first.' },
                                    { step: '3', title: 'Validate', desc: 'Team votes and discussion move ideas through the lifecycle: Raw → In Discussion → Validated.' },
                                ].map((item) => (
                                    <div key={item.step} className="flex flex-col group">
                                        <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center mb-6 group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-300">
                                            <span className="text-2xl font-bold">{item.step}</span>
                                        </div>
                                        <h4 className="text-2xl font-semibold text-on-background mb-2">{item.title}</h4>
                                        <p className="text-on-surface-variant">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── CTA ── */}
                    <section className="py-16 px-4">
                        <div className="max-w-7xl mx-auto bg-inverse-surface rounded-2xl p-12 md:p-16 relative overflow-hidden text-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-[120px] opacity-20" />
                            <div className="relative z-10 flex flex-col items-center">
                                <h2 className="text-3xl font-bold text-inverse-on-surface mb-4">Ready to start building?</h2>
                                <p className="text-surface-variant text-lg max-w-xl mb-8">
                                    Stop losing your best ideas. Start validating them with your team.
                                </p>
                                <Link href="/register" className="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all">
                                    Start your first Forge
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* ── Footer ── */}
                <footer className="bg-surface-container-low pt-12 pb-6 border-t border-outline-variant/30">
                    <div className="max-w-7xl mx-auto px-4 md:px-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div>
                                <span className="text-2xl font-bold text-primary mb-4 block">IdeaForge</span>
                                <p className="text-on-surface-variant text-sm">A digital workshop for modern builders. Designed for clarity, focused on execution.</p>
                            </div>
                            {[
                                { title: 'Product', links: ['Features', 'Templates', 'Security'] },
                                { title: 'Resources', links: ['Documentation', 'Idea Frameworks', 'API Status'] },
                                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Privacy'] },
                            ].map((col) => (
                                <div key={col.title}>
                                    <h5 className="font-semibold text-on-background mb-4 text-sm">{col.title}</h5>
                                    <ul className="space-y-3 text-on-surface-variant text-sm">
                                        {col.links.map((link) => (
                                            <li key={link}>
                                                <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-on-surface-variant text-sm">© 2026 IdeaForge. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
