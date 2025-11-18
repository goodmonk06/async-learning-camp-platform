# Async Learning Camp Platform

A comprehensive learning management platform for bootcamps, online courses, and corporate training programs. Features AI-powered feedback, camp curriculum design assistance, and mentor review workflows.

## 📋 Overview

This platform enables educators to run asynchronous learning programs with structured modules and missions. Key differentiators include:

- **AI-Powered Feedback**: Automatic feedback generation using OpenAI API for instant student guidance
- **Camp Designer**: AI-assisted curriculum generation from learning goals
- **Flexible Architecture**: Support for bootcamps, online courses, corporate training, and learning communities
- **Mentor Tools**: Dedicated review interface for efficient feedback management
- **Type-Safe API**: End-to-end type safety with tRPC

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **AI**: OpenAI API (GPT-4)
- **Testing**: Vitest, Testing Library
- **DevOps**: Docker, Docker Compose

## 🗂️ Domain Model

```
Camp (Learning program)
├── Module (Course section/unit)
│   └── Mission (Assignment/task)
│       └── Submission (Student work)
│           ├── AI Feedback (auto-generated)
│           └── Mentor Feedback (manual review)
└── Enrollment (Participant registration)
    ├── Mentor (instructor role)
    └── Learner (student role)
```

### Core Entities

- **Camp**: Top-level learning program with start/end dates and visibility settings
- **Module**: Organized sections within a camp (e.g., "Week 1: React Basics")
- **Mission**: Individual assignments with descriptions, due dates, and AI rubrics
- **Enrollment**: User participation with role-based access (mentor/learner)
- **Submission**: Student work submissions with status tracking and feedback

## 🏃 Getting Started

### Requirements

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional but recommended)

### Quick Start (Docker)

1. **Clone and setup environment**:
   ```bash
   git clone <repo-url>
   cd async-learning-camp-platform
   cp .env.local.example .env.local
   ```

2. **Configure environment variables** in `.env.local`:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/async_learning_camp?schema=public"
   OPENAI_API_KEY="sk-..."  # Your OpenAI API key
   ```

3. **Start with Docker Compose**:
   ```bash
   docker compose up -d
   ```

4. **Run migrations and seed**:
   ```bash
   docker compose exec app npx prisma migrate deploy
   docker compose exec app npm run db:seed
   ```

5. **Access the application**:
   - Application: http://localhost:3000
   - Database: localhost:5432

### Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup database**:
   ```bash
   # Start PostgreSQL (if using Docker)
   docker compose up postgres -d

   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed demo data
   npm run db:seed
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

### All-in-One Setup

```bash
npm run setup
```

This command runs: `npm install && prisma generate && prisma db push && npm run db:seed`

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database (warning: deletes all data) |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | View application logs |
| `npm run setup` | Complete setup (install + db + seed) |

## 🎯 Example Flow: Complete Vertical Slice

### Demo Scenario: React Bootcamp

After running `npm run db:seed`, you'll have a fully functional demo with:

**Camp**: "React実践ブートキャンプ 2024"
- **Module 1**: React基礎
  - Mission: Reactコンポーネントの作成
  - Mission: useStateフックの理解
- **Module 2**: フォームとデータ管理
  - Mission: フォームバリデーション
- **Module 3**: APIとの連携
  - Mission: REST API連携

**Demo Users**:
- Mentor: `mentor@example.com`
- Learner 1: `learner1@example.com` (has submitted work)
- Learner 2: `learner2@example.com`

### Try It Out

1. **View Camps**: Visit http://localhost:3000/camps
   - See active and past camps
   - Click on "React実践ブートキャンプ 2024"

2. **Explore Missions**:
   - View organized modules and missions
   - Click on any mission to see details

3. **Submit Work**:
   - Enter submission content in the form
   - Click "提出する" (Submit)
   - AI feedback is generated automatically

4. **Mentor Review**: Visit http://localhost:3000/mentor/review
   - See pending submissions
   - Add manual feedback and scores
   - AI feedback is shown as reference

5. **Design New Camp**: Visit http://localhost:3000/camp-designer
   - Enter learning goal, duration, and target audience
   - AI generates complete curriculum with modules and missions
   - Create camp directly from generated design

## 🎓 Use Cases

### 1. Offline Bootcamps (2 days - 1 week)
**Target**: Intensive programming bootcamps, hackathons, skill-up camps

**How to use**:
- Create short-duration camps (e.g., 2-day intensive)
- Structure with 5-10 missions
- Mentors provide real-time feedback on-site
- Historical record maintained for reference

**Example**: Weekend React Bootcamp with daily missions and live mentor support

### 2. Online Courses (1-3 months)
**Target**: Online programming schools, professional reskilling programs

**How to use**:
- Set up weekly or module-based structure
- Students submit at their own pace
- AI provides instant 24/7 feedback
- Mentors add periodic human review
- Track progress and engagement

**Example**: 12-week Full-Stack Development Course with async learning

### 3. Corporate Training (1 week - several months)
**Target**: New hire onboarding, engineer upskilling, tech update training

**How to use**:
- Design company-specific curriculum
- Run parallel training across teams
- Centralized submission and feedback management
- Reduce mentor workload with AI assistance
- Reusable training materials

**Example**: Q1 New Engineer Onboarding Program for 20 hires

### 4. Learning Communities (ongoing)
**Target**: Programming communities, study groups, continuous learning salons

**How to use**:
- Create long-term camps (3 months - 1 year)
- Add monthly theme modules
- Peer learning environment
- Regular challenge missions
- Community knowledge sharing

**Example**: Year-long Advanced Frontend Development Community

## 🔑 API Examples

### Create a Camp

```typescript
const camp = await trpc.camp.create.mutate({
  title: "Web Development Bootcamp",
  description: "Learn modern web development in 8 weeks",
  startDate: new Date("2024-12-01"),
  endDate: new Date("2025-01-31"),
  visibility: "public"
});
```

### Submit Mission Work

```typescript
const submission = await trpc.submission.create.mutate({
  missionId: "mission-123",
  userId: "user-456",
  content: "# My Solution\n\n Here's my implementation..."
});
// AI feedback is generated automatically
```

### Generate Camp Curriculum with AI

```typescript
const design = await trpc.designer.generateDesign.mutate({
  goal: "Learn React and build production-ready applications",
  duration: "4 weeks",
  targetAudience: "Junior developers with JavaScript knowledge"
});

// Create camp from design
const camp = await trpc.designer.createFromDesign.mutate({
  ...design,
  startDate: new Date("2024-12-01"),
  endDate: new Date("2024-12-31")
});
```

## 🧪 Testing

Tests are written with Vitest and cover:

- **Validation**: Zod schema validation for all entities
- **Business Logic**: Camp duration calculation, active status checks
- **AI Integration**: Mock tests for AI design and feedback

Run tests:
```bash
npm test                 # Run once
npm run test:watch       # Watch mode
```

Example test:
```typescript
it('should validate camp data', () => {
  const camp = {
    title: 'React Bootcamp',
    description: 'Learn React',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
    visibility: 'public'
  };

  const result = campSchema.safeParse(camp);
  expect(result.success).toBe(true);
});
```

## 🔮 Future Extensions

- [ ] **Authentication**: NextAuth.js integration for user management
- [ ] **Real-time Updates**: WebSocket/Ably for live notifications
- [ ] **File Uploads**: Support for image/document submissions
- [ ] **Discussion Forums**: Mission-specific Q&A and chat
- [ ] **Progress Dashboard**: Visual analytics for learners and mentors
- [ ] **Certificates**: Automated certificate generation on completion
- [ ] **Export Tools**: PDF/CSV export for submissions and feedback
- [ ] **Mobile App**: React Native companion app
- [ ] **Video Integration**: Embedded video lessons and recordings
- [ ] **Peer Review**: Student-to-student feedback workflows
- [ ] **Gamification**: Points, badges, and leaderboards
- [ ] **Multi-language**: i18n support for global audiences

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review the demo data for usage examples

---

Built with ❤️ for educators and learners worldwide.
