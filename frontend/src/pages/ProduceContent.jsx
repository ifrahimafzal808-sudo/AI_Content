import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const PRODUCTION_STEPS = [
    { id: 1, label: 'Preparing Context' },
    { id: 2, label: 'Generating HTML Article' },
    { id: 3, label: 'Generating Cover Image' },
    { id: 4, label: 'Assembling Final HTML' },
    { id: 5, label: 'Saving to SharePoint' }
]

export default function ProduceContent() {
    const { data: backlogData, loading: backlogLoading } = useApi(
        () => api.getBacklog({ status: 'Briefed' })
    )
    const [selectedItemId, setSelectedItemId] = useState('')
    const [producing, setProducing] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [result, setResult] = useState(null)

    const handleProduce = async () => {
        if (!selectedItemId) return
        setProducing(true)
        setResult(null)

        // Simulate step progress
        for (let i = 1; i <= 5; i++) {
            setCurrentStep(i)
            await new Promise(r => setTimeout(r, 1000))
        }

        try {
            const data = await api.produceContent(selectedItemId)
            setResult(data)
        } catch (err) {
            alert('Production failed: ' + err.message)
        } finally {
            setProducing(false)
            setCurrentStep(0)
        }
    }

    if (backlogLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}>
                <LoadingSpinner text="Loading briefed items..." />
            </div>
        )
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <div className="page-header">
                <h1 className="page-title">⚡ Produce Content</h1>
                <p className="page-subtitle">
                    Generate full HTML articles with AI — including cover images
                </p>
            </div>

            {/* Select Briefed Item */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Select Briefed Item</h3>
                <div className="form-group">
                    <select
                        value={selectedItemId}
                        onChange={(e) => { setSelectedItemId(e.target.value); setResult(null); }}
                        className="select"
                        disabled={producing}
                    >
                        <option value="">-- Select an item to produce --</option>
                        {backlogData?.items?.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title} ({item.brand})
                            </option>
                        ))}
                    </select>
                </div>

                {!backlogData?.items?.length && (
                    <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                        <p className="empty-state-icon">📝</p>
                        <p className="empty-state-text">No briefed items available</p>
                        <p className="empty-state-subtext">
                            Create a brief first, then come back here to produce content.
                        </p>
                    </div>
                )}

                {selectedItemId && !producing && (
                    <button
                        onClick={handleProduce}
                        className="btn btn-primary btn-lg btn-full"
                    >
                        🚀 Start Content Production
                    </button>
                )}
            </div>

            {/* Production Progress */}
            {producing && (
                <div className="card animate-fade-in">
                    <h3 style={{ marginBottom: 'var(--space-6)' }}>Production in Progress...</h3>
                    <div className="progress-steps" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        {PRODUCTION_STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`progress-step ${currentStep > step.id ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: currentStep === step.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                                }}
                            >
                                <div className="progress-step-circle">
                                    {currentStep > step.id ? '✓' : step.id}
                                </div>
                                <span className="progress-step-label" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    {step.label}
                                </span>
                                {currentStep === step.id && (
                                    <span className="spinner sm" style={{ marginLeft: 'auto' }}></span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Production Result */}
            {result && (
                <div className="card animate-fade-in" style={{ borderColor: 'var(--color-success)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</p>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Content Produced Successfully!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                            Generation time: {result.generation_time}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            <a
                                href={result.asset_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                📄 View Article
                            </a>
                            <button className="btn btn-secondary">
                                🚀 Publish Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
