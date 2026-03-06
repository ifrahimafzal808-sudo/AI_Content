import { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [recentItems, setRecentItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadDashboardData()
    }, [])

    async function loadDashboardData() {
        try {
            setLoading(true)
            setError(null)
            const result = await api.getBacklog()
            const items = result.items || []

            // Count items by status
            const counts = {
                total: items.length,
                approved: 0,
                inProduction: 0,
                paveScored: 0,
                briefed: 0
            }

            items.forEach(item => {
                const status = (item.status || '').trim()
                if (status === 'In Production') counts.inProduction++
                else if (status === 'Approved for Briefing') counts.approved++
                else if (status === 'Briefed') counts.briefed++
                else if (status === 'PAVE Scored') counts.paveScored++
            })

            setStats(counts)

            // Recent activity: sort by date (newest first), take top 5
            const sorted = [...items].sort((a, b) => {
                const dateA = a.created_date || ''
                const dateB = b.created_date || ''
                return dateB.localeCompare(dateA)
            })
            setRecentItems(sorted.slice(0, 5))
        } catch (err) {
            console.error('Failed to load dashboard data:', err)
            setError(err.message || 'Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    // Pick an icon/label based on item status
    function getActivityMeta(status) {
        const s = (status || '').trim()
        if (s === 'In Production') return { icon: '🚀', verb: 'In Production' }
        if (s === 'Briefed') return { icon: '📝', verb: 'Brief generated for' }
        if (s === 'Approved for Briefing') return { icon: '✅', verb: 'Approved for briefing' }
        if (s === 'PAVE Scored') return { icon: '🔍', verb: 'Analyzed' }
        return { icon: '📄', verb: status || 'Updated' }
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    Welcome back! 👋
                </h1>
                <p className="page-subtitle">Here's your content production overview</p>
            </div>

            {/* Error state */}
            {error && (
                <div className="card" style={{ borderLeft: '4px solid var(--color-error)', marginBottom: 'var(--space-6)' }}>
                    <p style={{ color: 'var(--color-error)', margin: 0 }}>
                        Couldn't load dashboard data: {error}
                    </p>
                    <button
                        className="btn btn-secondary"
                        style={{ marginTop: 'var(--space-3)' }}
                        onClick={loadDashboardData}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid stagger-children">
                <div className="stat-card">
                    <p className="stat-label">Ideas Analyzed</p>
                    <p className="stat-value">{loading ? '...' : (stats?.total ?? 0)}</p>
                    <p className="stat-change neutral">Total in pipeline</p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">Approved for Briefing</p>
                    <p className="stat-value">{loading ? '...' : (stats?.approved ?? 0)}</p>
                    <p className="stat-change neutral">{loading ? '' : `${stats?.paveScored ?? 0} still in PAVE scoring`}</p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">Briefed</p>
                    <p className="stat-value">{loading ? '...' : (stats?.briefed ?? 0)}</p>
                    <p className="stat-change neutral">Ready for production</p>
                </div>

                <div className="stat-card">
                    <p className="stat-label">In Production</p>
                    <p className="stat-value">{loading ? '...' : (stats?.inProduction ?? 0)}</p>
                    <p className="stat-change positive">Total in production</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
                            Loading activity...
                        </p>
                    ) : recentItems.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
                            No activity yet. Start by analyzing a keyword!
                        </p>
                    ) : (
                        recentItems.map((item, idx) => {
                            const meta = getActivityMeta(item.status)
                            return (
                                <ActivityItem
                                    key={item.id || idx}
                                    icon={meta.icon}
                                    text={`${meta.verb}: "${item.title || 'Untitled'}"`}
                                    time={item.created_date || ''}
                                    brand={item.brand || ''}
                                />
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

function ActivityItem({ icon, text, time, brand }) {
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
            {brand && (
                <span style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-primary)',
                    background: 'var(--bg-tertiary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                }}>
                    {brand}
                </span>
            )}
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {time}
            </span>
        </div>
    )
}
