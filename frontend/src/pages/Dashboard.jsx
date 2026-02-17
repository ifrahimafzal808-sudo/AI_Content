export default function Dashboard() {
    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    Welcome back, Test User! 👋
                </h1>
                <p className="page-subtitle">Here's your content production overview</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid stagger-children">
                <div className="stat-card">
                    <p className="stat-label">Ideas Analyzed</p>
                    <p className="stat-value">24</p>
                    <p className="stat-change positive">↑ 12% from last week</p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">Approved for Briefing</p>
                    <p className="stat-value">8</p>
                    <p className="stat-change neutral">3 pending review</p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">In Production</p>
                    <p className="stat-value">5</p>
                    <p className="stat-change positive">2 ready to publish</p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">Published</p>
                    <p className="stat-value">42</p>
                    <p className="stat-change positive">This month</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <ActivityItem
                        icon="🔍"
                        text='Analyzed keyword "best vitamin D supplements"'
                        time="2 hours ago"
                        type="analyze"
                    />
                    <ActivityItem
                        icon="✅"
                        text='"magnesium glycinate benefits" approved for briefing'
                        time="4 hours ago"
                        type="approve"
                    />
                    <ActivityItem
                        icon="📝"
                        text='Brief generated for "omega 3 fish oil vs krill oil"'
                        time="Yesterday"
                        type="brief"
                    />
                    <ActivityItem
                        icon="🚀"
                        text='"probiotics for digestive health" published'
                        time="2 days ago"
                        type="publish"
                    />
                </div>
            </div>
        </div>
    )
}

function ActivityItem({ icon, text, time }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)'
        }}>
            <span style={{ fontSize: 'var(--font-size-xl)' }}>{icon}</span>
            <span style={{ flex: 1, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {text}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {time}
            </span>
        </div>
    )
}
