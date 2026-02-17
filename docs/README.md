# n8n Integration Documentation

This folder contains all documentation for integrating the AI Content Copilot frontend with n8n workflows.

## 📁 Files

### `n8n_quick_reference.md`
**Quick start guide** with:
- All endpoint URLs
- Request/response formats
- Frontend API mapping
- Configuration settings

👉 **Start here for daily reference**

### `n8n_integration_analysis.md`
**Detailed integration roadmap** with:
- Complete endpoint mapping
- What's implemented vs. missing
- Google Sheets schema
- Implementation priorities

👉 **Use this when planning new features**

### `n8n_test_results.md`
**Test results** from Python script with:
- Actual response examples
- Status codes
- Integration status

👉 **Reference when debugging API issues**

## 🧪 Testing

Run the test script from the project root:

```bash
python test_n8n_webhooks.py
```

## 🔗 Related Files

- **Test Script:** `/test_n8n_webhooks.py`
- **API Service:** `/frontend/src/services/api.js`
- **Environment Config:** `/frontend/.env`

## ✅ Current Status

**7 of 10 endpoints** implemented and tested
- ✅ Brand management
- ✅ Content backlog
- ✅ Saving ideas
- ✅ Brief updates
- ⚠️ PAVE scoring (missing)
- ⚠️ Format recommendation (missing)
- ⚠️ Content production (missing)
