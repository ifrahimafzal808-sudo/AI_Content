# n8n Webhook Integration Analysis

## 📋 Currently Implemented Webhooks (in n8n)

| Webhook Name | Method | Path | Purpose | Data Store |
|---|---|---|---|---|
| **GetActiveBrands** | GET | `/GetActiveBrands` | Fetch all brands from configuration | Google Sheets: `Brand_Configuration` |
| **GetBrandDetails** | GET | `/GetBrandDetails?brand_name=X` | Get details for a specific brand | Google Sheets: `Brand_Configuration` |
| **SaveScoredIdea** | POST | `/SaveScoredIdea` | Save a PAVE-scored keyword | Google Sheets: `VitCornu_AI` |
| **FetchBacklogIdeas** | GET | `/FetchBacklogIdeas` | Get items with status "Approved for Briefing" | Google Sheets: `VitCornu_AI` |
| **FetchItemDetails** | GET | `/FetchItemDetails?id=X` | Get details of a specific item by ID | Google Sheets: `VitCornu_AI` |
| **UpdateBriefAndStatus** | PUT | `/UpdateBriefAndStatus` | Update Authority_Brief for an item | Google Sheets: `VitCornu_AI` |
| **UpdateContentStatus** | PUT | `/UpdateContentStatus` | Update Status of an item | Google Sheets: `VitCornu_AI` |

---

## 🔄 Frontend API Mapping

### ✅ Already Connected (Works Now)

| Frontend Function | n8n Webhook | Status |
|---|---|---|
| `getBrands()` | `GetActiveBrands` | ✅ Ready |
| `getBrandDetails(brandId)` | `GetBrandDetails` | ✅ Ready |
| `saveIdea(data)` | `SaveScoredIdea` | ✅ Ready |
| `getBacklog()` | `FetchBacklogIdeas` | ✅ Ready |
| `getContentDetails(id)` | `FetchItemDetails` | ✅ Ready |

### ⚠️ NOT Yet Implemented in n8n

These frontend functions are calling API endpoints that **don't exist yet** in n8n:

| Frontend Function | Missing n8n Flow | What It Needs |
|---|---|---|
| `analyzeKeyword()` | `/webhook/content/analyze` | **PAVE Scoring Flow** with Bing Search + Azure OpenAI analysis |
| `recommendFormat()` | `/webhook/brief/recommend` | AI-powered format recommendation |
| `generateBrief()` | `/webhook/brief/generate` | **Authority Brief Generation** with Azure OpenAI |
| `produceContent()` | `/webhook/content/produce` | **Master Content Production** (HTML + DALL-E 3 image) |
| `publishContent()` | `/webhook/content/publish` | Optional: Mark status as "Published" |

---

## 🎯 What's Working RIGHT NOW

With the webhooks you have, the frontend can:

1. **Brand Management**
   - Load all active brands
   - Get brand details (persona, tone, etc.)

2. **Content Backlog**
   - View items with status "Approved for Briefing"
   - View details of specific items

3. **Save Ideas**
   - Save PAVE-scored keywords directly to Google Sheets

---

## 🚧 What Needs to Be Built (Priority Order)

### Priority 1: PAVE Scoring Flow ⚡ **CRITICAL**
> **Frontend page:** `AnalyzeKeyword.jsx`

**Required n8n nodes:**
1. Webhook: `POST /AnalyzeKeyword`
2. Bing Search API (search top 10 results)
3. Azure OpenAI GPT-4:
   - Analyze search results
   - Score Profitability (1-5)
   - Score Authority (1-5) — check if brand domain authority is sufficient
   - Score Effort (1-5) — competitive analysis
   - Generate search summary
4. Respond with:
   ```json
   {
     "pave_scores": {
       "profitability_score": 4,
       "profitability_reasoning": "High commercial intent...",
       "authority_score": 3,
       "authority_reasoning": "Moderate DA required...",
       "effort_score": 4,
       "effort_reasoning": "Low competition..."
     },
     "search_summary": "Top results include..."
   }
   ```

### Priority 2: Authority Brief Generation 📝
> **Frontend page:** `CreateBrief.jsx`

**Required n8n nodes:**
1. Webhook: `POST /GenerateBrief`
2. Azure OpenAI GPT-4:
   - Generate full Authority Brief based on:
     - Keyword
     - Brand persona
     - Search results
     - Differentiator
     - SME input
3. Save brief to Google Sheets column `Authority_Brief`
4. Update status to "Briefed"

### Priority 3: Content Production 🚀
> **Frontend page:** `ProduceContent.jsx`

**Required n8n nodes:**
1. Webhook: `POST /ProduceContent`
2. Azure OpenAI GPT-4: Generate HTML article
3. DALL-E 3: Generate cover image
4. Save HTML to Google Sheets column `Draft_HTML_Body`
5. Save image URL to `Cover_Image_URL`
6. Update status to "In Production"

---

## 📌 Google Sheets Schema (VitCornu_AI)

Based on your n8n flow, the sheet has these columns:

| Column | Purpose |
|---|---|
| `ID` | Auto-generated row ID |
| `Title` | Keyword/topic title |
| `Target_Brand` | Brand name |
| `Status` | Pipeline status (PAVE Scored → Approved for Briefing → Briefed → In Production → Published) |
| `Search_Summary` | Summary of search results |
| `AI_Reasoning` | AI's PAVE reasoning |
| `Authority_Brief` | Generated authority brief |
| `Is_Outline_Approved` | Manual approval flag |
| `Draft_HTML_Body` | Generated HTML content |
| `Image_Prompt` | Prompt used for DALL-E |
| `Alt_Text_Suggested` | Image alt text |
| `Cover_Image_URL` | URL to generated image |
| `Master_Asset_Link` | Link to final asset |
| `Last_Error` | Any errors during processing |

---

## 🔧 Next Steps

1. **Set `VITE_N8N_API_URL` in `.env`** to your actual n8n webhook base URL (e.g., `https://your-n8n-instance.com`)
2. **Set `VITE_USE_MOCK_DATA=false`** to switch from mock to real n8n data
3. **Test the 5 working endpoints** (brands, backlog, save idea)
4. **Build the 3 missing flows** in n8n (PAVE scoring → Brief generation → Content production)
