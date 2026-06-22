import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

const hackathons = [
  {
    id: 1,
    status: 'Building',
    statusStyle: 'bg-green-100 text-green-800',
    icon: 'cloud_done',
    title: 'Serverless Summit 2024',
    organizer: 'Organized by AWS',
    linkedIdea: 'EcoSync Analytics Engine',
    progress: 75,
    deadline: { label: 'Deadline', value: '2 Days Left', urgent: true },
    actionIcon: 'arrow_forward',
  },
  {
    id: 2,
    status: 'Registered',
    statusStyle: 'bg-orange-100 text-orange-800',
    icon: 'terminal',
    title: 'Code for Climate',
    organizer: 'Organized by UN Global',
    linkedIdea: null,
    progress: 0,
    deadline: { label: 'Starts in', value: '12 Days', urgent: false },
    actionIcon: 'calendar_today',
  },
  {
    id: 3,
    status: 'Interested',
    statusStyle: 'bg-gray-100 text-gray-600',
    icon: 'neurology',
    title: 'AI Agents Workshop',
    organizer: 'Organized by Anthropic',
    description: 'Explore the frontiers of LLM agents and autonomous workflows in this week-long virtual sprint.',
    tags: ['Virtual', '$50k Prize', 'AI/ML'],
    deadline: null,
    actionIcon: null,
  },
  {
    id: 4,
    status: 'Submitted',
    statusStyle: 'bg-blue-100 text-blue-800',
    icon: 'grid_view',
    title: 'Web3 World Builders',
    organizer: 'Organized by Ethereum Foundation',
    submittedProject: 'DeFi Pulse Protocol',
    judgingProgress: 40,
    deadline: { label: 'Results in', value: '4 Days', urgent: false },
    actionIcon: 'trophy',
  },
];

const tabs = ['All', 'Interested', 'Registered', 'Building', 'Submitted'];



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = 
    activeTab === 'All'
      ? hackathons
      : hackathons.filter((h) => h.status === activeTab);

  return (
    <AppLayout active="dashboard">

      <Head title="Dashboard | IdeaForge" />
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* <div className="flex min-h-screen bg-[#fcf9f5] text-on-surface font-sans">

        <main className="ml-64 min-h-screen w-full">

          <div className="pt-32 pb-12 px-10 max-w-[1280px] mx-auto"> */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <h2 className="text-4xl font-bold text-[#1c1c1a] mb-2 tracking-tight">Hackathon Hub</h2>
                <p className="text-lg text-[#554339] max-w-2xl">
                  Track your participation, manage deadlines, and build the future with your favorite developer communities.
                </p>
              </div>
              <button className="bg-[#9a4601] text-white text-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                Add Hackathon
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#f6f3ef] rounded-2xl w-fit mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      activeTab === tab
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-[#554339] hover:bg-[#e5e2de]/20'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {filtered.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} />
                ))}

              <div className="border-2 border-dashed border-[#dcc1b4]/40 rounded-xl flex flex-col items-center justify-center p-8 gap-4 text-center hover:bg-[#f6f3ef]/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-[#ebe8e4] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#9a4601] text-4xl">explore</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#1c1c1a]">Find your next challenge</h4>
                  <p className="text-sm text-[#554339] mt-1">Browse hundreds of active hackathons on the IdeaForge network.</p>
                </div>
                <button className="text-sm font-semibold text-[#9a4601] border-b-2 border-[#9a4601]/20 hover:border-[#9a4601] transition-all">
                  Explore Marketplace
                </button>
              </div>
            </div>
          {/* </div>
        </main> */}

        <button className="fixed bottom-6 right-6 w-16 h-16 bg-[#9a4601] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-50 md:hidden">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
      </AppLayout>
    // </>
  );
}

function HackathonCard({ hackathon }: { hackathon: (typeof hackathons)[0] }) {
    const h = hackathon;
    
    return (
        <div className="bg-white p-6 rounded-xl border border-[#dcc1b4]/30 flex flex-col gap-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-150 group">
      <div className="absolute top-0 right-0 p-4">
        <span className={`${h.statusStyle} text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
          {h.status}
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#ebe8e4] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[#9a4601] text-3xl">{h.icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#1c1c1a] leading-tight">{h.title}</h3>
          <p className="text-sm text-[#554339] opacity-60">{h.organizer}</p>
        </div>
      </div>

      {"linkedIdea" in h && h.linkedIdea && (
          <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#554339] uppercase">
            <span>Linked Idea</span>
            <span className="text-[#9a4601]">View Details</span>
          </div>
          <div className="p-3 bg-[#f6f3ef] rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-[#897367]">psychology</span>
            <span className="text-sm font-medium">{h.linkedIdea}</span>
          </div>
        </div>
      )}

      {"linkedIdea" in h && h.linkedIdea === null && h.status === 'Registered' && (
          <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#554339] uppercase">
            <span>Linked Idea</span>
            <span className="text-[#9a4601]">Assign Idea</span>
          </div>
          <button className="w-full border border-dashed border-[#dcc1b4] p-3 rounded-lg flex items-center justify-center gap-2 text-[#554339] hover:bg-[#f6f3ef] transition-colors">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span className="text-sm">Link an Idea to start building</span>
          </button>
        </div>
      )}

      {"progress" in h && h.status !== 'Submitted' && (
          <div className={`space-y-2 ${"linkedIdea" in h && h.linkedIdea === null ? 'opacity-40' : ''}`}>
          <div className="flex justify-between text-xs font-semibold text-[#554339]">
            <span>Milestone Progress</span>
            <span>{h.progress}%</span>
          </div>
          <div className="w-full bg-[#ebe8e4] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#9a4601] h-full rounded-full transition-all duration-1000"
              style={{ width: `${h.progress}%` }}
              />
          </div>
        </div>
      )}

      {"description" in h && h.description && (
          <div className="space-y-4">
          <p className="text-sm text-[#554339]">{h.description}</p>
          <div className="flex flex-wrap gap-2">
            {h.tags?.map((tag) => (
                <span key={tag} className="bg-[#f6f3ef] px-2 py-1 rounded text-[10px] uppercase font-semibold text-[#897367]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {"submittedProject" in h && h.submittedProject && (
          <>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#554339] uppercase">
              <span>Project Submitted</span>
              <span className="text-green-600 font-bold">Validated</span>
            </div>
            <div className="p-3 bg-[#f6f3ef] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-sm font-medium">{h.submittedProject}</span>
              </div>
              <span className="material-symbols-outlined text-[#554339] text-sm">open_in_new</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#554339]">
              <span>Judging Progress</span>
              <span>Ongoing</span>
            </div>
            <div className="w-full bg-[#ebe8e4] h-2 rounded-full overflow-hidden">
              <div className="bg-[#1e5031] h-full rounded-full" style={{ width: `${h.judgingProgress}%` }} />
            </div>
          </div>
        </>
      )}

      <div className="mt-auto pt-4 border-t border-[#dcc1b4]/20">
        {h.status === 'Interested' ? (
            <div className="flex gap-3">
            <button className="flex-grow py-2 bg-[#e07b39] text-white rounded-lg text-sm font-semibold hover:opacity-90">
              Register Now
            </button>
            <button className="p-2 border border-[#dcc1b4] rounded-lg text-[#554339] hover:bg-[#f6f3ef] transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        ) : (
            <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase opacity-60">
                {h.deadline?.label}
              </span>
              <span className={`text-sm font-bold flex items-center gap-1 ${h.deadline?.urgent ? 'text-red-600' : 'text-on-surface'}`}>
                {h.deadline?.urgent && <span className="material-symbols-outlined text-sm">timer</span>}
                {h.deadline?.value}
              </span>
            </div>
            <button className="p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">{h.actionIcon}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
