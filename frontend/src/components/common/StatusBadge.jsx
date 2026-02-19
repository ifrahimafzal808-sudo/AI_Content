export default function StatusBadge({ status }) {
    const styleMap = {
        'Backlog': 'badge-info',
        'Raw Idea': 'badge-ghost',
        'PAVE Scored': 'badge-info',
        'Approved for Briefing': 'badge-success',
        'Briefed': 'badge-primary',
        'In-Progress': 'badge-warning',
        'In Production': 'badge-warning',
        'Published': 'badge-success',
        'Error': 'badge-error'
    }

    const badgeClass = styleMap[status] || 'badge-info'

    return (
        <span className={`badge ${badgeClass}`}>
            {status}
        </span>
    )
}
