export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <div className="navbar-logo">AI</div>
                <span className="navbar-title">Content Copilot</span>
            </div>
            <div className="navbar-user">
                <p className="navbar-user-name">Test User</p>
                <p className="navbar-user-email">test@example.com</p>
            </div>
        </nav>
    )
}
