# CampusHub UI Kit & Design System

## 1. Design Tokens

### Color Palette
- **Primary:** 
  - Base: `#1B98E0` (Blue-teal)
  - Dark: `#0F4C75`
  - Light: `#4AC0FF`
- **Accent:** `#E63946`
- **Neutrals:**
  - `Gray 50`: `#F8F9FA` (Background Secondary)
  - `Gray 100`: `#E9ECEF`
  - `Gray 200`: `#DEE2E6` (Borders)
  - `Gray 300`: `#CED4DA`
  - `Gray 400`: `#ADB5BD`
  - `Gray 500`: `#6C757D`
  - `Gray 600`: `#495057` (Text Secondary)
  - `Gray 700`: `#343A40`
  - `Gray 800`: `#212529`
  - `Gray 900`: `#121416` (Text Primary)
- **Semantic Colors:**
  - Success: `#2ECC71` (bg: `#EAFDF1`)
  - Warning: `#F1C40F` (bg: `#FEF9E7`)
  - Error: `#E74C3C` (bg: `#FDEDEC`)
  - Info: `#3498DB` (bg: `#EAF2F8`)

### Typography
- **Font Family:** `Inter`, sans-serif (Google Fonts)
- **Scale:**
  - `xs`: 12px (0.75rem)
  - `sm`: 14px (0.875rem)
  - `base`: 16px (1rem)
  - `lg`: 18px (1.125rem)
  - `xl`: 20px (1.25rem)
  - `2xl`: 24px (1.5rem)
  - `3xl`: 30px (1.875rem)
  - `4xl`: 36px (2.25rem)
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Line Heights:** Tight (1.25), Normal (1.5), Relaxed (1.75)

### Spacing Scale (4px Base)
- `1`: 4px | `2`: 8px | `3`: 12px | `4`: 16px | `6`: 24px | `8`: 32px | `12`: 48px | `16`: 64px | `24`: 96px

### Border Radius & Shadows
- **Radius:** `sm` (4px), `md` (8px), `lg` (16px), `full` (9999px)
- **Shadows:**
  - `sm`: Subtle element lift
  - `md`: Cards, dropdowns
  - `lg`: Modals, tooltips
  - `xl`: Large floating elements
- **Transitions:** Fast (150ms), Base (250ms), Slow (400ms)

---

## 2. Component Specifications

### Buttons
- **Primary:** Background `#1B98E0`, Text White. Hover: `#0F4C75`.
- **Secondary:** Background White, Border `#DEE2E6`, Text `#121416`. Hover: Background `#F8F9FA`.
- **Ghost:** Transparent Background, Text `#6C757D`. Hover: Background `#E9ECEF`.
- **Danger:** Background `#E63946`, Text White. Hover: darken.
- **Sizes:** `sm` (padding 8px 12px, text sm), `md` (padding 12px 16px, text base), `lg` (padding 16px 24px, text lg).
- **States:** `Disabled` (Opacity 50%, not clickable). `Loading` (Show spinner, retain width).

### Forms (Input, Textarea, Select)
- **Default:** White background, 1px solid `#DEE2E6`, `md` border-radius.
- **Focus:** 1px solid `#1B98E0`, `sm` shadow with primary color glow (e.g., `box-shadow: 0 0 0 3px rgba(27,152,224, 0.2)`).
- **Error:** Border `#E74C3C`, accompanied by red helper text below.
- **Disabled:** Background `#F8F9FA`, opacity 0.7.
- **Labels:** `sm` text size, `Medium` weight, `#495057`.

### Cards
- **Structure:** White background, `md` border-radius, `md` shadow.
- **Event Card:** Image banner on top, Title, Date, Location, Capacity progress bar below.
- **Group Card:** Title, Member count, Description, "Join" button.
- **Stat Card:** Label, Big Number, Icon. Used in Admin Dashboard.
- **Hover State:** Transform `translateY(-2px)`, shadow increases to `lg`, transition `base`.

### Badges / Tags
- **Style:** Small padding (4px 8px), `full` radius, `xs` text size, bold text.
- **Roles:** Admin (Purple bg), Student (Blue bg).
- **Categories/Status:** Upcoming (Success bg), Full (Warning bg), Past (Gray bg).

### Avatar
- **Fallback:** Initials centered, `Primary` background, White text.
- **Sizes:** `sm` (24px), `md` (40px), `lg` (64px). `full` radius.

### Navigation Components
- **Navbar:** Sticky top, White background, bottom border (`#DEE2E6`). Logo left, Links center, User Dropdown/Avatar right. Mobile shows Hamburger menu.
- **Sidebar (Dashboard):** Left-anchored, 240px width on desktop. Links have `Ghost` button style, `Primary` style when active.
- **Dropdown Menu:** Floating container, `md` shadow, `md` radius, white bg. List items hover with `#F8F9FA` bg.

### Feedback Components
- **Modal / Dialog:** Fixed overlay (black 50% opacity), centered white container, `lg` shadow, `lg` radius. Includes Header, Body, Footer (action buttons).
- **Toast / Notification:** Fixed bottom-right. Sliding in. Semantic colors applied to left border.
- **Skeleton Loader:** Pulse animation on gray blocks (`#E9ECEF` to `#DEE2E6`), matching layout shapes.

---

## 3. Page Layouts

- **Home / Landing:** Large hero section with primary Call to Action. Features grid (3 columns). Generous whitespace (`96px` section padding).
- **Events / Groups List:** Header with search/filters. Grid layout (`1 column` mobile, `2 columns` tablet, `3 columns` desktop).
- **Detail Pages (Event/Group):** 
  - Left column (2/3 width): Main image, title, description, discussion.
  - Right column (1/3 width): Sticky card with key info (date, location, capacity, register/join action).
- **Forms (Create/Edit):** Centered max-width container (600px). Clean form fields, inline validation.
- **Dashboards (Student & Admin):**
  - Desktop: Sidebar navigation (left), main content area (right).
  - Mobile: Hidden sidebar (accessible via navbar hamburger), main content full width.
  - Content: Grid of Stat cards at the top, lists/tables below.
- **Auth (Login/Register):** Split screen (Desktop): Left side branding/image, Right side centered form card.

---

## 4. UI States

- **Loading State:** Use Skeleton loaders for data-heavy sections (Cards, Lists, Detail pages). Use inline spinners inside Buttons for form submissions.
- **Empty State:** Centered illustration or icon (`Gray 300`), heading (`text-xl`), and supportive text (`text-base`, `text-secondary`). Include a primary Call to Action (e.g., "Create your first event").
- **Error State:** Centered warning icon (`Error` color), heading "Something went wrong", and a "Try Again" button. Inline form errors use red helper text.
- **Success State:** Redirect to appropriate page with a Success Toast notification, OR show a centered success graphic for major actions (like Registration complete).

---

## 5. Responsive Breakpoints

- **Mobile:** `<768px` (Fluid widths, stacked columns, hamburger menu, larger touch targets).
- **Tablet:** `768px – 1024px` (2-column grids, padding adjustments).
- **Desktop:** `>1024px` (Max container widths, sidebars, multi-column layouts, hover effects).

---

## 6. Navigation Hierarchy

### Public View
- Home
- Events
- Groups
- Login / Register

### Student View (Logged In)
- Home
- Events
- Groups
- Dashboard (Upcoming Events, My Groups)
- Profile Dropdown (Settings, Logout)

### Admin View
- Home
- Events
- Groups
- Dashboard
- Admin Panel (Platform Stats, User Management, Event Moderation)
- Profile Dropdown (Logout)
