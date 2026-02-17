import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner size="lg" text="Checking authentication..." />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return children
}
