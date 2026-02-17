import { useState, useEffect } from 'react'

export function useApi(apiCall, dependencies = []) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        async function fetchData() {
            try {
                setLoading(true)
                setError(null)
                const result = await apiCall()
                if (isMounted) {
                    setData(result)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, dependencies)

    return { data, loading, error, setData }
}
