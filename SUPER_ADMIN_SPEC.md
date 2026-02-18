# Super Admin Panel - Full Specification

## Current Status (2026-02-18)

**Implemented:**
- ✅ Super Admin route at `/admin-baber`
- ✅ Role-based authentication (super_admin role)
- ✅ Basic UI with Companies tab
- ✅ 4 tabs structure: Companies, Users, Settings, AI Assistant
- ✅ Stats cards showing company/user counts

**To Implement:**
1. User Management (full CRUD)
2. Global Settings & AI Configuration
3. AI Assistant with database/GitHub integration

---

## 1. User Management Tab

### Features
- **List all users** across all companies
- **Create new users** with role assignment
- **Edit existing users** (email, name, role, company)
- **Delete users** with confirmation
- **Filter by role** (super_admin, company_admin, user)
- **Search users** by name/email

### UI Components
```
┌─────────────────────────────────────────────┐
│  User Management          [+ Add User]      │
├─────────────────────────────────────────────┤
│                                             │
│  Table:                                     │
│  ┌────────────────────────────────────────┐ │
│  │ Name │ Email │ Role │ Company │ Actions││
│  ├──────┼───────┼──────┼─────────┼────────┤│
│  │Israel│israel@│Super │    —    │ ✏️  🗑️  ││
│  │      │baber..│Admin │         │        ││
│  ├──────┼───────┼──────┼─────────┼────────┤│
│  │Scott │scott@ │Comp. │Iron Horse│ ✏️  🗑️ ││
│  │      │baber..│Admin │         │        ││
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### User Modal Fields
- **Name** (text input)
- **Email** (email input)
- **Password** (password input, only for new users)
- **Role** (dropdown: super_admin, company_admin, user)
- **Company** (dropdown, only if role is company_admin or user)

### State Management
```typescript
const [users, setUsers] = useState<User[]>([]);
const [showUserModal, setShowUserModal] = useState(false);
const [editingUser, setEditingUser] = useState<User | null>(null);
```

### Handlers
- `handleAddUser()` - Open modal with empty user
- `handleEditUser(user)` - Open modal with existing user
- `handleSaveUser()` - Create or update user
- `handleDeleteUser(userId)` - Delete with confirmation

---

## 2. Global Settings & AI Configuration Tab

### Sections

#### A. AI API Configuration
**Purpose:** Store API keys for system-wide AI features

Fields:
- **OpenAI API Key** (password input)
  - Used for: GPT-4o, Whisper transcription
  - Placeholder: `sk-...`
  
- **Anthropic API Key** (password input)
  - Used for: Claude Opus/Sonnet
  - Placeholder: `sk-ant-...`

#### B. Database Configuration (Supabase)
**Purpose:** AI Assistant database access

Fields:
- **Supabase Project URL** (text input)
  - Example: `https://your-project.supabase.co`
  
- **Supabase Anon Key** (password input)
  - Public key for client-side access
  - Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  
- **Supabase Service Role Key** (password input)
  - Server-side admin key
  - Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### C. GitHub Repository Configuration
**Purpose:** AI Assistant repo access for system updates

Fields:
- **GitHub Repository URL** (text input, pre-filled, read-only)
  - Value: `https://github.com/nocodeuser1/iron-horse-tracker`
  
- **GitHub Personal Access Token** (password input)
  - For AI to read repo structure
  - Placeholder: `ghp_...`
  - Permissions needed: `repo` (read)

### Save Button
- **Save Settings** button at bottom
- Shows success message on save
- Stores in localStorage (for now, later in Supabase)

### State Management
```typescript
const [aiSettings, setAiSettings] = useState({
  openaiKey: '',
  anthropicKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseServiceKey: '',
  githubRepo: 'https://github.com/nocodeuser1/iron-horse-tracker',
  githubToken: '',
});
```

---

## 3. AI Assistant Tab

### Purpose
Super Admin can:
- **Chat with AI** that has access to database schema and GitHub repo
- **Upload client permit PDFs** for automatic extraction
- **Get help** with system updates and database operations
- **Process permits** to update individual company accounts

### UI Layout
```
┌─────────────────────────────────────────────┐
│  AI Assistant                               │
├─────────────────────────────────────────────┤
│  ℹ️ AI Assistant has access to database,   │
│     GitHub repo, and can process PDFs       │
├─────────────────────────────────────────────┤
│  📤 Upload Client Permit (PDF)             │
│  ┌─────────────────────────────────────┐   │
│  │  Drag & drop or click to upload    │   │
│  │  PDF files only                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [file.pdf (125 KB)] [×]                    │
├─────────────────────────────────────────────┤
│                                             │
│  Chat Messages:                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │  [User message]                     │   │
│  │                                     │   │
│  │          [AI response]              │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Type your message...          ] [Send]   │
└─────────────────────────────────────────────┘
```

### Features

#### File Upload
- Accept only PDF files
- Show file name and size
- Remove button to clear upload
- After upload, AI can extract permit data

#### Chat Interface
- **User messages:** Right-aligned, burgundy gradient background
- **AI messages:** Left-aligned, dark background
- **Empty state:** Shows placeholder message
- **Input:** Text field + Send button
- **Enter key:** Sends message

#### AI Capabilities (when connected)
- **Database access:** Query Supabase tables
- **GitHub access:** Read repo structure, files, commits
- **PDF processing:** Extract permit requirements
- **System help:** Answer questions about architecture
- **Account updates:** Add/modify permit data for companies

### State Management
```typescript
const [aiMessages, setAiMessages] = useState<{
  role: 'user' | 'assistant';
  content: string;
}[]>([]);
const [aiInput, setAiInput] = useState('');
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
```

### Handlers
- `handleSendMessage()` - Send user message to AI
- `handleFileUpload(e)` - Accept and store PDF file
- `handleRemoveFile()` - Clear uploaded file

### AI Prompt Context
When AI is connected, include in system prompt:
```
You are a Super Admin AI assistant for VisualPermit.com.

You have access to:
- Supabase database (credentials in settings)
- GitHub repo: https://github.com/nocodeuser1/iron-horse-tracker
- Uploaded permit PDFs for processing

Your capabilities:
1. Answer questions about database schema
2. Help with system updates and architecture
3. Extract permit requirements from uploaded PDFs
4. Update company accounts with new permit data
5. Provide guidance on feature implementation

Current database: [fetch from settings]
Current repo: [fetch from settings]
Uploaded file: [if any]
```

---

## Implementation Priority

### Phase 1 (Immediate)
1. ✅ Create tab structure
2. ✅ Add state management
3. 🔲 Implement User Management table + CRUD
4. 🔲 Create User Modal (add/edit)

### Phase 2 (Next)
1. 🔲 Implement Settings tab with all fields
2. 🔲 Add save/load settings from localStorage
3. 🔲 Pre-fill GitHub repo URL

### Phase 3 (Final)
1. 🔲 Implement AI Assistant chat UI
2. 🔲 Add PDF upload functionality
3. 🔲 Connect AI (OpenAI/Anthropic API)
4. 🔲 Implement AI context with database/GitHub info

---

## File Structure

```
src/pages/
├── SuperAdmin.tsx          # Main component
└── components/
    ├── UserModal.tsx       # Add/Edit user modal
    ├── SettingsForm.tsx    # Settings configuration
    └── AIChat.tsx          # AI assistant chat interface
```

---

## Security Notes

1. **API Keys:** Store securely (environment variables in production)
2. **Service Role Key:** Never expose to client-side code
3. **GitHub Token:** Minimal permissions (read-only for repo)
4. **User Passwords:** Hash before storing (bcrypt)
5. **Super Admin Access:** Route protected by role check

---

## Integration Points

### Supabase Tables (Future)
- `users` - Store user accounts
- `companies` - Store company data
- `permits` - Store permit requirements
- `settings` - Store global configuration

### AI Integration
- **OpenAI:** For GPT-4o chat, Whisper transcription
- **Anthropic:** For Claude Opus/Sonnet (alternative)
- **PDF Processing:** AI vision models to extract permit data

### GitHub Integration
- Read repo files for AI context
- Provide code examples to AI
- Help with system updates

---

## Pre-filled Values

**GitHub Repo:**
```
https://github.com/nocodeuser1/iron-horse-tracker
```

**Supabase:**
- URL: `[to be configured]`
- Anon Key: `[to be configured]`
- Service Key: `[to be configured]`

**AI Keys:**
- OpenAI: `[to be configured]`
- Anthropic: `[to be configured]`
- GitHub Token: `[to be configured]`

---

**Last Updated:** 2026-02-18
**Status:** Specification Complete - Ready for Implementation
