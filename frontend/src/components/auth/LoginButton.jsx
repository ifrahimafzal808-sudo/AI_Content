import { useAuth } from '../../hooks/useAuth'

export default function LoginButton({ large = false }) {
    const { signIn, isLoading } = useAuth()

    return (
        <button
            onClick={signIn}
            disabled={isLoading}
            className={`btn btn-primary ${large ? 'btn-lg' : ''}`}
        >
            {isLoading ? 'Loading...' : '🚀 Get Started'}
        </button>
    )
}
