# Mini Seller Console

A modern lead and sales opportunity management application built with React, TypeScript, and Vite.

## 🚀 Features

### 📊 Lead Management
- **Lead List**: Complete visualization of all leads with detailed information
- **Advanced Filters**: Search by name, company, and filter by status
- **Sorting**: Sort by score, name, or company (ascending/descending)
- **Visual Scores**: Visual score indicators with progress bars
- **Lead Status**: 
  - New
  - Contacted
  - Qualified
  - Unqualified

### 💼 Opportunity Management
- **Lead Conversion**: Transform qualified leads into opportunities
- **Sales Pipeline**: Track opportunities by stage
- **Financial Metrics**: Total pipeline, won value, and active opportunities
- **Opportunity Stages**:
  - Prospecting
  - Qualification
  - Proposal
  - Negotiation
  - Closed Won
  - Closed Lost

### 🎨 Modern Interface
- **Responsive Design**: Interface adaptable for desktop and mobile
- **Reusable Components**: Design system based on shadcn/ui
- **Dark/Light Theme**: Theme support (ready for implementation)
- **Smooth Animations**: Fluid transitions and interactions
- **Visual Feedback**: Loading, error, and success states

### 🌐 Internationalization
- **Multi-language Support**: Portuguese and English
- **Flexible Configuration**: Easy addition of new languages
- **Smart Fallback**: Automatic fallback to default language

## 🛠️ Technologies Used

### Core Framework
- **React 19.1.0** - Main UI library
- **TypeScript 5.8.3** - Static typing
- **Vite 6.3.5** - Build tool and dev server

### UI/UX
- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **shadcn/ui** - Component system
- **Radix UI** - Accessible primitive components
- **Lucide React** - Modern icons
- **Class Variance Authority** - Component variant management

### UI Components
- **Accordion, Alert Dialog, Avatar, Badge, Button**
- **Card, Checkbox, Dialog, Dropdown Menu, Form**
- **Input, Label, Select, Sheet, Table, Tabs**
- **Tooltip, Progress, Separator, Switch**
- **And many other reusable components**

### Advanced Features
- **React Hook Form 7.55.0** - Form management
- **i18next 25.2.1** - Internationalization
- **React Resizable Panels 2.1.4** - Resizable panels
- **Embla Carousel 8.3.1** - Image carousel
- **Sonner 1.7.3** - Toast notifications

### Development
- **ESLint 9.23.0** - Code linting
- **Prettier 3.5.3** - Code formatting
- **TypeScript ESLint** - TypeScript-specific rules
- **Autoprefixer** - Automatic CSS prefixes
- **PostCSS** - CSS processing

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Base components (shadcn/ui)
│   ├── LeadsList.tsx       # Leads list
│   ├── LeadDetailPanel.tsx # Lead details panel
│   └── OpportunitiesList.tsx # Opportunities list
├── i18n/                   # Internationalization setup
│   ├── locales/
│   │   ├── pt/            # Portuguese translations
│   │   └── en/            # English translations
│   └── index.ts
├── lib/                    # Utilities
├── assets/                 # Static resources
└── App.tsx                 # Main component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview the build
npm run preview
```

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Build preview
- `npm run lint` - Linting check
- `npm run lint:fix` - Automatic linting fix

## 🎯 Main Features

### Lead Management
1. **Visualization**: Complete list with essential information
2. **Search**: Search by name or company
3. **Filters**: Filter by lead status
4. **Sorting**: Sort by score, name, or company
5. **Details**: Side panel with complete information
6. **Editing**: Lead data updates
7. **Conversion**: Transformation into opportunity

### Opportunity Management
1. **Creation**: Conversion of qualified leads
2. **Tracking**: Visual sales pipeline
3. **Metrics**: Dashboard with financial indicators
4. **Stages**: Sales progress control
5. **Values**: Currency formatting in BRL

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:
```env
VITE_APP_TITLE=Mini Seller Console
VITE_APP_VERSION=1.0.0
```

### Customization
- **Themes**: Configure in `src/lib/theme.ts`
- **Languages**: Add new languages in `src/i18n/locales/`
- **Components**: Customize in `src/components/ui/`

## 📱 Responsiveness

The application is fully responsive and works perfectly on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🎨 Design System

Based on shadcn/ui with:
- **Colors**: Consistent and accessible palette
- **Typography**: Clear and readable hierarchy
- **Spacing**: Consistent spacing system
- **Components**: Complete and reusable library
- **Accessibility**: Accessible components by default
