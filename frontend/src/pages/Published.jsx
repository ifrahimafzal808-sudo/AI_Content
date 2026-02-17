import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Published() {
    const { data, loading } = useApi(() => api.getBacklog({ status: 'Published' }))

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}>
                <LoadingSpinner text="Loading published content..." />
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">🚀 Published Content</h1>
                <p className="page-subtitle">
                    Browse all your published articles — {data?.items?.length || 0} articles total
                </p>
            </div>

            {!data?.items?.length ? (
                <div className="card empty-state">
                    <p className="empty-state-icon">📰</p>
                    <p className="empty-state-text">No published content yet</p>
                    <p className="empty-state-subtext">
                        Produce and publish content to see it appear here.
                    </p>
                </div>
            ) : (
                <div className="gallery-grid stagger-children">
                    {data.items.map(item => (
                        <div key={item.id} className="gallery-card">
                            <div className="gallery-card-image">
                                📄
                            </div>
                            <div className="gallery-card-body">
                                <h3 className="gallery-card-title">{item.title}</h3>
                                <div className="gallery-card-meta">
                                    <span>{item.brand}</span>
                                    <span>{item.created_date}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                                    <span className="badge badge-success">Published</span>
                                    <span className="badge badge-primary">Score: {item.total_score}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
