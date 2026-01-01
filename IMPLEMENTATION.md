# Ara OS — Dashboard Mock UI Implementation

This repository contains my implementation of the mock screen provided as part of the Ara OS interview coding exercise. The goal of this exercise was to implement the UI for the dashboard screen using the existing React Router SaaS template, matching the design language of the app while keeping functionality minimal.

Here is an explanation of how I would implement it in a real feature.


## 🚀 How I WOULD Implement Real Logic (If This Were Production)

Below is how I’d evolve this page from UI → real feature.

### Data Model (Conceptual)

**Events / Calendar**

```
events (table)
- id
- organization_id
- title
- starts_at
- ends_at
- duration
- created_by
```

**AI Assistant Context**

```
ai_sessions
ai_messages
```

**Agenda Tasks**

```
agenda_items
- id
- user_id
- text
- completed
- due_date
```

**Funnel / Urgent Alerts**

```
funnel_alerts
- id
- title
- body
- severity
- created_at
```

---

### Data Flow

1. API routes provide JSON payloads:

   * `/api/calendar`
   * `/api/agenda`
   * `/api/assistant/context`
   * `/api/funnel/alerts`

2. Frontend uses React Router loaders to fetch.

3. AI Assistant “Send” button would:

   * POST message
   * Stream AI response
   * Persist to session history
  
4. Contextual Actions would:

  - Schedule Interview:
    * open a modal to show a Date Picker 
    * select a date and hit submit button
    * POST new date for interview 
    * return response to the user via toast message
  
  - Summarize Candidate:
    * POST candidate in question to the API
    * Stream AI response
    * Persist to session history
    
  - Send to Marketplace
    * POST intent to the API
    * return response to the user via toast message

  - Move to Next Stage
    * POST candidate in question to the API
    * Stream AI response
    * Move candidate in question to the next stage
    * Persist to session history

5. Urgent Funnel Update:

  - Send Reminder:
    * POST alert `id` to API
    * The API send an email to the people involved
    * return response to the user via toast message

6. Daily Agenda:

  - Update agenda:
    * User Local state to track checkbox for quick User friendly update
    * On check the local state is updated to persist the UI
    * POST request to the API passing the agenda_item `id` and the updated `completed` state.
    * Disable the Checkbox while the API is awaiting a response 
    * Return response to the user via toast message
    * Enable the checkbox


---

### State Handling

* **Server state** via loaders
* **Local UI state** for toggles and selection
* Cache invalidation on interaction (mutations)

I would not introduce global state unless multiple routes needed shared data.


---

The code remains clean, testable, and intentionally UI-focused — leaving room for backend integration later.
