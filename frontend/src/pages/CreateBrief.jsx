import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function CreateBrief() {
    const { data: backlogData, loading: backlogLoading } = useApi(
        () => api.getBacklog({ status: 'Approved for Briefing' })
    )
    const [selectedItemId, setSelectedItemId] = useState('')
    const [differentiator, setDifferentiator] = useState('')
    const [smeInput, setSmeInput] = useState('')
    const [format, setFormat] = useState(null)
    const [recommendLoading, setRecommendLoading] = useState(false)
    const [generatingBrief, setGeneratingBrief] = useState(false)
    const [briefResult, setBriefResult] = useState(null)
    const [savingBrief, setSavingBrief] = useState(false)
    const [savedSuccess, setSavedSuccess] = useState(false)

    const handleRecommend = async () => {
        if (!selectedItemId) return
        setRecommendLoading(true)
        try {
            const result = await api.recommendFormat({ item_id: selectedItemId })
            setFormat(result)
        } catch (err) {
            alert('Recommendation failed: ' + err.message)
        } finally {
            setRecommendLoading(false)
        }
    }

    const handleGenerate = async () => {
        if (!selectedItemId) return
        setGeneratingBrief(true)
        setSavedSuccess(false)
        setBriefResult(null)
        try {
            // 1. Fetch Item Details (for keyword, brand name, search summary)
            const itemDetails = await api.getContentDetails(selectedItemId)

            // 2. Fetch Brand Details (for persona, tone)
            const brandDetails = await api.getBrandDetails(itemDetails.brand)

            // 3. Generate Brief via AI
            const result = await api.generateAuthorityBrief({
                keyword: itemDetails.title,
                brand: itemDetails.brand,
                persona: brandDetails.persona || 'Professional', // Fallback
                tone: brandDetails.tone || 'Helpful', // Fallback
                format: format?.format || 'In-Depth Guide',
                search_summary: itemDetails.search_summary,
                differentiator,
                sme_input: smeInput
            })

            // 4. Show result for approval
            setBriefResult(result)
        } catch (err) {
            alert('Brief generation failed: ' + err.message)
        } finally {
            setGeneratingBrief(false)
        }
    }

    const handleSaveBrief = async () => {
        if (!selectedItemId || !briefResult) return
        setSavingBrief(true)
        try {
            await api.updateBriefStatus({
                item_id: selectedItemId,
                brief_text: briefResult.brief_text
            })
            setSavedSuccess(true)
        } catch (err) {
            alert('Failed to save brief: ' + err.message)
        } finally {
            setSavingBrief(false)
        }
    }

    if (backlogLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}>
                <LoadingSpinner text="Loading approved items..." />
            </div>
        )
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <div className="page-header">
                <h1 className="page-title">📝 Create Brief</h1>
                <p className="page-subtitle">Generate an authority brief for approved content ideas</p>
            </div>

            {/* Step 1: Select Item */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 1: Select Content Idea</h3>
                <div className="form-group">
                    <label className="label">Choose from Approved Items</label>
                    <select
                        value={selectedItemId}
                        onChange={(e) => {
                            setSelectedItemId(e.target.value);
                            setFormat(null);
                            setBriefResult(null);
                            setSavedSuccess(false);
                        }}
                        className="select"
                    >
                        <option value="">-- Select an item --</option>
                        {backlogData?.items?.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title} ({item.brand} — Score: {item.total_score})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedItemId && (
                    <button
                        onClick={handleRecommend}
                        disabled={recommendLoading}
                        className="btn btn-secondary"
                    >
                        {recommendLoading ? 'Getting recommendation...' : '🤖 Get Format Recommendation'}
                    </button>
                )}
            </div>

            {/* Step 2: Format Recommendation */}
            {format && (
                <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-6)', borderColor: 'var(--color-primary)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 2: Recommended Format</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                        <span className="badge badge-primary" style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) var(--space-4)' }}>
                            ✨ {format.format}
                        </span>
                        <span className="badge badge-info" style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) var(--space-4)' }}>
                            Alternative: {format.alternative}
                        </span>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        {format.reasoning}
                    </p>
                </div>
            )}

            {/* Step 3: Additional Inputs */}
            {format && (
                <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 3: Optional Context</h3>

                    <div className="form-group">
                        <label className="label">Differentiator (What makes your brand unique?)</label>
                        <input
                            type="text"
                            value={differentiator}
                            onChange={(e) => setDifferentiator(e.target.value)}
                            placeholder="e.g., 15 years of clinical research backing our products"
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">SME Input (Expert notes or key points)</label>
                        <textarea
                            value={smeInput}
                            onChange={(e) => setSmeInput(e.target.value)}
                            placeholder="e.g., Our lead scientist recommends focusing on bioavailability studies..."
                            className="input"
                            rows={4}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={generatingBrief}
                        className="btn btn-primary btn-lg btn-full"
                    >
                        {generatingBrief ? (
                            <>
                                <span className="spinner sm" style={{ borderTopColor: 'white' }}></span>
                                Generating Brief with AI...
                            </>
                        ) : (
                            '📄 Generate Authority Brief'
                        )}
                    </button>
                </div>
            )}

            {/* Brief Result */}
            {briefResult && (
                <div className="card animate-fade-in" style={{ borderColor: 'var(--color-success)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3>✅ Brief Generated</h3>
                        {savedSuccess && <span className="badge badge-success">Saved to SharePoint</span>}
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-6)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap',
                        marginBottom: 'var(--space-4)',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {briefResult.brief_text}
                    </div>

                    {!savedSuccess ? (
                        <button
                            onClick={handleSaveBrief}
                            disabled={savingBrief}
                            className="btn btn-success btn-full"
                        >
                            {savingBrief ? 'Saving...' : '👍 Approve & Save Brief'}
                        </button>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--color-success)', fontWeight: 'bold' }}>
                            Brief approved and status updated!
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
