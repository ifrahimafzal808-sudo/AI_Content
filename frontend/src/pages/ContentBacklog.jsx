import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'

const STATUS_FILTERS = [
    'All',
    'PAVE Scored',
    'Approved for Briefing',
    'Briefed',
    'In Production',
    'Published'
]

export default function ContentBacklog() {
    const [statusFilter, setStatusFilter] = useState('All')
    const { data, loading } = useApi(
        () => api.getBacklog({ status: statusFilter }),
        [statusFilter]
    )

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">📋 Content Backlog</h1>
                <p className="page-subtitle">Manage your content pipeline from ideation to publication</p>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <label className="label" style={{ marginBottom: 0 }}>Filter by Status:</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {STATUS_FILTERS.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
                    <LoadingSpinner text="Loading backlog..." />
                </div>
            ) : !data?.items?.length ? (
                <div className="card empty-state">
                    <p className="empty-state-icon">📭</p>
                    <p className="empty-state-text">No items found</p>
                    <p className="empty-state-subtext">
                        {statusFilter !== 'All'
                            ? `No items with status "${statusFilter}". Try a different filter.`
                            : 'Start by analyzing a keyword to add items to your backlog.'}
                    </p>
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                        Showing {data.items.length} item{data.items.length !== 1 ? 's' : ''}
                    </p>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Brand</th>
                                    <th style={{ textAlign: 'center' }}>P</th>
                                    <th style={{ textAlign: 'center' }}>A</th>
                                    <th style={{ textAlign: 'center' }}>V</th>
                                    <th style={{ textAlign: 'center' }}>E</th>
                                    <th style={{ textAlign: 'center' }}>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 'var(--font-medium)' }}>{item.title}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{item.brand}</td>
                                        <td style={{ textAlign: 'center' }}>{item.pave_scores.P}</td>
                                        <td style={{ textAlign: 'center' }}>{item.pave_scores.A}</td>
                                        <td style={{ textAlign: 'center' }}>{item.pave_scores.V}</td>
                                        <td style={{ textAlign: 'center' }}>{item.pave_scores.E}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 'var(--font-bold)', color: item.total_score >= 18 ? 'var(--color-success)' : 'var(--text-primary)' }}>
                                            {item.total_score}
                                        </td>
                                        <td><StatusBadge status={item.status} /></td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap' }}>
                                            {item.created_date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}
