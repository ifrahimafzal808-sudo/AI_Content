import { useState } from 'react'

export default function PAVEScoreCard({ scores, searchSummary, onSave }) {
    const [editedScores, setEditedScores] = useState({
        P: scores.profitability_score,
        A: scores.authority_score,
        V: 0, // User must fill in manually
        E: scores.effort_score
    })

    const totalScore = editedScores.P + editedScores.A + editedScores.V + editedScores.E
    const autoStatus = totalScore >= 18 ? 'Approved for Briefing' : 'PAVE Scored'

    const updateScore = (key, value) => {
        const num = Math.min(5, Math.max(0, Number(value) || 0))
        setEditedScores(prev => ({ ...prev, [key]: num }))
    }

    return (
        <div className="card animate-fade-in">
            <h2 style={{ marginBottom: 'var(--space-6)' }}>PAVE Scores</h2>

            <div className="pave-grid">
                {/* Profitability */}
                <div className="pave-item">
                    <div className="pave-header">
                        <span className="pave-label" style={{ color: 'var(--color-primary-light)' }}>
                            Profitability (P)
                        </span>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editedScores.P}
                            onChange={(e) => updateScore('P', e.target.value)}
                            className="pave-score-input"
                        />
                    </div>
                    <p className="pave-reasoning">{scores.profitability_reasoning}</p>
                </div>

                {/* Authority */}
                <div className="pave-item">
                    <div className="pave-header">
                        <span className="pave-label" style={{ color: 'var(--color-secondary)' }}>
                            Authority (A)
                        </span>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editedScores.A}
                            onChange={(e) => updateScore('A', e.target.value)}
                            className="pave-score-input"
                        />
                    </div>
                    <p className="pave-reasoning">{scores.authority_reasoning}</p>
                </div>

                {/* Volume — Manual Entry */}
                <div className="pave-item manual">
                    <div className="pave-header">
                        <span className="pave-label" style={{ color: 'var(--color-warning)' }}>
                            Volume (V) — Manual ⚠️
                        </span>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editedScores.V || ''}
                            onChange={(e) => updateScore('V', e.target.value)}
                            className="pave-score-input"
                            placeholder="1-5"
                        />
                    </div>
                    <p className="pave-reasoning">Check search volume manually and enter score (1-5)</p>
                </div>

                {/* Effort */}
                <div className="pave-item">
                    <div className="pave-header">
                        <span className="pave-label" style={{ color: 'var(--color-success)' }}>
                            Effort (E)
                        </span>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editedScores.E}
                            onChange={(e) => updateScore('E', e.target.value)}
                            className="pave-score-input"
                        />
                    </div>
                    <p className="pave-reasoning">{scores.effort_reasoning}</p>
                </div>
            </div>

            {/* Total Score */}
            <div className="pave-total">
                <p className="pave-total-label">Total Score</p>
                <p className="pave-total-value text-gradient">{totalScore} / 20</p>
                <div style={{ marginTop: 'var(--space-3)' }}>
                    <span className={`badge ${totalScore >= 18 ? 'badge-success' : 'badge-warning'}`}>
                        {autoStatus}
                    </span>
                </div>
                <button
                    onClick={() => onSave(editedScores)}
                    disabled={editedScores.V === 0}
                    className="btn btn-primary btn-full"
                    style={{ marginTop: 'var(--space-4)' }}
                >
                    💾 Save to Backlog
                </button>
            </div>

            {/* Search Summary */}
            {searchSummary && (
                <div style={{ marginTop: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                        Search Summary
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {searchSummary}
                    </p>
                </div>
            )}
        </div>
    )
}
