
# Jadwalinae App - Kotlin Migration Guide

## Application Overview

Jadwalinae is a study planning and management application for students. It helps users organize their academic schedule, track study time, manage tasks, take notes, and use a pomodoro timer for focused study sessions.

## Core Features

1. **Authentication System**
   - Login/Registration with email & password
   - Google OAuth integration
   - Guest mode for trying the app without registration

2. **Dashboard**
   - Study overview with charts and statistics
   - Weekly study hours visualization
   - Subject distribution pie chart
   - Upcoming tasks and study suggestions

3. **Study Schedule Management**
   - Generate personalized study plans
   - Add schedules to Google Calendar
   - View & edit planned study sessions

4. **Task Management**
   - Create, view, and complete academic tasks
   - Prioritize tasks by importance
   - Filter by course or completion status
   - Track task progress

5. **Pomodoro Timer**
   - Focus timer with configurable durations
   - Short and long break timers
   - Track study sessions completed
   - Visual progress indicator

6. **Notes System**
   - Create and edit study notes
   - Format text with basic formatting options
   - Search and organize notes by category

7. **Calendar Integration**
   - View schedules in calendar format
   - Sync with Google Calendar
   - Event visualization

8. **Settings**
   - User preferences management
   - Study time preferences
   - SKS (credit hour) configuration

## Technical Architecture

### Data Models

1. **User**
   - Basic profile information
   - Authentication details

2. **UserPreferences**
   - Study time preferences
   - Break duration
   - Session duration
   - Preferred study days

3. **UserSettings**
   - SKS definition (minutes per credit hour)
   - Other app settings

4. **UserCourses**
   - Course name
   - Credits
   - Difficulty level

5. **UserSchedule**
   - Date and time
   - Course
   - Completion status

6. **Task**
   - Title and description
   - Due date
   - Priority (high, medium, low)
   - Category (academic, personal, project)
   - Estimated time
   - Related course information
   - Completion status

7. **StudyScheduleItem**
   - Date
   - Start and end time
   - Course
   - Activity description

8. **Note**
   - Title
   - Content
   - Category
   - Date created/updated

### API Services

1. **GeminiAPI**
   - AI-powered content generation
   - Study planning assistance

2. **GoogleCalendarAPI**
   - Add study schedules to calendar
   - Manage calendar events

3. **StudyPlannerAPI**
   - Generate personalized study plans
   - Algorithm for time allocation

4. **SupabaseAPI**
   - Data persistence for all app features
   - User data management

### UI Components Structure

1. **Layout Components**
   - MainLayout (page container with navigation)
   - GlassPanel (frosted glass UI effect)
   - AnimatedCard (animated container)

2. **Navigation**
   - Bottom navbar with icons
   - Mobile responsive drawer menu

3. **Common UI Elements**
   - Loading spinner
   - Logo component
   - Toast notifications

4. **Feature-specific Components**
   - Dashboard visualizations
   - TaskItem and TaskList
   - PomodoroTimer
   - NoteEditor
   - StudyScheduleView

## Kotlin Implementation Guidelines

### Architecture Pattern
Recommend using MVVM (Model-View-ViewModel) architecture:
- **Models**: Kotlin data classes matching the data models above
- **ViewModels**: Managing UI state and business logic
- **Views**: Composable UI elements (using Jetpack Compose)

### Technology Stack Recommendations

1. **UI Framework**
   - Jetpack Compose for modern declarative UI
   - Material Design 3 components
   - Navigation component for routing

2. **State Management**
   - ViewModel + StateFlow/SharedFlow
   - Hilt for dependency injection

3. **Network/Backend**
   - Retrofit for API calls
   - Supabase Kotlin client for backend integration
   - WorkManager for background tasks

4. **Storage**
   - Room database for local persistence
   - DataStore for preferences
   - File storage for notes content

5. **Authentication**
   - Google Authentication
   - Custom email/password auth

6. **Third-party Services**
   - Google Calendar API
   - Gemini API (or equivalent AI service)

### UI Component Mapping

| Web Component | Kotlin/Compose Equivalent |
|---------------|---------------------------|
| GlassPanel | Card with alpha + blur effect |
| AnimatedCard | AnimatedVisibility + Card |
| MainLayout | Scaffold with BottomNavigation |
| Navbar | BottomAppBar with NavigationBar |
| TaskItem | LazyColumn item with Card |
| PomodoroTimer | Custom Composable with Canvas |
| NoteEditor | TextField with TopAppBar actions |
| Charts | MPAndroidChart or Compose-Charts |

### Key Implementation Challenges

1. **UI Translation**
   - Glass effect requires custom implementation in Compose
   - Animations need careful mapping to Compose transitions

2. **State Management**
   - Guest mode requires special handling
   - Authentication state needs to propagate through the app

3. **API Integration**
   - Supabase Kotlin client setup differs from JavaScript
   - Edge functions need alternative implementation

4. **Offline Support**
   - Implement local caching strategy
   - Sync mechanism for when connection is restored

### Mock Data Structure

Mock data is used extensively in guest mode - maintain the same structure in Kotlin implementation for consistency.

## Migration Workflow

1. Start with data models and repository interfaces
2. Implement authentication (including guest mode)
3. Build core UI components and navigation structure
4. Implement feature ViewModels with business logic
5. Connect UI to ViewModels
6. Add network services and API integration
7. Polish UI details and animations
8. Implement local storage and offline support

## Resources

- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
- [Material 3 for Compose](https://developer.android.com/jetpack/compose/designsystems/material3)
- [Supabase Kotlin Client](https://github.com/supabase-community/supabase-kt)
- [Google Calendar API for Android](https://developers.google.com/calendar/api/guides/overview)
- [MVVM Architecture Example](https://developer.android.com/topic/architecture)
