# AI Content Copilot - n8n Integration Reference

> **Last Updated:** 2026-02-16  
> **Status:** 7 of 10 endpoints implemented

---

## 📋 Quick Reference

### n8n Base URL
```
https://vitcornu.app.n8n.cloud/webhook
```

### Available Endpoints (7/10)

| Endpoint | Method | Purpose | Frontend Function |
|---|---|---|---|
| `/GetActiveBrands` | GET | List all brands | `api.getBrands()` |
| `/GetBrandDetails?brand_name=X` | GET | Get brand config | `api.getBrandDetails(name)` |
| `/FetchBacklogIdeas` | GET | Get approved items | `api.getBacklog()` |
| `/FetchItemDetails?id=X` | GET | Get item details | `api.getContentDetails(id)` |
| `/SaveScoredIdea` | POST | Save PAVE scores | `api.saveIdea(data)` |
| `/UpdateBriefAndStatus` | PUT | Save authority brief | `api.generateBrief(data)` |
| `/UpdateContentStatus` | PUT | Update item status | `api.publishContent(id)` |

---

## 🔴 Missing Endpoints (3/10)

These need to be built in n8n:

1. **`/AnalyzeKeyword`** (POST) — PAVE scoring with Bing + Azure OpenAI
2. **`/RecommendFormat`** (POST) — AI format recommendation  
3. **`/ProduceContent`** (POST) — HTML generation + DALL-E 3 image

---

## 🧪 Testing

Run the test script to validate all endpoints:

```bash
python test_n8n_webhooks.py
```

All tests should return `200 OK`.

---

## 📦 Response Formats

### GetActiveBrands
```json
[{
    "brand_list": ["VitCornu", "Temango"]
}]
```

### GetBrandDetails
```json
{
    "Brand": "VitCornu",
    "Target_Persona": "Eleanor: The Mindful Director...",
    "Compliance_Disclaimer_Block": "",
    "CSS_Wrapper_Link": "https://...",
    ...
}
```

### FetchBacklogIdeas
```json
[{
    "ID": 1,
    "Title": "keyword title",
    "Target_Brand": "VitCornu",
    "Status": "Approved for Briefing",
    "Search_Summary": "",
    "AI_Reasoning": "",
    ...
}]
```

### SaveScoredIdea (Query Params)
```
?Keyword=test&Brand=VitCornu&scores_p=4&scores_a=3&scores_v=4&scores_e=4
```

---

## 🔧 Frontend Configuration

**File:** `frontend/.env`

```env
VITE_N8N_API_URL=https://vitcornu.app.n8n.cloud
VITE_USE_MOCK_DATA=false
```

---

## 📊 Google Sheets Schema

**Sheet:** VitCornu_AI

| Column | Description |
|---|---|
| ID | Auto-generated |
| Title | Keyword/topic |
| Target_Brand | Brand name |
| Status | Pipeline status |
| Search_Summary | Bing search results |
| AI_Reasoning | PAVE reasoning |
| Authority_Brief | Generated brief |
| Draft_HTML_Body | Generated HTML |
| Cover_Image_URL | DALL-E image URL |

**Status Flow:**
```
PAVE Scored → Approved for Briefing → Briefed → In Production → Published
```

---

## 📚 Related Documentation

- **Full Test Results:** `docs/n8n_test_results.md`
- **Integration Analysis:** `docs/n8n_integration_analysis.md`
- **Test Script:** `test_n8n_webhooks.py`
