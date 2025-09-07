# BloomPoint - Learning & Career Platform

A comprehensive gamified learning and career development platform built with modern web technologies. BloomPoint combines educational resources, job opportunities, community features, and wellness tools to create an all-in-one platform for professional growth.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Shadcn/ui
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: Clerk (complete user management)
- **File Storage**: Cloudinary (optional)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB database (local installation or MongoDB Atlas)
- Clerk account for authentication setup

## ⚡ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SRH-64637/BloomPoint.git
cd bloompoint
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MongoDB_URI=mongodb://localhost:27017/bloompoint
# OR for MongoDB Atlas:
# MongoDB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloompoint

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/camp
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/camp

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application
- Open your browser and navigate to `http://localhost:3000` (or the port shown in terminal)
- The application will automatically connect to your MongoDB database
- Create an account or sign in using Clerk authentication
- After authentication, you'll be redirected to the main dashboard at `/camp`

## 📖 Page Functionality

### 🏠 Core Pages

#### **Home Page (`/`)**
- **Purpose**: Landing page introducing BloomPoint
- **Features**: 
  - Hero section with platform overview
  - Feature highlights and benefits
  - Call-to-action buttons for registration
  - Responsive design with modern animations

#### **Camp Dashboard (`/camp`)**
- **Purpose**: Main user dashboard after authentication
- **Features**:
  - XP tracking and level progression
  - Quick access cards to all platform features
  - Achievement badges and progress indicators
  - Personalized welcome message
  - Navigation to Skills, Jobs, Lounge, and Wellness sections

#### **Skills Hub (`/skills`)**
- **Purpose**: Central hub for all learning resources
- **Features**:
  - Browse all available learning content
  - Filter by resource type (courses, blogs, videos)
  - Tag-based filtering system
  - Search functionality
  - Create new resources (authenticated users only)
  - Resource cards with thumbnails, descriptions, and metadata

#### **Jobs Board (`/jobs`)**
- **Purpose**: Job posting and application platform
- **Features**:
  - Browse job listings with detailed information
  - Filter by location, salary range, experience level
  - Job details including required skills and qualifications
  - Apply to jobs with cover letter and resume
  - Create job postings (authenticated users)
  - Application status tracking
  - Company information and job requirements

#### **Community Lounge (`/lounge`)**
- **Purpose**: Community forum for discussions and networking
- **Features**:
  - Create and view discussion posts
  - Comment on posts and engage with community
  - React to posts with likes/reactions
  - User profiles and interaction history
  - Topic-based discussions
  - Real-time updates and notifications

#### **Wellness Center (`/wellness`)**
- **Purpose**: Mental health and wellness tools
- **Features**:
  - Personal journal entries (create, edit, view, delete)
  - Breathing exercises with guided animations
  - Positive affirmations with shuffle functionality
  - One-minute meditation timer
  - Mood tracking and wellness logs
  - Private and secure journal storage

#### **User Profile (`/profile`)**
- **Purpose**: Personal profile and achievement tracking
- **Features**:
  - User information and statistics
  - Achievement badges and progress
  - XP history and level progression
  - Created resources and contributions
  - Personal settings and preferences

### 🎯 Resource Management

#### **Skills Pages**
- **All Skills (`/skills`)**: Browse all learning resources with filtering
- **Courses (`/skills/courses`)**: Dedicated course catalog with enrollment
- **Blogs (`/skills/blogs`)**: Article library with reading progress
- **Videos (`/skills/videos`)**: Video collection with playback features
- **My Courses (`/skills/my-courses`)**: Personal enrolled courses dashboard

#### **Resource Creation (Authenticated Users Only)**
- **Create Blog (`/skills/create-blog`)**: 
  - Rich text editor for article writing
  - Tag management and categorization
  - SEO-friendly URL generation
  - Draft saving and publishing workflow

- **Create Course (`/skills/create-course`)**:
  - Link external courses from platforms
  - Course metadata and descriptions
  - Difficulty level and duration settings
  - Thumbnail and preview management

- **Create Video (`/skills/create-video`)**:
  - Upload video files or embed URLs
  - Support for YouTube, Vimeo, and direct uploads
  - Video descriptions up to 1000 characters
  - Duration tracking and metadata
  - Thumbnail generation and management

- **Create Multi-Video Course (`/skills/create-multi-video`)**:
  - Comprehensive course creation with multiple lessons
  - Lecture ordering and organization
  - Progress tracking and completion status
  - Course curriculum management

### 💼 Job Management

#### **Job Creation (`/jobs/create`)**
- **Purpose**: Post new job opportunities
- **Features**:
  - Detailed job descriptions and requirements
  - Salary range and location settings
  - Required skills and experience levels
  - Application deadline management
  - Company information and branding

#### **Job Applications**
- **Purpose**: Apply to posted positions
- **Features**:
  - Cover letter and resume submission
  - Application status tracking
  - Interview scheduling integration
  - Communication with employers
  - Application history and management

## 🔐 Authentication

BloomPoint uses **Clerk** for complete user authentication and management.

### Authentication Features
- **Sign Up/Sign In**: Secure user registration and login
- **Social Login**: Support for Google, GitHub, and other providers
- **Email Verification**: Automatic email verification for new accounts
- **Password Reset**: Self-service password recovery
- **User Profiles**: Automatic profile creation and management

### Protected Routes
The following actions require user authentication:
- Creating any content (blogs, videos, courses, jobs)
- Applying to jobs
- Writing journal entries
- Participating in community discussions
- Accessing personal dashboard and profile

### Public Access
These pages are accessible without authentication:
- Home page (`/`)
- Browse skills, courses, blogs, videos
- View job listings
- Read community posts (view only)

## 🔌 API Overview

### Core API Endpoints

#### **Resources API (`/api/resources`)**
- `GET /api/resources` - List all learning resources with filtering
- `POST /api/resources` - Create new resource (authenticated)
- `GET /api/resources/[id]` - Get specific resource details
- `PUT /api/resources/[id]` - Update resource (owner only)
- `DELETE /api/resources/[id]` - Delete resource (owner only)

#### **Jobs API (`/api/jobs`)**
- `GET /api/jobs` - List all job postings with filtering
- `POST /api/jobs` - Create new job posting (authenticated)
- `GET /api/jobs/[id]` - Get specific job details
- `POST /api/jobs/apply` - Apply to job (authenticated)
- `PUT /api/jobs/[id]` - Update job posting (owner only)

#### **Wellness API (`/api/wellness`)**
- `GET /api/wellness` - Get user's journal entries (authenticated)
- `POST /api/wellness` - Create new journal entry (authenticated)
- `DELETE /api/wellness?id=[id]` - Delete journal entry (owner only)

#### **Community API (`/api/lounge`)**
- `GET /api/lounge/posts` - Get community forum posts
- `POST /api/lounge/posts` - Create new discussion post (authenticated)
- `POST /api/lounge/comment` - Add comment to post (authenticated)
- `POST /api/lounge/react` - React to post (authenticated)

### Database Models
- **Resource** - Learning content (blogs, courses, videos) with metadata
- **Job** - Job postings with requirements and application tracking
- **WellnessLog** - Personal journal entries and mood tracking
- **Message** - Community forum posts and interactions

## 🛠️ Development & Testing

### Available Scripts
```bash
npm run dev    # Start development server with increased memory allocation
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint for code quality
```

### Project Structure
```
src/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes for backend functionality
│   ├── (auth)/            # Authentication pages (sign-in/sign-up)
│   ├── camp/              # Main dashboard
│   ├── skills/            # Learning resources and creation pages
│   ├── jobs/              # Job board and management
│   ├── lounge/            # Community forum
│   ├── wellness/          # Wellness tools and journaling
│   └── profile/           # User profile management
├── components/            # Reusable React components
│   └── ui/               # Shadcn/ui component library
├── lib/                  # Utility functions and configurations
│   ├── dbConnect.ts      # MongoDB connection handler
│   ├── permissions.ts    # Authorization utilities
│   └── utils.ts          # General utility functions
├── model/                # MongoDB/Mongoose schemas
│   ├── Resource.models.ts # Learning resources schema
│   ├── Job.models.ts     # Job postings schema
│   └── ...               # Other data models
└── constants.ts          # Application-wide constants
```

### Mock Data & Testing
- The application automatically creates sample data when first accessed
- All features can be tested with or without authentication
- Use different user accounts to test multi-user functionality
- Database can be reset by dropping the MongoDB collection

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup for Production
1. **MongoDB**: Ensure database is accessible from production environment
2. **Clerk**: Configure production Clerk application with your domain
3. **Environment Variables**: Set all required variables in production
4. **Cloudinary**: Configure for file uploads (if using)

### Recommended Hosting Platforms
- **Vercel** - Optimized for Next.js with automatic deployments
- **Netlify** - Easy deployment with Git integration
- **Railway** - Full-stack hosting with database support
- **DigitalOcean** - VPS hosting for custom configurations

## 🐛 Troubleshooting

### Common Issues

**Memory Errors:**
- The dev script includes `--max-old-space-size=4096` for increased memory
- If still experiencing issues, increase the value or restart your system

**Build Errors:**
- Clear Next.js cache: `rm -rf .next` then `npm run build`
- Verify all environment variables are properly set
- Check for TypeScript compilation errors

**Database Connection:**
- Ensure MongoDB is running (local) or accessible (cloud)
- Verify MongoDB_URI format in `.env.local`
- Check database user permissions and network access

**Authentication Issues:**
- Confirm Clerk keys match your environment (development/production)
- Verify redirect URLs in Clerk dashboard
- Check that domain settings are correct

**Performance Issues:**
- Enable MongoDB indexing for better query performance
- Optimize images using Cloudinary integration
- Monitor bundle size and remove unused dependencies

### Getting Help
- Check the browser console for detailed error messages
- Review server logs for API-related issues
- Ensure all dependencies are properly installed
- Verify Node.js version compatibility (18+)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**BloomPoint** - Empowering growth through gamified learning and career development.

*Built with ❤️ using Next.js, MongoDB, and modern web technologies.*
