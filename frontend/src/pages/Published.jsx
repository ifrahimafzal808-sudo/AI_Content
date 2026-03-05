import { useState, useRef, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Convert Google Drive share links to embeddable thumbnail URLs
function toEmbeddableImageUrl(url) {
    if (!url) return ''
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (driveMatch) return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w1200`
    const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
    if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}=w1200`
    // Also handle existing thumbnail URLs
    const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?id=([^&]+)/)
    if (thumbMatch) return `https://lh3.googleusercontent.com/d/${thumbMatch[1]}=w1200`
    return url
}

// Fix Google Drive image URLs in HTML body
function fixDriveImagesInHtml(html) {
    if (!html) return ''
    return html
        .replace(/https?:\/\/drive\.google\.com\/file\/d\/([^/"]+)\/[^"']*/g,
            'https://lh3.googleusercontent.com/d/$1=w1200')
        .replace(/https?:\/\/drive\.google\.com\/open\?id=([^"'&]+)/g,
            'https://lh3.googleusercontent.com/d/$1=w1200')
        .replace(/https?:\/\/drive\.google\.com\/thumbnail\?id=([^"'&\s]+)[^"']*/g,
            'https://lh3.googleusercontent.com/d/$1=w1200')
}

// Strip markdown code fences that n8n sometimes wraps around HTML
function stripMarkdownFences(html) {
    if (!html) return ''
    return html
        .replace(/^\s*```html\s*\n?/i, '')
        .replace(/^\s*```\s*\n?/i, '')
        .replace(/\n?\s*```\s*$/i, '')
        .trim()
}

export default function Published() {
    const { data: inProductionData, loading: inProductionLoading } = useApi(
        () => api.getBacklog({ status: 'In Production' })
    )

    const [previewingItem, setPreviewingItem] = useState(null)
    const [previewTab, setPreviewTab] = useState('preview')
    const iframeRef = useRef(null)

    // Write Draft_HTML_Body to iframe when previewing an item
    useEffect(() => {
        if (previewingItem?.draft_html && iframeRef.current && previewTab === 'preview') {
            const doc = iframeRef.current.contentDocument
            if (doc) {
                const stripped = stripMarkdownFences(previewingItem.draft_html)
                const fixedHtml = fixDriveImagesInHtml(stripped)
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
    }, [previewingItem, previewTab])

    if (inProductionLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}>
                <LoadingSpinner text="Loading content..." />
            </div>
        )
    }

    const inProductionItems = inProductionData?.items || []

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">🚀 Published Content</h1>
                <p className="page-subtitle">
                    Browse your content — {inProductionItems.length} in production
                </p>
            </div>

            {/* ===== In Production Section ===== */}
            {inProductionItems.length > 0 && (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        🏭 In Production
                        <span className="badge badge-warning" style={{ fontSize: 'var(--font-size-xs)' }}>
                            {inProductionItems.length} item{inProductionItems.length !== 1 ? 's' : ''}
                        </span>
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {inProductionItems.map((item) => (
                            <div key={item.id} className="card" style={{
                                borderColor: previewingItem?.id === item.id ? 'var(--color-primary)' : undefined,
                                boxShadow: previewingItem?.id === item.id ? 'var(--shadow-glow)' : undefined
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: 'var(--space-1)' }}>{item.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            Brand: {item.brand} &bull; Score: {item.total_score}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                        {item.draft_html ? (
                                            <button
                                                className={`btn ${previewingItem?.id === item.id ? 'btn-secondary' : 'btn-primary'}`}
                                                onClick={() => {
                                                    setPreviewingItem(previewingItem?.id === item.id ? null : item)
                                                    setPreviewTab('preview')
                                                }}
                                            >
                                                {previewingItem?.id === item.id ? '✕ Close Preview' : '👁️ Preview Article'}
                                            </button>
                                        ) : (
                                            <span className="badge badge-info">No content yet</span>
                                        )}
                                        {item.master_asset_link && (
                                            <a
                                                href={item.master_asset_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost"
                                            >
                                                🔗 Open in SharePoint
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Cover Image */}
                                {previewingItem?.id === item.id && item.cover_image_url && (
                                    <div style={{ marginTop: 'var(--space-4)', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                                        <img
                                            src={toEmbeddableImageUrl(item.cover_image_url)}
                                            alt="Cover"
                                            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', display: 'block' }}
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                    </div>
                                )}

                                {/* Draft HTML Preview */}
                                {previewingItem?.id === item.id && item.draft_html && (
                                    <div style={{ marginTop: 'var(--space-4)' }}>
                                        {/* Tab bar */}
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

                                        {previewTab === 'preview' ? (
                                            <div className="html-preview-container">
                                                <iframe
                                                    ref={iframeRef}
                                                    title={`Preview: ${item.title}`}
                                                    className="html-preview-iframe"
                                                />
                                            </div>
                                        ) : (
                                            <div className="html-source-container">
                                                <pre className="html-source-code">
                                                    <code>{item.draft_html}</code>
                                                </pre>
                                            </div>
                                        )}

                                        {/* SharePoint link */}
                                        {item.master_asset_link && (
                                            <div style={{
                                                marginTop: 'var(--space-3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)'
                                            }}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', flex: 1, wordBreak: 'break-all' }}>
                                                    📎 {item.master_asset_link}
                                                </span>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(item.master_asset_link)
                                                        alert('Link copied!')
                                                    }}
                                                >
                                                    📋 Copy
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
