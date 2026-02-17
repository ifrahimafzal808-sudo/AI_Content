import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PAVEScoreCard from '../components/common/PAVEScoreCard'

export default function AnalyzeKeyword() {
    const { data: brandsData, loading: brandsLoading } = useApi(() => api.getBrands())
    const [brandId, setBrandId] = useState('')
    const [keyword, setKeyword] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [results, setResults] = useState(null)
    const [saved, setSaved] = useState(false)

    const handleAnalyze = async () => {
        if (!brandId || !keyword.trim()) return

        setAnalyzing(true)
        setResults(null)
        setSaved(false)
        try {
            const selectedBrand = brandsData?.brands?.find(b => b.id == brandId)
            const data = await api.analyzeKeyword({
                brand_id: brandId,
                brand_name: selectedBrand?.name,
                keyword: keyword.trim()
            })
            setResults(data)
        } catch (error) {
            alert('Analysis failed: ' + error.message)
        } finally {
            setAnalyzing(false)
        }
    }

    const handleSave = async (finalScores) => {
        try {
            const selectedBrand = brandsData?.brands?.find(b => b.id == brandId)
            const response = await api.saveIdea({
                brand_id: brandId,
                brand_name: selectedBrand?.name,
                keyword,
                pave_scores: finalScores,
                search_summary: results.search_summary,
                reasoning: results.ai_reasoning
            })
            setSaved(true)
            alert(`✅ Idea saved! Status: ${response.status}`)
        } catch (error) {
            alert('Save failed: ' + error.message)
        }
    }

    if (brandsLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}>
                <LoadingSpinner text="Loading brands..." />
            </div>
        )
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <div className="page-header">
                <h1 className="page-title">🔍 Analyze Keyword</h1>
                <p className="page-subtitle">
                    Enter a keyword to get AI-powered PAVE scores for content strategy decisions
                </p>
            </div>

            {/* Input Form */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="form-group">
                    <label className="label">Select Brand</label>
                    <select
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                        className="select"
                    >
                        <option value="">-- Select a brand --</option>
                        {brandsData?.brands?.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="label">Keyword</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g., best vitamin D supplements"
                        className="input"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={!brandId || !keyword.trim() || analyzing}
                    className="btn btn-primary btn-full btn-lg"
                >
                    {analyzing ? (
                        <>
                            <span className="spinner sm" style={{ borderTopColor: 'white' }}></span>
                            Analyzing with AI...
                        </>
                    ) : (
                        '🤖 Analyze with AI'
                    )}
                </button>
            </div>

            {/* Results */}
            {analyzing && (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <LoadingSpinner size="lg" text="AI is analyzing your keyword..." />
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-4)' }}>
                        Searching the web, evaluating competition, and scoring...
                    </p>
                </div>
            )}

            {results && !analyzing && (
                <PAVEScoreCard
                    scores={results.pave_scores}
                    searchSummary={results.search_summary}
                    onSave={handleSave}
                />
            )}

            {saved && (
                <div className="card animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-4)', borderColor: 'var(--color-success)' }}>
                    <p style={{ color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>
                        ✅ Keyword saved to backlog! View it in Content Backlog.
                    </p>
                </div>
            )}
        </div>
    )
}
