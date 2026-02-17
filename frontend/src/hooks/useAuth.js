import { useAuth0 } from '@auth0/auth0-react'

export function useAuth() {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        loginWithRedirect,
        logout,
        getAccessTokenSilently
    } = useAuth0()

    const signIn = () => {
        loginWithRedirect({
            appState: { returnTo: '/dashboard' }
        })
    }

    const signOut = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })
    }

    const getToken = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE
                }
            })
            return token
        } catch (err) {
            console.error('Error getting token:', err)
            return null
        }
    }

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        signIn,
        signOut,
        getToken
    }
}
