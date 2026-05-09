# PostRoast v2 - Complete Implementation Strategy

## Overview
You're building a **LinkedIn AI rewriting engine that is NOT generic**. Instead of one "best practice" approach, PostRoast adapts based on what the user actually wants.

---

## The Core Problem You're Solving

**Current State:** PostRoast is a basic GPT wrapper
- User pastes post
- Generic analysis happens
- Generic rewrite is returned
- No reason to come back

**Why People Won't Pay:**
- They could use ChatGPT for free
- The rewrite feels generic
- No learning or progress tracking
- No competitive advantage gained

**What Makes People PAY:**
- Results. Specific results.
- Understand THEIR goal (clients vs audience vs authority)
- Templates that actually work in their niche
- Seeing their scores improve over time
- Feeling like the AI "gets" their voice

---

## The Solution: Goal-Driven Architecture

### 1. **Goal System** (The Foundation)
Every user picks ONE primary goal:
- 🎯 **Get Clients** - Attract inbound leads
- 📈 **Grow Audience** - Build personal brand
- 💡 **Thought Leader** - Establish authority
- ⚖️ **Balanced** - Mix of everything

**Why this matters:**
- A "Get Clients" post needs different scoring than a "Grow Audience" post
- Justin Welsh's posts wouldn't work for Alex Hormozi's audience
- The AI rewrites toward the user's actual goal, not generic "engagement"

### 2. **Category Templates** (The Training Data)
You have 4 creators in 4 categories:
- Inbound Leads: Justin Welsh, Alex Hormozi, Chris Orlob, Matt Gray
- Audience Growth: Lara Acosta, Jasmin Alic, Steven Bartlett, Lenny Rachitsky
- Authority: Lenny Rachitsky, Packy McCormick
- Storytelling: George Mack, Nicolas Cole, Eddie Shleyner, Sahil Bloom

**How this works:**
- Each creator has a signature structure
- Justin opens with emotional truth → Alex uses specific results → Chris uses research
- Template system learns: "For Get Clients, start with specific pain"
- Templates become prompts for Claude

### 3. **Dynamic Prompts** (The AI Engine)
Claude gets different instructions based on:
- User's goal
- Their industry/niche
- Their audience
- Their current style

**Example:**
```
Goal: Get Clients
Industry: SaaS Sales
Audience: B2B founders
Voice: Direct, no-BS, slightly sarcastic

Prompt: Rewrite this to attract your ideal client.
Open with the specific problem they face.
Use 1 concrete example. End with clear CTA.
```

### 4. **Goal-Aware Scoring** (The Feedback)
Scoring changes based on goal:

**For "Get Clients" posts:**
- Hook strength: 25% (CRITICAL - need to stop scrollers)
- Specificity: 25% (Show you know their exact problem)
- Authority: 20% (Prove you've solved this)
- CTA: 15% (Clear next step)
- Originality: 15% (Stand out)

**For "Grow Audience" posts:**
- Relatability: 25% (Make them feel seen)
- Hook: 20% (Stop scrollers)
- Storytelling: 25% (Narrative power)
- Controversy: 15% (Generate discussion)
- Originality: 15%

---

## How to Build This (Step-by-Step)

### Phase 1: UI Foundation (FIRST)
Build the premium interface because:
- Users need to see themselves making progress
- Goal selection must be obvious
- Scoring display must be goal-aware
- Rewrite panel must highlight improvements

**Key Components:**
1. Goal selector (4 buttons at top)
2. Post composer
3. Multi-dimensional score display (bars showing each metric)
4. Rewrite comparison (original vs improved)
5. Progress tracker (score history over time)

### Phase 2: Goal & Template System
Wire up the logic:
```
User selects goal → 
  Find matching templates → 
  Load template-specific prompts → 
  Calculate goal-specific weights → 
  Score post against those weights → 
  Generate goal-aware rewrite
```

### Phase 3: Claude Integration
Each goal gets different prompts:
- **Get Clients:** "Open with their specific pain"
- **Grow Audience:** "Tell a relatable story"
- **Authority:** "Lead with counterintuitive insight"
- **Balanced:** "Multiple entry points"

### Phase 4: Progress & Learning
Add the sticky features:
- Score trend (show monthly improvement)
- Streak (daily posting habit)
- Leaderboard (anonymous comparison)
- Style DNA (learns their voice after 5-10 posts)

---

## Key Files & Their Purpose

### `src/system/goals/index.ts`
Defines the 4 goals and their characteristics:
- Scoring weights
- Best templates for each goal
- Rewrite guidance
- What to emphasize

### `src/data/templates/categories.ts`
Templates for each goal based on creator analysis:
- For GET_CLIENTS: Justin Welsh structure, Alex Hormozi structure, etc.
- For GROW_AUDIENCE: Lara Acosta structure, Jasmin structure, etc.
- Pattern extraction: What successful posts do

### `src/prompts/index.ts`
Claude prompts for:
- Scoring posts (analyzes against goal-specific weights)
- Rewriting for each goal (different instruction for each)
- Voice matching (learns user style over time)

### `src/ui/` (To Build)
Components for:
- Goal selector
- Post composer
- Score display (goal-aware)
- Rewrite panel
- Progress dashboard

---

## The Competitive Advantage

**Why people will pay for this:**

1. **Specific Results** - "My hook score went from 42 → 67"
2. **Goal Clarity** - "I'm not trying to go viral, I'm trying to get clients"
3. **Template Power** - "Here's how Justin Welsh structures it"
4. **Learning** - "My writing is improving measurably"
5. **Leverage** - "This is like having a copywriting coach"

**Why they'll stick around:**
- Habit loop (daily streaks)
- Social proof (leaderboard)
- Progress tracking
- Style DNA learns them
- Works with their actual goals

---

## Implementation Priority

### Week 1: Foundation
- [ ] Build goal system (goals/index.ts)
- [ ] Create templates (templates/categories.ts)
- [ ] Write prompts (prompts/index.ts)
- [ ] Design UI layout (3-panel premium design)

### Week 2: Integration
- [ ] Connect goal selector to templates
- [ ] Build Claude scoring integration
- [ ] Build Claude rewrite integration
- [ ] Test end-to-end flow

### Week 3: Refinement
- [ ] Add progress tracking
- [ ] Add style DNA logic
- [ ] Polish UI/UX
- [ ] Test with real posts

### Week 4: Launch Features
- [ ] Add leaderboard
- [ ] Add streak tracking
- [ ] Add format library
- [ ] Premium pricing page

---

## What Makes This Different

**Current Tools:**
- ChatGPT: Generic, one-size-fits-all
- Basic roast tools: Single scoring system
- Generic templates: No personalization

**PostRoast v2:**
- Goal-driven (Get Clients ≠ Grow Audience)
- Creator-trained (Real patterns from successful posts)
- Progress-focused (See improvement over time)
- Personalized (Learns your voice, adapts to your niche)

---

## Next Immediate Steps

1. **Build the UI first** - Users need to see the goals clearly
2. **Wire up the goal system** - Make goals actually change behavior
3. **Test with real posts** - Verify the scoring weights work
4. **Iterate on prompts** - Make sure rewrites sound human
5. **Add progress tracking** - Make the habit loop work

The foundation you've created is solid. Now execute on the UI and goal system, and the rest becomes obvious.

**Start with:** Building the premium 3-panel interface with clear goal selection. Everything else cascades from there.
