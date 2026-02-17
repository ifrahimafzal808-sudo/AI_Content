import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="landing-hero">
            {/* Header */}
            <header className="landing-header">
                <div className="navbar-brand">
                    <div className="navbar-logo">AI</div>
                    <span className="navbar-title">Content Copilot</span>
                </div>
                <Link to="/dashboard" className="btn btn-primary">
                    🚀 Go to Dashboard
                </Link>
            </header>

            {/* Hero Content */}
            <div className="landing-content">
                <h1 className="landing-title animate-fade-in">
                    AI-Powered Content
                    <br />
                    <span className="text-gradient">Strategy Platform</span>
                </h1>
                <p className="landing-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Analyze keywords, generate PAVE scores, create authority briefs,
                    and produce high-quality investigative content — all powered by AI.
                </p>
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                        🚀 Go to Dashboard
                    </Link>
                </div>

                {/* Feature Cards */}
                <div className="landing-features stagger-children">
                    <div className="feature-card">
                        <div className="feature-icon purple">📊</div>
                        <h3 className="feature-title">PAVE Scoring</h3>
                        <p className="feature-description">
                            AI-powered keyword analysis with Profitability, Authority,
                            Volume, and Effort scores for data-driven decisions.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon cyan">📝</div>
                        <h3 className="feature-title">Authority Briefs</h3>
                        <p className="feature-description">
                            Generate comprehensive content briefs tailored to your brand
                            voice, audience, and competitive landscape.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon amber">⚡</div>
                        <h3 className="feature-title">Content Production</h3>
                        <p className="feature-description">
                            Produce complete HTML articles with cover images, audited
                            sources, and brand-compliant formatting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
