
# Jadwalin.ae Supabase Backend Design Guide

## Overview

This document outlines the architecture and implementation strategy for the Jadwalin.ae backend using Supabase, with a specific focus on the AI-powered flexible study scheduling system. Unlike conventional scheduling systems that use fixed time slots, our approach emphasizes a timer-based, flexible scheduling model that adapts to users' changing availability.

## Core Concept: Flexible Study Scheduling

### Traditional vs. Flexible Scheduling

**Traditional Scheduling:**
- Fixed time slots (e.g., "Study Calculus from 2-3 PM")
- When interrupted, the schedule is broken
- Difficult to accommodate unexpected events

**Our Flexible Approach:**
- Time-target based scheduling (e.g., "Study Calculus for 60 minutes today")
- Time accumulation model rather than fixed slots
- Timer-based tracking of progress toward daily/weekly goals
- Ability to pause, resume, and reschedule without "breaking" the plan

## Database Schema Design

### Tables Structure

1. **user_courses**
   ```sql
   CREATE TABLE public.user_courses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     course_name TEXT NOT NULL,
     sks INTEGER NOT NULL,
     difficulty INTEGER NOT NULL,  -- Scale 1-5
     has_practical BOOLEAN DEFAULT false,
     reading_load INTEGER,  -- Scale 1-5
     preference INTEGER,  -- User's interest in this course 1-5
     related_courses TEXT[],
     evaluation_methods TEXT[],
     weekly_target_minutes INTEGER NOT NULL, -- Weekly study time target
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

2. **study_sessions**
   ```sql
   CREATE TABLE public.study_sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     course_id UUID NOT NULL REFERENCES public.user_courses(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     planned_minutes INTEGER NOT NULL,
     completed_minutes INTEGER DEFAULT 0,
     status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'paused')),
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

3. **study_blocks**
   ```sql
   CREATE TABLE public.study_blocks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
     start_time TIMESTAMP WITH TIME ZONE,
     end_time TIMESTAMP WITH TIME ZONE,
     duration_minutes INTEGER, -- Calculated from start to end time
     status TEXT NOT NULL CHECK (status IN ('planned', 'completed', 'interrupted')),
     interruption_reason TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

4. **user_preferences**
   ```sql
   CREATE TABLE public.user_preferences (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     preferred_study_times TEXT[],
     sleep_time TIME,
     wake_time TIME,
     study_days_per_week INTEGER DEFAULT 5,
     learning_style TEXT,
     max_consecutive_hours INTEGER DEFAULT 2,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     UNIQUE(user_id)
   );
   ```

5. **user_constraints**
   ```sql
   CREATE TABLE public.user_constraints (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     day_of_week INTEGER, -- 0-6 for Sunday-Saturday
     start_time TIME,
     end_time TIME,
     recurring BOOLEAN DEFAULT true,
     specific_date DATE, -- Only used if recurring is false
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

6. **study_progress**
   ```sql
   CREATE TABLE public.study_progress (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     course_id UUID NOT NULL REFERENCES public.user_courses(id) ON DELETE CASCADE,
     week_number INTEGER NOT NULL,
     year INTEGER NOT NULL,
     target_minutes INTEGER NOT NULL,
     achieved_minutes INTEGER DEFAULT 0,
     completion_percentage NUMERIC GENERATED ALWAYS AS (
       CASE WHEN target_minutes > 0 
         THEN LEAST((achieved_minutes::numeric / target_minutes::numeric) * 100, 100) 
         ELSE 0 
       END
     ) STORED,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     UNIQUE(user_id, course_id, week_number, year)
   );
   ```

### Row-Level Security Policies

Each table should have appropriate RLS policies to ensure users can only access their own data:

```sql
-- Example for user_courses
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own courses" 
  ON public.user_courses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses" 
  ON public.user_courses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" 
  ON public.user_courses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" 
  ON public.user_courses FOR DELETE 
  USING (auth.uid() = user_id);
```

Similar policies should be created for all tables.

## Edge Function: Flexible Schedule Generator

### Function Structure

```typescript
// supabase/functions/generate-flexible-schedule/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const { userId, weekStartDate } = await req.json();

    // 1. Get user data and preferences
    const userData = await getUserData(supabase, userId);
    
    // 2. Get user constraints and existing commitments
    const constraints = await getUserConstraints(supabase, userId);
    
    // 3. Calculate available time slots
    const availableSlots = calculateAvailableTimeSlots(userData, constraints);
    
    // 4. Generate recommended study sessions with time targets
    const recommendedSessions = await generateRecommendedSessions(
      userData, 
      availableSlots, 
      geminiApiKey
    );
    
    // 5. Create flexible study plan with daily time targets per course
    const flexiblePlan = createFlexiblePlan(recommendedSessions);

    return new Response(
      JSON.stringify({ 
        success: true, 
        plan: flexiblePlan 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-flexible-schedule function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper functions would be implemented here
// getUserData, getUserConstraints, calculateAvailableTimeSlots,
// generateRecommendedSessions, createFlexiblePlan, etc.
```

### AI Integration with Gemini API

The Gemini API can be used to optimize the study schedule based on:

1. Course difficulty and importance
2. User learning patterns and preferences
3. Optimal spacing of sessions for better retention
4. Balancing workload across the week

```typescript
async function generateRecommendedSessions(userData, availableSlots, geminiApiKey) {
  // Create prompt for Gemini with user data and available slots
  const prompt = `
    You are an expert in academic planning and learning science.
    
    Please analyze this student's data and available time slots to create an optimal
    flexible study plan. Instead of fixed schedules, recommend daily time targets 
    for each course that the student should aim to complete.
    
    USER DATA:
    \`\`\`json
    ${JSON.stringify(userData, null, 2)}
    \`\`\`
    
    AVAILABLE TIME SLOTS:
    \`\`\`json
    ${JSON.stringify(availableSlots, null, 2)}
    \`\`\`
    
    TASK:
    Create a flexible study plan that:
    
    1. Assigns daily time targets for each course (in minutes)
    2. Ensures weekly targets are met
    3. Takes into account course difficulty and preferences
    4. Distributes workload appropriately throughout the week
    5. Considers optimal learning patterns (spacing effect, interleaving)
    
    Your response should be a JSON object with this structure:
    {
      "daily_targets": [
        {
          "date": "YYYY-MM-DD",
          "courses": [
            {
              "course_id": "uuid",
              "course_name": "Course Name",
              "target_minutes": 45,
              "suggested_activities": ["Review chapter 3", "Solve problems 1-5"]
            }
          ]
        }
      ]
    }
  `;
  
  // Send to Gemini API
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192
      }
    })
  });
  
  // Process response
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const cleanJSON = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJSON);
}
```

## Timer-Based Tracking Implementation

### Database Triggers for Time Tracking

Create a function to automatically update progress when study blocks are completed:

```sql
CREATE OR REPLACE FUNCTION update_study_progress()
RETURNS TRIGGER AS $$
DECLARE
  session_record RECORD;
  course_id UUID;
  week_num INTEGER;
  year_num INTEGER;
BEGIN
  -- Get session info
  SELECT * INTO session_record FROM public.study_sessions WHERE id = NEW.session_id;
  
  -- Get course_id from session
  course_id := session_record.course_id;
  
  -- Calculate week number and year
  SELECT 
    EXTRACT(WEEK FROM session_record.date) AS week,
    EXTRACT(YEAR FROM session_record.date) AS year
  INTO week_num, year_num;
  
  -- Update study progress
  IF NEW.status = 'completed' THEN
    -- Insert or update the progress record
    INSERT INTO public.study_progress (
      user_id, course_id, week_number, year, target_minutes, achieved_minutes
    )
    VALUES (
      session_record.user_id, course_id, week_num, year_num,
      (SELECT weekly_target_minutes FROM public.user_courses WHERE id = course_id),
      NEW.duration_minutes
    )
    ON CONFLICT (user_id, course_id, week_number, year)
    DO UPDATE SET
      achieved_minutes = public.study_progress.achieved_minutes + NEW.duration_minutes,
      updated_at = now();
    
    -- Update the session's completed_minutes
    UPDATE public.study_sessions
    SET completed_minutes = completed_minutes + NEW.duration_minutes,
        updated_at = now()
    WHERE id = NEW.session_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER study_block_completed
AFTER INSERT OR UPDATE OF status ON public.study_blocks
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_study_progress();
```

## API Services Implementation

### Study Sessions API

```typescript
/**
 * Class for managing flexible study sessions
 */
export class StudySessionAPI {
  /**
   * Start a study session
   */
  public static async startSession(courseId: string): Promise<StudySession> {
    try {
      const user = supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const userId = user.id;
      
      // Check if there's an existing paused session
      const { data: pausedSession } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'paused')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (pausedSession) {
        // Resume existing session
        const { data, error } = await supabase
          .from('study_sessions')
          .update({ status: 'in_progress', updated_at: new Date().toISOString() })
          .eq('id', pausedSession.id)
          .select()
          .single();
          
        if (error) throw error;
        
        // Create new study block
        const { data: blockData, error: blockError } = await supabase
          .from('study_blocks')
          .insert({
            session_id: pausedSession.id,
            start_time: new Date().toISOString(),
            status: 'planned'
          })
          .select()
          .single();
          
        if (blockError) throw blockError;
        
        return data;
      } else {
        // Start new session
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's planned minutes for this course
        const { data: planData } = await supabase.functions.invoke('get-daily-target', {
          body: { userId, courseId, date: today }
        });
        
        const plannedMinutes = planData?.target_minutes || 30; // Default 30 minutes
        
        // Create new session
        const { data, error } = await supabase
          .from('study_sessions')
          .insert({
            user_id: userId,
            course_id: courseId,
            date: today,
            planned_minutes: plannedMinutes,
            status: 'in_progress'
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Create first study block
        const { data: blockData, error: blockError } = await supabase
          .from('study_blocks')
          .insert({
            session_id: data.id,
            start_time: new Date().toISOString(),
            status: 'planned'
          })
          .select()
          .single();
          
        if (blockError) throw blockError;
        
        return data;
      }
    } catch (error) {
      console.error('Error starting study session:', error);
      throw error;
    }
  }
  
  /**
   * Pause current study session
   */
  public static async pauseSession(sessionId: string, reason?: string): Promise<StudySession> {
    try {
      // Get current active block
      const { data: activeBlock } = await supabase
        .from('study_blocks')
        .select('*')
        .eq('session_id', sessionId)
        .is('end_time', null)
        .single();
      
      if (activeBlock) {
        const now = new Date();
        const startTime = new Date(activeBlock.start_time);
        const durationMinutes = Math.round((now.getTime() - startTime.getTime()) / 60000);
        
        // Update the block
        await supabase
          .from('study_blocks')
          .update({
            end_time: now.toISOString(),
            duration_minutes: durationMinutes,
            status: 'interrupted',
            interruption_reason: reason || 'User paused',
            updated_at: now.toISOString()
          })
          .eq('id', activeBlock.id);
      }
      
      // Update the session
      const { data, error } = await supabase
        .from('study_sessions')
        .update({ 
          status: 'paused', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', sessionId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error pausing study session:', error);
      throw error;
    }
  }
  
  /**
   * Complete current study session
   */
  public static async completeSession(sessionId: string): Promise<StudySession> {
    try {
      // Get current active block
      const { data: activeBlock } = await supabase
        .from('study_blocks')
        .select('*')
        .eq('session_id', sessionId)
        .is('end_time', null)
        .single();
      
      if (activeBlock) {
        const now = new Date();
        const startTime = new Date(activeBlock.start_time);
        const durationMinutes = Math.round((now.getTime() - startTime.getTime()) / 60000);
        
        // Update the block
        await supabase
          .from('study_blocks')
          .update({
            end_time: now.toISOString(),
            duration_minutes: durationMinutes,
            status: 'completed',
            updated_at: now.toISOString()
          })
          .eq('id', activeBlock.id);
      }
      
      // Update the session
      const { data, error } = await supabase
        .from('study_sessions')
        .update({ 
          status: 'completed', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', sessionId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error completing study session:', error);
      throw error;
    }
  }
  
  /**
   * Get study progress for the week
   */
  public static async getWeeklyProgress(userId: string, weekNumber?: number, year?: number): Promise<WeeklyProgress[]> {
    try {
      const now = new Date();
      const currentWeek = weekNumber || getWeekNumber(now);
      const currentYear = year || now.getFullYear();
      
      const { data, error } = await supabase
        .from('study_progress')
        .select(`
          id,
          week_number,
          year,
          target_minutes,
          achieved_minutes,
          completion_percentage,
          user_courses (
            id,
            course_name
          )
        `)
        .eq('user_id', userId)
        .eq('week_number', currentWeek)
        .eq('year', currentYear);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting weekly progress:', error);
      return [];
    }
  }
}

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
}
```

## Frontend Timer Implementation

The frontend should implement a timer component that:

1. Shows progress toward daily targets
2. Allows starting, pausing, and resuming study sessions
3. Tracks time spent on each course
4. Shows daily and weekly completion statistics

```typescript
// Example React component for flexible timer
interface TimerProps {
  courseId: string;
  courseName: string;
  targetMinutes: number;
  achievedMinutes: number;
}

const FlexibleStudyTimer: React.FC<TimerProps> = ({
  courseId,
  courseName,
  targetMinutes,
  achievedMinutes
}) => {
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(targetMinutes - achievedMinutes);
  
  // Timer logic with useEffect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        
        // Update remaining minutes every 60 seconds
        if (elapsedSeconds > 0 && elapsedSeconds % 60 === 0) {
          setRemainingMinutes(prev => Math.max(0, prev - 1));
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, elapsedSeconds]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start or resume study session
  const handleStart = async () => {
    try {
      const response = await StudySessionAPI.startSession(courseId);
      setSessionId(response.id);
      setIsActive(true);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };
  
  // Pause study session
  const handlePause = async () => {
    if (!sessionId) return;
    
    try {
      await StudySessionAPI.pauseSession(sessionId);
      setIsActive(false);
    } catch (error) {
      console.error('Error pausing session:', error);
    }
  };
  
  // Complete study session
  const handleComplete = async () => {
    if (!sessionId) return;
    
    try {
      await StudySessionAPI.completeSession(sessionId);
      setIsActive(false);
      setSessionId(null);
      
      // Refresh achieved minutes
      // This would typically be handled via a data fetching hook
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    ((achievedMinutes + Math.floor(elapsedSeconds / 60)) / targetMinutes) * 100,
    100
  );
  
  return (
    <div className="study-timer">
      <h3>{courseName}</h3>
      
      <div className="timer-display">
        <div className="elapsed-time">{formatTime(elapsedSeconds)}</div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="target-info">
          <span>
            {achievedMinutes + Math.floor(elapsedSeconds / 60)} / {targetMinutes} minutes
          </span>
        </div>
      </div>
      
      <div className="timer-controls">
        {!isActive ? (
          <button onClick={handleStart}>
            {sessionId ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        
        <button onClick={handleComplete} disabled={!sessionId}>
          Complete
        </button>
      </div>
    </div>
  );
};
```

## React Native Migration Guidelines

### Architectural Approach

To migrate this application to React Native while maintaining the same backend:

1. **Use React Native with Expo**: Expo provides a managed workflow that simplifies development for a study app like this.

2. **Project Structure**: Organize the project as follows:
   ```
   /src
     /api           # Supabase API services (reuse with minimal changes)
     /components    # React Native UI components
     /hooks         # Shared hooks (minimal changes needed)
     /navigation    # React Navigation setup
     /screens       # Main app screens
     /utils         # Helper functions
     /context       # Global state management
   ```

3. **Dependencies**:
   - `@supabase/supabase-js`: For backend integration
   - `@react-navigation/native`: For navigation
   - `react-native-svg`: For charts and graphics
   - `expo-notifications`: For study reminders
   - `@gorhom/bottom-sheet`: For modal interfaces
   - `react-native-reanimated`: For animations

### UI Component Mapping

| Web Component | React Native Equivalent |
|---------------|-------------------------|
| AnimatedCard | Animated.View with shadow props |
| GlassPanel | Blurred View component with opacity |
| PomodoroTimer | Custom timer with Animated API |
| Tabs | React Navigation's Tab Navigator |
| Buttons | Pressable components with ripple effect |
| Forms | React Native TextInput with validation |
| Toast | Custom notification component or library |

### Key Adaptations

1. **Navigation**: Replace browser-based routing with React Navigation:
   ```javascript
   import { NavigationContainer } from '@react-navigation/native';
   import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
   import { createStackNavigator } from '@react-navigation/stack';
   
   const Tab = createBottomTabNavigator();
   const Stack = createStackNavigator();
   
   function AppNavigator() {
     return (
       <NavigationContainer>
         <Tab.Navigator>
           <Tab.Screen name="Dashboard" component={DashboardScreen} />
           <Tab.Screen name="Schedule" component={ScheduleScreen} />
           <Tab.Screen name="Timer" component={TimerScreen} />
           <Tab.Screen name="Settings" component={SettingsScreen} />
         </Tab.Navigator>
       </NavigationContainer>
     );
   }
   ```

2. **Flexible Timer Implementation**:
   - Use React Native's `Animated` API for timer animations
   - Implement background timers that continue running when app is minimized
   - Use local notifications to remind users of study goals

3. **Offline Support**: Implement data caching for offline use:
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   // Cache study data
   const cacheStudyData = async (data) => {
     try {
       await AsyncStorage.setItem('study_sessions', JSON.stringify(data));
     } catch (error) {
       console.error('Error caching data:', error);
     }
   };
   
   // Sync with server when back online
   const syncWithServer = async () => {
     try {
       const cachedData = await AsyncStorage.getItem('study_sessions');
       if (cachedData) {
         const parsedData = JSON.parse(cachedData);
         // Send to server
         await StudySessionAPI.syncOfflineData(parsedData);
         // Clear cache
         await AsyncStorage.removeItem('study_sessions');
       }
     } catch (error) {
       console.error('Error syncing with server:', error);
     }
   };
   ```

## Conclusion

This flexible study scheduling system offers several advantages over traditional fixed-slot scheduling:

1. **Resilience to Interruptions**: Users can pause and resume their study sessions without "breaking" their schedule
2. **Goal-Oriented Approach**: Focus is on completing time targets rather than adhering to specific time slots
3. **Progress Tracking**: Clear visibility of progress toward daily and weekly goals
4. **AI Optimization**: Intelligent distribution of study time based on course difficulty and user preferences
5. **Adaptability**: The system accommodates changing constraints and unexpected events

By implementing this backend design with Supabase, you'll have a robust foundation for both web and mobile applications with the same core functionality.
