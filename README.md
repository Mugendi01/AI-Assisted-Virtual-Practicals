# AI Lab - Practical Science, Without the Barriers

AI Lab is an AI-assisted virtual practical laboratory designed primarily for students in low-resource schools. It provides two learning pathways: Local Lab Mode (adapting practical learning to safe, locally available materials) and Virtual Lab Mode (interactive simulated experiments without physical laboratory equipment).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── home/              # Landing page
│   ├── experiments/       # Experiments listing
│   ├── experiment/[id]/   # Experiment details
│   ├── mode-selection/[id]/ # Learning mode selection
│   ├── local-lab/[id]/    # Local lab interface
│   ├── virtual-lab/[id]/  # Virtual lab interface
│   └── results/[id]/      # Results and completion
├── components/            # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── ProgressBar.tsx
│   └── AIAssistant.tsx
├── data/                  # Mock data and types
│   └── experiments.ts
├── services/              # Business logic
│   ├── experimentService.ts
│   └── aiService.ts
└── public/               # Static assets
```

## 🎯 Features

### Core Functionality
- **Experiment Selection**: Browse and choose science practicals
- **Dual Learning Modes**: Local Lab and Virtual Lab approaches
- **Material Selection**: Choose available materials for local adaptation
- **Virtual Experiments**: Interactive simulations with visual feedback
- **AI Guidance**: Context-aware AI assistant throughout the learning journey
- **Progress Tracking**: Step-by-step progress indicators
- **Results & Feedback**: Detailed scoring and explanations

### Technology Stack
- **Framework**: Next.js 15.5.26 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4.17
- **Language**: TypeScript 5.8.2
- **Validation**: Zod 3.24.2

## 🧪 Flagship Experiment: Acids & Bases

The MVP features a complete Grade 7 chemistry practical:
- Learning objective: Identify acidic and basic substances using indicators
- Virtual lab with interactive beakers and mixing
- Local lab with material adaptation
- AI-powered guidance and feedback
- Progress tracking and results

## 🎨 Design Principles

- Clean, scientific aesthetic with deep blue and cyan accents
- Mobile-first responsive design
- Accessible with proper contrast and keyboard navigation
- Subtle animations and micro-interactions
- Professional but approachable for students

## 🔧 Development

### Adding New Experiments

1. Add experiment data to `data/experiments.ts`
2. Update experiment service logic if needed
3. Create any specific components required
4. Update routing in the app directory

### Customizing AI Responses

Edit `services/aiService.ts` to modify:
- Guidance messages
- Hint generation
- Feedback logic
- Safety warnings

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1280px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🛡️ Safety

The virtual lab includes safety validation:
- Only supported chemical combinations
- Age-appropriate content
- Clear safety notices
- Adult supervision reminders

## 🚀 Future Enhancements

- Authentication and user accounts
- Teacher dashboard and analytics
- Additional experiments (Biology, Physics)
- Offline PWA support
- Curriculum alignment features
- Multi-language support

## 📄 License

This project is part of the AI Lab educational initiative.

## 🤝 Contributing

This is a hackathon MVP project. For collaboration opportunities, please contact the development team.

---

**Tagline**: Learn. Experiment. Discover.

**Core Values**: 🌍 Adapt | 🧪 Experiment | 🤖 Learn
