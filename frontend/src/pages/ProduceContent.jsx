import { useState, useRef, useEffect } from 'react'
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

// Step durations (ms) — controls how long each step animates before advancing.
// The last step stays active until the API responds.
const STEP_DELAYS = [8000, 60000, 60000, 45000]

// Convert Google Drive share links to embeddable thumbnail URLs
function toEmbeddableImageUrl(url) {
    if (!url) return ''
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (driveMatch) return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w1200`
    const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
    if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}=w1200`
    const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?id=([^&]+)/)
    if (thumbMatch) return `https://lh3.googleusercontent.com/d/${thumbMatch[1]}=w1200`
    return url
}

export default function ProduceContent() {
    const { data: backlogData, loading: backlogLoading } = useApi(
        () => api.getBacklog({ status: 'Briefed' })
    )
    const [selectedItemId, setSelectedItemId] = useState('')
    const [producing, setProducing] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [result, setResult] = useState(null)
    const [previewTab, setPreviewTab] = useState('preview') // 'preview' | 'html'
    const [elapsed, setElapsed] = useState(0)
    const [saving, setSaving] = useState(false)
    const iframeRef = useRef(null)
    const elapsedRef = useRef(null)

    // Elapsed timer — ticks every second while producing
    useEffect(() => {
        if (producing) {
            setElapsed(0)
            elapsedRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000)
        } else {
            clearInterval(elapsedRef.current)
        }
        return () => clearInterval(elapsedRef.current)
    }, [producing])

    const fmtElapsed = (s) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return m > 0 ? `${m}m ${sec}s` : `${sec}s`
    }

    const handleProduce = async () => {
        if (!selectedItemId) return
        setProducing(true)
        setResult(null)
        setCurrentStep(1)

        // Step animation runs in background — does NOT block on completion
        const signal = { done: false }
        const runSteps = async () => {
            for (let i = 0; i < STEP_DELAYS.length; i++) {
                if (signal.done) return
                await new Promise(r => setTimeout(r, STEP_DELAYS[i]))
                if (signal.done) return
                setCurrentStep(i + 2)
            }
        }
        runSteps() // fire-and-forget — we only await the API

        try {
            const data = await api.produceContent(selectedItemId)
            signal.done = true
            setCurrentStep(6) // all steps complete
            setResult(data)
        } catch (err) {
            signal.done = true
            alert('Production failed: ' + err.message)
        } finally {
            setProducing(false)
        }
    }

    const handleSaveToSharePoint = async () => {
        if (!result || saving) return
        setSaving(true)
        try {
            await api.publishContent(result.id)
            alert('Content saved to SharePoint successfully!')
        } catch (err) {
            alert('Save failed: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    // Write HTML to iframe when result changes
    useEffect(() => {
        if (result?.final_html && iframeRef.current && previewTab === 'preview') {
            const doc = iframeRef.current.contentDocument
            if (doc) {
                // Strip markdown fences and fix Google Drive image URLs
                let html = result.final_html
                    .replace(/^\s*```html\s*\n?/i, '')
                    .replace(/^\s*```\s*\n?/i, '')
                    .replace(/\n?\s*```\s*$/i, '')
                    .trim()
                const fixedHtml = html
                    .replace(/https?:\/\/drive\.google\.com\/file\/d\/([^/"]+)\/[^"']*/g,
                        'https://lh3.googleusercontent.com/d/$1=w1200')
                    .replace(/https?:\/\/drive\.google\.com\/open\?id=([^"'&]+)/g,
                        'https://lh3.googleusercontent.com/d/$1=w1200')
                    .replace(/https?:\/\/drive\.google\.com\/thumbnail\?id=([^"'&\s]+)[^"']*/g,
                        'https://lh3.googleusercontent.com/d/$1=w1200')

                doc.open()
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta name="referrer" content="no-referrer">
                        <style>
                            body {
                                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                                line-height: 1.7;
                                color: #e2e8f0;
                                background: #1e293b;
                                padding: 2rem;
                                margin: 0;
                                max-width: 100%;
                            }
                            h1 { font-size: 1.75rem; color: #f1f5f9; margin-bottom: 1rem; line-height: 1.3; }
                            h2 { font-size: 1.35rem; color: #f1f5f9; margin-top: 2rem; margin-bottom: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }
                            h3 { font-size: 1.1rem; color: #cbd5e1; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                            p { margin-bottom: 1rem; color: #cbd5e1; }
                            a { color: #818cf8; }
                            blockquote { border-left: 3px solid #6366f1; padding: 0.75rem 1rem; margin: 1rem 0; background: rgba(99,102,241,0.08); border-radius: 0 8px 8px 0; color: #94a3b8; font-size: 0.9rem; }
                            ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; color: #cbd5e1; }
                            li { margin-bottom: 0.5rem; }
                            img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
                            figure { margin: 1.5rem 0; }
                            figcaption { text-align: center; font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; }
                            strong { color: #f1f5f9; }
                            table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                            th, td { padding: 0.5rem; border: 1px solid #334155; text-align: left; }
                            th { background: #334155; color: #f1f5f9; }
                        </style>
                    </head>
                    <body>${fixedHtml}</body>
                    </html>
                `)
                doc.close()
            }
        }
    }, [result, previewTab])

    if (backlogLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}>
                <LoadingSpinner text="Loading items..." />
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">⚡ Produce Content</h1>
                <p className="page-subtitle">
                    Generate full HTML articles with AI — including cover images
                </p>
            </div>

            {/* Select Briefed Item */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', maxWidth: '800px' }}>
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
                <div className="card animate-fade-in" style={{ maxWidth: '800px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                        <h3 style={{ margin: 0 }}>Production in Progress...</h3>
                        <div style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: 'var(--radius-full)',
                            padding: 'var(--space-2) var(--space-4)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--color-primary-light)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            ⏱️ {fmtElapsed(elapsed)}
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                        AI is generating your article, cover image, and saving to SharePoint. This typically takes 3–5 minutes.
                    </p>
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
                <div className="animate-fade-in">
                    {/* Success Header */}
                    <div className="card" style={{ borderColor: 'var(--color-success)', marginBottom: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '2.5rem' }}>🎉</span>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: 'var(--space-1)' }}>Content Produced Successfully!</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                    Your article has been generated and saved to SharePoint.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                {result.master_asset_link && (
                                    <a
                                        href={result.master_asset_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                    >
                                        📂 Open in SharePoint
                                    </a>
                                )}
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveToSharePoint}
                                    disabled={saving}
                                >
                                    {saving ? '⏳ Saving...' : '💾 Save to SharePoint'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {result.cover_image_url && (
                        <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 0, overflow: 'hidden' }}>
                            <img
                                src={toEmbeddableImageUrl(result.cover_image_url)}
                                alt="Article cover"
                                style={{
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>
                    )}

                    {/* HTML Preview */}
                    {result.final_html && (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Tab Bar */}
                            <div className="preview-tabs">
                                <button
                                    className={`preview-tab ${previewTab === 'preview' ? 'active' : ''}`}
                                    onClick={() => setPreviewTab('preview')}
                                >
                                    👁️ Preview
                                </button>
                                <button
                                    className={`preview-tab ${previewTab === 'html' ? 'active' : ''}`}
                                    onClick={() => setPreviewTab('html')}
                                >
                                    🔤 HTML Source
                                </button>
                            </div>

                            {/* Preview Content */}
                            {previewTab === 'preview' ? (
                                <div className="html-preview-container">
                                    <iframe
                                        ref={iframeRef}
                                        title="Article Preview"
                                        className="html-preview-iframe"
                                    />
                                </div>
                            ) : (
                                <div className="html-source-container">
                                    <pre className="html-source-code">
                                        <code>{result.final_html}</code>
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Master Asset Link Info */}
                    {result.master_asset_link && (
                        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '1.5rem' }}>📎</span>
                                <h3 style={{ margin: 0 }}>SharePoint Asset</h3>
                            </div>
                            <div style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-3) var(--space-4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                wordBreak: 'break-all'
                            }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', flex: 1 }}>
                                    {result.master_asset_link}
                                </span>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.master_asset_link)
                                        alert('Link copied to clipboard!')
                                    }}
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-3)', marginBottom: 0 }}>
                                The article has been saved to your SharePoint document library. You can access and share it using the link above.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
