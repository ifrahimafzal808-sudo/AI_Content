import { useAuth } from '../../hooks/useAuth'

export default function LogoutButton() {
    const { signOut, user } = useAuth()

    return (
        <div className="navbar-user">
            <div className="navbar-user-info">
                <p className="navbar-user-name">{user?.name || 'User'}</p>
                <p className="navbar-user-email">{user?.email || ''}</p>
            </div>
            {user?.picture && (
                <img
                    src={user.picture}
                    alt={user.name}
                    className="navbar-avatar"
                />
            )}
            <button onClick={signOut} className="btn btn-ghost btn-sm">
                Sign Out
            </button>
        </div>
    )
}
