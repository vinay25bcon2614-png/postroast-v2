# PostRoast v2 - Implementation Roadmap

## Phase 1: UI Foundation (Week 1-2)
Build the premium interface that will house the AI engine.

### Core Files to Build:
1. `/ui/components/` - Premium React components
2. `/ui/layouts/` - 3-panel layout system
3. `/ui/pages/` - Main workflow pages

## Phase 2: Goal System (Week 2-3)
Implement goal-based logic that drives all AI decisions.

### Core Files:
1. `/system/goals/` - Goal definitions and priority logic
2. `/system/category-mapping/` - Map goals to content categories
3. `/prompts/` - Dynamic prompts based on goals

## Phase 3: Creator Templates (Week 3-4)
Train the system on real creator patterns.

### Core Files:
1. `/data/templates/` - Category-specific templates
2. `/data/creators/` - Creator DNA profiles
3. `/analysis/` - Pattern extraction logic

## Phase 4: AI Rewriting Engine (Week 4-5)
Build the smart rewrite system.

### Core Files:
1. `/ai/scoring/` - Multi-dimensional post analysis
2. `/ai/rewriting/` - Goal-aware post generation
3. `/ai/voice-matching/` - User style DNA

## Phase 5: Full Integration (Week 5-6)
Connect everything together.

---

# File Structure Overview

```
postroast-v2/
├── src/
│   ├── ui/                          # Premium UI components
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   ├── system/
│   │   ├── goals/                  # Goal system (GET_CLIENTS, GROW_AUDIENCE, etc)
│   │   ├── category-mapping/       # Which templates to use for each goal
│   │   └── scoring/                # Analysis & scoring logic
│   ├── prompts/                     # Claude prompts for each goal
│   │   ├── get-clients/
│   │   ├── grow-audience/
│   │   └── authority/
│   ├── data/
│   │   ├── templates/              # Creator templates by category
│   │   │   ├── get-clients.json
│   │   │   ├── grow-audience.json
│   │   │   └── authority.json
│   │   └── creators/               # Creator DNA profiles
│   └── ai/
│       ├── rewriting/              # Smart rewrite engine
│       └── voice-matching/         # Style DNA system
└── docs/
    ├── GOAL_SYSTEM.md
    ├── CATEGORY_TEMPLATES.md
    └── IMPLEMENTATION.md
```

---

# Next Steps

1. **Start with UI** - Build the premium interface first
2. **Define Goal System** - Create the logic that routes users
3. **Create Templates** - Extract patterns from your creator data
4. **Build Prompts** - Write Claude prompts for each goal
5. **Integrate AI** - Connect everything together

Each file below represents a complete, production-ready component.
