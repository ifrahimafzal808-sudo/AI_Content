export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizeClass = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''

    return (
        <div className="spinner-container">
            <div className={`spinner ${sizeClass}`}></div>
            {text && <p className="spinner-text">{text}</p>}
        </div>
    )
}
