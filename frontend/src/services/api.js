/* ================================================
   API Service — talks to n8n webhooks
   When VITE_USE_MOCK_DATA=true, returns mock data
   so you can develop the frontend without n8n.
   ================================================ */

const N8N_API_URL = import.meta.env.VITE_N8N_API_URL
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// ---------- Mock Data ----------
const MOCK_BRANDS = [
    { id: 1, name: 'Vit Cornu' },
    { id: 2, name: 'HealthFirst' },
    { id: 3, name: 'NutriPeak' }
]

const MOCK_BACKLOG = [
    {
        id: 1,
        title: 'best vitamin D supplements',
        brand: 'Vit Cornu',
        pave_scores: { P: 4, A: 3, V: 4, E: 4 },
        total_score: 15,
        status: 'Approved for Briefing',
        created_date: '2026-02-10'
    },
    {
        id: 2,
        title: 'magnesium glycinate benefits',
        brand: 'Vit Cornu',
        pave_scores: { P: 5, A: 4, V: 5, E: 4 },
        total_score: 18,
        status: 'Approved for Briefing',
        created_date: '2026-02-09'
    },
    {
        id: 3,
        title: 'omega 3 fish oil vs krill oil',
        brand: 'HealthFirst',
        pave_scores: { P: 4, A: 5, V: 3, E: 3 },
        total_score: 15,
        status: 'Briefed',
        created_date: '2026-02-08'
    },
    {
        id: 4,
        title: 'natural sleep supplements guide',
        brand: 'NutriPeak',
        pave_scores: { P: 3, A: 4, V: 4, E: 5 },
        total_score: 16,
        status: 'In Production',
        created_date: '2026-02-05'
    },
    {
        id: 5,
        title: 'probiotics for digestive health',
        brand: 'HealthFirst',
        pave_scores: { P: 5, A: 5, V: 4, E: 4 },
        total_score: 18,
        status: 'Published',
        created_date: '2026-01-28'
    },
    {
        id: 6,
        title: 'vitamin B12 deficiency symptoms',
        brand: 'Vit Cornu',
        pave_scores: { P: 4, A: 3, V: 5, E: 3 },
        total_score: 15,
        status: 'Published',
        created_date: '2026-01-20'
    },
    {
        id: 7,
        title: 'collagen peptides vs marine collagen',
        brand: 'NutriPeak',
        pave_scores: { P: 3, A: 4, V: 3, E: 4 },
        total_score: 14,
        status: 'PAVE Scored',
        created_date: '2026-02-14'
    }
]

const MOCK_PAVE_RESULT = {
    pave_scores: {
        profitability_score: 4,
        profitability_reasoning: 'High commercial intent with product focus',
        authority_score: 3,
        authority_reasoning: 'Brand has moderate domain authority',
        volume_score: 0,
        volume_reasoning: 'Manual check required',
        effort_score: 4,
        effort_reasoning: 'Moderate competition, good opportunity'
    },
    search_summary: 'Top results include authoritative health sites and competitor product pages. The keyword shows strong commercial intent.'
}

// ---------- Simulated Delay (feels like a real API) ----------
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ---------- API Class ----------
class ApiService {
    constructor() {
        this.baseUrl = N8N_API_URL
        this.apiKey = N8N_API_KEY
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`

        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            ...options.headers
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'API request failed')
            }

            return await response.json()
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    // ----- Brand Endpoints -----
    async getBrands() {
        if (USE_MOCK) {
            await delay(400)
            return { brands: MOCK_BRANDS }
        }
        // Real n8n: GetActiveBrands returns [{brand_list: ["Brand1", "Brand2"]}]
        const response = await this.request('/webhook/GetActiveBrands')
        // n8n returns an array, get the first element
        const data = Array.isArray(response) ? response[0] : response
        // Transform to match frontend expectations
        return {
            brands: data.brand_list?.map((name, i) => ({
                id: i + 1,
                name
            })) || []
        }
    }

    async getBrandDetails(brandName) {
        if (USE_MOCK) {
            await delay(300)
            const brand = MOCK_BRANDS.find(b => b.name === brandName)
            return {
                ...brand,
                persona: 'A trusted health and wellness advisor',
                tone: 'Professional yet approachable',
                product_context: 'Dietary supplements and vitamins'
            }
        }
        // Real n8n: GetBrandDetails?brand_name=X returns sheet row
        return this.request(`/webhook/GetBrandDetails?brand_name=${encodeURIComponent(brandName)}`)
    }

    // ----- Content Endpoints -----
    async analyzeKeyword(data) {
        if (USE_MOCK) {
            await delay(2500) // Simulate AI processing time
            return MOCK_PAVE_RESULT
        }
        // Real n8n: AnalyzeKeyword_Backend expects Brand_Name and Keyword as query params
        const response = await this.request(`/webhook/AnalyzeKeyword_Backend?` + new URLSearchParams({
            Brand_Name: data.brand_name,
            Keyword: data.keyword
        }), {
            method: 'POST'
        })

        // n8n returns an array with one object, extract it
        const result = Array.isArray(response) ? response[0] : response

        // Transform to frontend format
        return {
            pave_scores: {
                profitability_score: result.profitability_score,
                profitability_reasoning: result.profitability_reasoning,
                authority_score: result.authority_score,
                authority_reasoning: result.authority_reasoning,
                volume_score: result.volume_score,
                volume_reasoning: result.volume_reasoning,
                effort_score: result.effort_score,
                effort_reasoning: result.effort_reasoning
            },
            search_summary: result.search_summary,
            ai_reasoning: result.ai_reasoning
        }
    }

    async saveIdea(data) {
        if (USE_MOCK) {
            await delay(800)
            const totalScore = data.pave_scores.P + data.pave_scores.A + data.pave_scores.V + data.pave_scores.E
            return {
                success: true,
                item_id: Math.floor(Math.random() * 1000) + 10,
                status: totalScore >= 18 ? 'Approved for Briefing' : 'PAVE Scored'
            }
        }
        // Real n8n: SaveScoredIdea expects query params for scores
        return this.request(`/webhook/SaveScoredIdea?` + new URLSearchParams({
            Keyword: data.keyword,
            Brand: data.brand_name,
            scores_p: data.pave_scores.P,
            scores_a: data.pave_scores.A,
            scores_v: data.pave_scores.V,
            scores_e: data.pave_scores.E,
            search_summary: data.search_summary || '',
            reasoning: data.reasoning || ''
        }), {
            method: 'POST'
        })
    }

    async getBacklog(params = {}) {
        if (USE_MOCK) {
            await delay(500)
            let items = [...MOCK_BACKLOG]
            if (params.status && params.status !== 'All') {
                items = items.filter(i => i.status === params.status)
            }
            return { items, total: items.length }
        }
        // Real n8n: FetchBacklogIdeas returns array of sheet rows
        const response = await this.request('/webhook/FetchBacklogIdeas')
        // Transform Google Sheets data to frontend format
        const items = (Array.isArray(response) ? response : [response]).map(row => ({
            id: row.ID,
            title: row.Title,
            brand: row.Target_Brand,
            pave_scores: {
                P: parseInt(row.P_Score) || 0,
                A: parseInt(row.A_Score) || 0,
                V: parseInt(row.V_Score) || 0,
                E: parseInt(row.E_Score) || 0
            },
            total_score: parseInt(row.Total_Score) || 0,
            status: row.Status,
            created_date: row.Created_Date || ''
        }))
        return { items, total: items.length }
    }

    async getContentDetails(id) {
        if (USE_MOCK) {
            await delay(400)
            const item = MOCK_BACKLOG.find(i => i.id === Number(id))
            return {
                ...item,
                search_summary: 'Top results include authoritative health sites...',
                authority_brief: '## Content Goal\nCreate a comprehensive guide on ' + (item?.title || 'topic') + '...'
            }
        }
        // Real n8n: FetchItemDetails?id=X returns single sheet row
        const response = await this.request(`/webhook/FetchItemDetails?id=${id}`)
        return {
            id: response.ID,
            title: response.Title,
            brand: response.Target_Brand,
            status: response.Status,
            search_summary: response.Search_Summary,
            authority_brief: response.Authority_Brief
        }
    }

    // ----- Brief Endpoints -----
    async recommendFormat(data) {
        if (USE_MOCK) {
            await delay(1500)
            return {
                format: 'In-Depth Guide',
                reasoning: 'High informational intent with educational focus',
                alternative: 'Comparison Page'
            }
        }
        // ⚠️ NOT IMPLEMENTED YET IN N8N
        return this.request('/webhook/RecommendFormat', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async generateBrief(data) {
        if (USE_MOCK) {
            await delay(3000)
            return {
                success: true,
                brief_text: `## Authority Brief: ${data.keyword || 'Topic'}\n\n### Content Goal\nCreate a comprehensive investigative article...\n\n### Target Audience\nHealth-conscious consumers aged 25-55...\n\n### Content Outline\n- **H2: Introduction & Background**\n- **H2: Key Benefits**\n- **H2: Expert Insights**\n- **H2: Comparison & Analysis**\n- **H2: Conclusion & Recommendations**\n\n### Key Points to Cover\n1. Scientific evidence and studies\n2. Expert opinions from trusted sources\n3. Product comparisons where relevant\n4. Safety considerations and disclaimers`
            }
        }
        // Real n8n: UpdateBriefAndStatus updates Authority_Brief column
        return this.request(`/webhook/UpdateBriefAndStatus`, {
            method: 'PUT',
            body: JSON.stringify({
                id: data.item_id,
                brief_text: data.brief_text
            })
        })
    }

    // ----- Production Endpoints -----
    async produceContent(id) {
        if (USE_MOCK) {
            await delay(5000) // Simulate long content generation
            return {
                success: true,
                asset_url: 'https://example.com/generated-article.html',
                generation_time: '2m 14s'
            }
        }
        // ⚠️ NOT IMPLEMENTED YET IN N8N
        return this.request('/webhook/ProduceContent', {
            method: 'POST',
            body: JSON.stringify({ item_id: id })
        })
    }

    async publishContent(id) {
        if (USE_MOCK) {
            await delay(1500)
            return {
                success: true,
                published_url: 'https://example.com/published/' + id
            }
        }
        // Real n8n: UpdateContentStatus updates Status column
        return this.request('/webhook/UpdateContentStatus', {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                new_status: 'Published'
            })
        })
    }
}

export const api = new ApiService()

