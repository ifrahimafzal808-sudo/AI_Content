```mermaid
flowchart TD
    Start([Copilot Studio UI]) --> Topic{Which Topic?}
    
    Topic -->|Analyze & Score Idea| T1[Topic 1: Analyze & Score Idea]
    Topic -->|Develop Brief| T2[Topic 2: Develop Authority Brief]
    Topic -->|Produce Content| T3[Topic 3: Produce Investigative Content]
    
    %% Topic 1 Flow
    T1 --> F1[Flow 1: GetActiveBrands]
    F1 --> F2[Flow 2: GetBrandDetails]
    F2 --> T1_Search[Native Web Search]
    T1_Search --> F3[Flow 3: AnalyzeKeyword_Backend]
    F3 --> T1_Card[Display Adaptive Card]
    T1_Card --> F4[Flow 4: SaveScoredIdea]
    F4 --> SP1[(SharePoint: Content Pipeline)]
    
    %% Topic 2 Flow
    T2 --> F5[Flow 5: FetchBacklogIdeas]
    F5 --> T2_Select[User Selects Idea]
    T2_Select --> F6[Flow 6: FetchItemDetails]
    F6 --> T2_Format[AI: Recommend Format]
    T2_Format --> T2_Brief[AI: Generate Brief]
    T2_Brief --> F7[Flow 7: UpdateBriefAndStatus]
    F7 --> SP2[(SharePoint: Update Item)]
    
    %% Topic 3 Flow
    T3 --> T3_ID[User Provides Brief ID]
    T3_ID --> F10[Flow 10: ProduceContent_Backend]
    F10 --> SP3[(SharePoint: Save HTML + Update)]
    
    style Start fill:#2E5090,color:#fff
    style SP1 fill:#4472C4,color:#fff
    style SP2 fill:#4472C4,color:#fff
    style SP3 fill:#4472C4,color:#fff
    style F3 fill:#70AD47,color:#fff
    style F4 fill:#70AD47,color:#fff
    style F10 fill:#70AD47,color:#fff
```

## Flow 1: GetActiveBrands
```mermaid
flowchart LR
    A[Webhook Trigger<br/>from Copilot] --> B[SharePoint Node:<br/>Get Items]
    B --> C[Brand Configuration List]
    C --> D[Filter: Active = Yes<br/>optional]
    D --> E[Select: Brand Names Only]
    E --> F[Format as Array]
    F --> G[Return to Copilot]
    
    style A fill:#FFD966
    style G fill:#70AD47,color:#fff
```

## Flow 2: GetBrandDetails
```mermaid
flowchart LR
    A[Webhook Trigger<br/>Input: Brand_Name] --> B[SharePoint Node:<br/>Get Items]
    B --> C[Filter:<br/>Title eq 'Brand_Name']
    C --> D{Found?}
    D -->|Yes| E[Extract Fields:<br/>Target_Persona<br/>Tone_of_Voice<br/>Product_Context<br/>CSS_Wrapper_Link<br/>Compliance_Disclaimer_Block<br/>Banned_HTML_Tags]
    D -->|No| F[Return Error]
    E --> G[Return JSON Object]
    
    style A fill:#FFD966
    style G fill:#70AD47,color:#fff
    style F fill:#C00000,color:#fff
```

## Flow 3: AnalyzeKeyword_Backend (PAVE Scorer)
```mermaid
flowchart TD
    A[Webhook Trigger<br/>Inputs: Brand_Name, Keyword] --> B[SharePoint: Get Brand Details]
    B --> C[Bing Search API:<br/>Search for Keyword]
    C --> D[HTTP Request Node:<br/>Get Top 10 Results]
    D --> E[Code Node:<br/>Summarize Search Results]
    E --> F[OpenAI GPT-4 Node:<br/>PAVE Scoring Prompt]
    F --> G{Valid JSON?}
    G -->|Yes| H[Parse JSON]
    G -->|No| I[Retry with Stricter Prompt]
    I --> F
    H --> J[Validate Schema:<br/>profitability_score: int<br/>profitability_reasoning: string<br/>authority_score: int<br/>authority_reasoning: string<br/>volume_score: 0<br/>volume_reasoning: 'Manual check required'<br/>effort_score: int<br/>effort_reasoning: string]
    J --> K{Schema Valid?}
    K -->|Yes| L[Return Typed Fields to Copilot]
    K -->|No| M[Return Error + Fallback Scores]
    
    style A fill:#FFD966
    style F fill:#5B9BD5,color:#fff
    style L fill:#70AD47,color:#fff
    style M fill:#C00000,color:#fff
```

## Flow 4: SaveScoredIdea (Auto-Approval)
```mermaid
flowchart TD
    A[Webhook Trigger<br/>Inputs: Keyword, Brand, Scores P/A/V/E, Reasoning, Search_Summary] --> B[Code Node:<br/>Calculate Total Score]
    B --> C{Total Score >= 18?}
    C -->|Yes| D[Set Status:<br/>'Approved for Briefing']
    C -->|No| E[Set Status:<br/>'PAVE Scored']
    D --> F[SharePoint: Get Brand ID<br/>from Brand_Name Lookup]
    E --> F
    F --> G[SharePoint: Create Item<br/>in Content Pipeline]
    G --> H[Map Fields:<br/>Title = Keyword<br/>Target_Brand = Brand_ID<br/>Status = Status<br/>PAVE_Score_P = P<br/>PAVE_Score_A = A<br/>PAVE_Score_V = V<br/>PAVE_Score_E = E<br/>Search_Summary = Summary<br/>AI_Reasoning = Reasoning]
    H --> I[Return Success]
    
    style A fill:#FFD966
    style I fill:#70AD47,color:#fff
```

## Flow 5: FetchBacklogIdeas
```mermaid
flowchart LR
    A[Webhook Trigger<br/>No Inputs] --> B[SharePoint: Get Items<br/>Content Pipeline]
    B --> C[Filter:<br/>Status eq 'Approved for Briefing']
    C --> D[Sort By:<br/>PAVE_Score_P DESC]
    D --> E[Limit: Top 5]
    E --> F[Code Node: Format Loop]
    F --> G[Build String:<br/>'Title: X | ID: Y\n']
    G --> H[Return Formatted List]
    
    style A fill:#FFD966
    style H fill:#70AD47,color:#fff
```

## Flow 6: FetchItemDetails
```mermaid
flowchart LR
    A[Webhook Trigger<br/>Input: sharepoint_id] --> B[SharePoint: Get Item<br/>by ID]
    B --> C{Item Exists?}
    C -->|Yes| D[Extract Fields:<br/>item_title<br/>item_search_summary<br/>item_target_brand<br/>PAVE scores optional]
    C -->|No| E[Return Error]
    D --> F[Return JSON Object]
    
    style A fill:#FFD966
    style F fill:#70AD47,color:#fff
    style E fill:#C00000,color:#fff
```

## Flow 7: UpdateBriefAndStatus
```mermaid
flowchart LR
    A[Webhook Trigger<br/>Inputs: sharepoint_id, brief_text] --> B[SharePoint: Update Item]
    B --> C[Set Fields:<br/>Authority_Brief = brief_text<br/>Status = 'Briefed']
    C --> D[Return Success]
    
    style A fill:#FFD966
    style D fill:#70AD47,color:#fff
```

## Flow 8: UpdateContentStatus (INFERRED)
```mermaid
flowchart LR
    A[Webhook Trigger<br/>Inputs: sharepoint_id, new_status] --> B{Validate Status Transition}
    B -->|Valid| C[SharePoint: Update Item]
    B -->|Invalid| D[Return Error:<br/>Invalid Transition]
    C --> E[Set Fields:<br/>Status = new_status]
    E --> F[Optional: Add Timestamp<br/>or Notes]
    F --> G[Return Success]
    
    style A fill:#FFD966
    style G fill:#70AD47,color:#fff
    style D fill:#C00000,color:#fff
```

## Flow 9: PublishContent (INFERRED)
```mermaid
flowchart TD
    A[Webhook Trigger<br/>Input: sharepoint_id] --> B[SharePoint: Get Item Details]
    B --> C{Status = 'In Production'?}
    C -->|No| D[Return Error:<br/>Item Not Ready]
    C -->|Yes| E[Get Master_Asset_Link]
    E --> F{External CMS Integration?}
    F -->|Yes| G[HTTP Request:<br/>Publish to WordPress/CMS]
    F -->|No| H[Copy File to Public Folder]
    G --> I[Get Published URL]
    H --> I
    I --> J[SharePoint: Update Item]
    J --> K[Set Fields:<br/>Status = 'Published'<br/>Published_URL = URL<br/>Published_Date = Now]
    K --> L[Return Success + URL]
    
    style A fill:#FFD966
    style L fill:#70AD47,color:#fff
    style D fill:#C00000,color:#fff
```

## Flow 10: ProduceContent_Backend (The Writer)
```mermaid
flowchart TD
    A[Webhook Trigger<br/>Input: sharepoint_id] --> B[SharePoint: Get Item Details]
    B --> C[Extract:<br/>Title, Search_Summary, Authority_Brief]
    C --> D[SharePoint: Get Brand Details<br/>via Target_Brand Lookup]
    D --> E[Extract Brand Context:<br/>Persona, Tone, Banned_Tags, Disclaimer]
    
    E --> F[OpenAI GPT-4 Node:<br/>Investigative Writer Prompt]
    F --> G[System Prompt:<br/>'You are investigative reporter'<br/>Persona: X, Tone: Y<br/>Two-source rule<br/>Output HTML only<br/>Banned tags: Z]
    G --> H[Generate HTML Body]
    
    H --> I[DALL-E 3 Node:<br/>Generate Cover Image]
    I --> J[Get Image URL]
    
    J --> K[HTTP Request:<br/>Fetch CSS_Wrapper_Link]
    K --> L[Code Node:<br/>String Replacement]
    L --> M[Replace:<br/>{{CONTENT}} → HTML_Body<br/>{{COVER_IMAGE_URL}} → Image_URL]
    
    M --> N[SharePoint: Create File]
    N --> O[Filename: Title.html<br/>Content: Final HTML]
    O --> P[Get File URL]
    
    P --> Q[SharePoint: Update Item]
    Q --> R[Set Fields:<br/>Master_Asset_Link = File_URL<br/>Status = 'In Production']
    R --> S[Return Success + Link]
    
    style A fill:#FFD966
    style F fill:#5B9BD5,color:#fff
    style I fill:#5B9BD5,color:#fff
    style S fill:#70AD47,color:#fff
```

## Complete System Architecture (n8n)
```mermaid
flowchart TB
    subgraph UI["User Interface Layer"]
        CS[Copilot Studio]
    end
    
    subgraph n8n["n8n Automation Engine"]
        direction TB
        
        subgraph Brand["Brand Management"]
            F1[Flow 1:<br/>GetActiveBrands]
            F2[Flow 2:<br/>GetBrandDetails]
        end
        
        subgraph Analysis["Content Analysis"]
            F3[Flow 3:<br/>AnalyzeKeyword_Backend]
            F4[Flow 4:<br/>SaveScoredIdea]
        end
        
        subgraph Briefing["Brief Management"]
            F5[Flow 5:<br/>FetchBacklogIdeas]
            F6[Flow 6:<br/>FetchItemDetails]
            F7[Flow 7:<br/>UpdateBriefAndStatus]
        end
        
        subgraph Status["Status Management"]
            F8[Flow 8:<br/>UpdateContentStatus]
        end
        
        subgraph Production["Content Production"]
            F10[Flow 10:<br/>ProduceContent_Backend]
            F9[Flow 9:<br/>PublishContent]
        end
    end
    
    subgraph Data["Data Layer"]
        SP1[(SharePoint:<br/>Brand Configuration)]
        SP2[(SharePoint:<br/>Content Pipeline)]
    end
    
    subgraph AI["AI Services"]
        Bing[Bing Search API]
        GPT[Azure OpenAI<br/>GPT-4]
        DALLE[DALL-E 3]
    end
    
    CS <-->|Webhooks| Brand
    CS <-->|Webhooks| Analysis
    CS <-->|Webhooks| Briefing
    CS <-->|Webhooks| Status
    CS <-->|Webhooks| Production
    
    Brand <--> SP1
    Analysis <--> SP2
    Briefing <--> SP2
    Status <--> SP2
    Production <--> SP2
    Production <--> SP1
    
    F3 --> Bing
    F3 --> GPT
    F10 --> GPT
    F10 --> DALLE
    
    style CS fill:#2E5090,color:#fff
    style SP1 fill:#4472C4,color:#fff
    style SP2 fill:#4472C4,color:#fff
    style Bing fill:#00A4EF,color:#fff
    style GPT fill:#5B9BD5,color:#fff
    style DALLE fill:#5B9BD5,color:#fff
```

## Data Flow: Topic 1 (Analyze & Score Idea)
```mermaid
sequenceDiagram
    participant User
    participant Copilot
    participant n8n
    participant Bing
    participant GPT
    participant SP as SharePoint
    
    User->>Copilot: "Analyze new idea"
    Copilot->>n8n: Flow 1: GetActiveBrands
    n8n->>SP: Query Brand Configuration
    SP-->>n8n: Return Brands List
    n8n-->>Copilot: Brands Array
    Copilot->>User: "Which Brand?"
    User->>Copilot: Selects Brand
    
    Copilot->>n8n: Flow 2: GetBrandDetails(Brand)
    n8n->>SP: Get Brand Config
    SP-->>n8n: Brand Details
    n8n-->>Copilot: Persona, Tone, Context
    
    Copilot->>User: "Enter Keyword"
    User->>Copilot: "best hiking boots"
    
    Copilot->>Bing: Web Search
    Bing-->>Copilot: Top 10 Results
    Copilot->>Copilot: Summarize Results
    
    Copilot->>n8n: Flow 3: AnalyzeKeyword(Brand, Keyword, Summary)
    n8n->>SP: Get Brand Context
    n8n->>Bing: Additional Search
    n8n->>GPT: PAVE Scoring Prompt
    GPT-->>n8n: JSON Scores
    n8n->>n8n: Validate Schema
    n8n-->>Copilot: Typed Scores (P, A, E) + Reasonings
    
    Copilot->>User: Display Adaptive Card
    User->>Copilot: Confirms + Adds Volume=4
    
    Copilot->>n8n: Flow 4: SaveScoredIdea(All Data)
    n8n->>n8n: Calculate Total=P+A+V+E
    n8n->>n8n: IF Total>=18: Status='Approved' ELSE 'PAVE Scored'
    n8n->>SP: Create Item in Content Pipeline
    SP-->>n8n: Item Created
    n8n-->>Copilot: Success
    Copilot->>User: "Idea saved to backlog"
```

## Data Flow: Topic 2 (Develop Authority Brief)
```mermaid
sequenceDiagram
    participant User
    participant Copilot
    participant n8n
    participant GPT
    participant SP as SharePoint
    
    User->>Copilot: "Create a brief"
    Copilot->>n8n: Flow 5: FetchBacklogIdeas
    n8n->>SP: Get Items (Status='Approved for Briefing')
    SP-->>n8n: Top 5 Items
    n8n->>n8n: Format as List
    n8n-->>Copilot: "Title: X | ID: 1\nTitle: Y | ID: 2"
    
    Copilot->>User: Display List
    User->>Copilot: "I want ID 5"
    Copilot->>Copilot: Extract ID using AI
    
    Copilot->>n8n: Flow 6: FetchItemDetails(5)
    n8n->>SP: Get Item by ID
    SP-->>n8n: Title, Summary, Brand
    n8n-->>Copilot: Item Details
    
    Copilot->>GPT: Analyze Intent + Recommend Format
    GPT-->>Copilot: "Comparison Page"
    Copilot->>User: "Recommended: Comparison Page"
    User->>Copilot: Confirms + Adds Differentiator
    
    Copilot->>GPT: Generate Authority Brief
    GPT-->>Copilot: Structured Brief Text
    Copilot->>User: Display Brief
    User->>Copilot: Approves
    
    Copilot->>n8n: Flow 7: UpdateBriefAndStatus(ID, Brief)
    n8n->>SP: Update Item
    SP-->>n8n: Updated
    n8n-->>Copilot: Success
    Copilot->>User: "Brief saved!"
```

## Data Flow: Topic 3 (Produce Investigative Content)
```mermaid
sequenceDiagram
    participant User
    participant Copilot
    participant n8n
    participant GPT
    participant DALLE
    participant SP as SharePoint
    
    User->>Copilot: "Produce content for Brief ID 7"
    Copilot->>n8n: Flow 10: ProduceContent(7)
    
    n8n->>SP: Get Item Details
    SP-->>n8n: Title, Brief, Brand
    n8n->>SP: Get Brand Details
    SP-->>n8n: Persona, Tone, Banned_Tags, Disclaimer
    
    n8n->>GPT: Investigative Writer Prompt<br/>(with all context)
    GPT-->>n8n: HTML Body (h1, h2, p, ul, blockquote)
    n8n->>n8n: Validate: No Banned Tags
    
    n8n->>DALLE: Generate Cover Image
    DALLE-->>n8n: Image URL
    
    n8n->>SP: Fetch CSS Wrapper File
    SP-->>n8n: CSS Template
    
    n8n->>n8n: Replace {{CONTENT}} → HTML<br/>Replace {{COVER_IMAGE_URL}} → Image
    
    n8n->>SP: Create File "Title.html"
    SP-->>n8n: File URL
    
    n8n->>SP: Update Item<br/>(Master_Asset_Link, Status='In Production')
    SP-->>n8n: Updated
    
    n8n-->>Copilot: Success + File Link
    Copilot->>User: "Here is your Master Asset: [Link]"
```
