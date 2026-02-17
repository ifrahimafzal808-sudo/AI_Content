export default function StatusBadge({ status }) {
    const styleMap = {
        'PAVE Scored': 'badge-info',
        'Approved for Briefing': 'badge-success',
        'Briefed': 'badge-primary',
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
