import { NavLink } from 'react-router-dom'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Analyze Keyword', href: '/analyze', icon: '🔍' },
    { name: 'Content Backlog', href: '/backlog', icon: '📋' },
    { name: 'Create Brief', href: '/brief', icon: '📝' },
    { name: 'Produce Content', href: '/produce', icon: '⚡' },
    { name: 'In Production', href: '/published', icon: '🚀' }
]

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <p className="sidebar-section-title">Navigation</p>
            <nav className="sidebar-nav">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
