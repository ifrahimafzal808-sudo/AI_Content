import { Auth0Provider } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

export const Auth0ProviderWithNavigate = ({ children }) => {
    const navigate = useNavigate()

    const domain = import.meta.env.VITE_AUTH0_DOMAIN
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE
    const redirectUri = window.location.origin

    const onRedirectCallback = (appState) => {
        navigate(appState?.returnTo || '/dashboard')
    }

    if (!(domain && clientId && redirectUri)) {
        return null
    }

    // Only include audience if it's explicitly defined in .env
    const audienceParams = audience ? { audience: audience } : {}

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                scope: 'openid profile email',
                ...audienceParams,
            }}
            useRefreshTokens={!!audience}
            cacheLocation="localstorage"
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}
