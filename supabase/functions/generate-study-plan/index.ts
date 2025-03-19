
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

    // Check for required environment variables
    if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
      throw new Error('Missing required environment variables');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    // 1. Get user data from database
    const userData = await getUserData(supabase, userId);
    
    // 2. Format data for Gemini
    const formattedData = formatDataToJson(userData);
    
    // 3. Create prompt for Gemini
    const prompt = createGeminiPrompt(formattedData);
    
    // 4. Send to Gemini API
    const geminiResponse = await sendToGemini(prompt, geminiApiKey);
    
    // 5. Process Gemini response
    const schedule = processGeminiResponse(geminiResponse);

    // Return the schedule
    return new Response(
      JSON.stringify({ 
        success: true, 
        schedule 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-study-plan function:', error);
    
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

/**
 * Get user data from database
 */
async function getUserData(supabase, userId) {
  try {
    // Get user courses
    const { data: courses, error: coursesError } = await supabase
      .from('user_courses')
      .select('course_name, sks, difficulty, has_practical, related_courses, evaluation_methods, reading_load, preference')
      .eq('user_id', userId);
    
    if (coursesError) throw coursesError;
    
    // Get user schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from('user_schedule')
      .select('day, start_time, end_time, activity')
      .eq('user_id', userId);
    
    if (scheduleError) throw scheduleError;
    
    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (preferencesError && preferencesError.code !== 'PGRST116') throw preferencesError;
    
    // Get user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('sks_definition')
      .eq('user_id', userId)
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
    
    // Combine data
    return {
      user_id: userId,
      courses: courses || [],
      existing_schedule: schedule || [],
      preferences: preferences || {},
      settings: settings || { sks_definition: 50 }
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
}

/**
 * Format data to JSON for Gemini
 */
function formatDataToJson(userData) {
  try {
    // Create a structured format for the AI
    const formatted = {
      user_id: userData.user_id,
      courses: [],
      existing_schedule: [],
      study_preferences: {},
      sks_definition: userData.settings?.sks_definition || 50
    };
    
    // Format courses data
    for (const course of userData.courses) {
      const formattedCourse = {
        name: course.course_name,
        sks: course.sks,
        difficulty: course.difficulty,
        has_practical: course.has_practical,
        reading_load: course.reading_load,
        preference: course.preference
      };
      
      // Add optional fields
      if (course.related_courses) {
        formattedCourse.related_courses = course.related_courses;
      }
      
      if (course.evaluation_methods) {
        formattedCourse.evaluation_methods = course.evaluation_methods;
      }
      
      formatted.courses.push(formattedCourse);
    }
    
    // Format existing schedule
    for (const item of userData.existing_schedule) {
      formatted.existing_schedule.push({
        day: item.day,
        start_time: item.start_time,
        end_time: item.end_time,
        activity: item.activity
      });
    }
    
    // Format preferences
    if (userData.preferences) {
      const prefs = userData.preferences;
      formatted.study_preferences = {
        preferred_study_times: prefs.preferred_study_times || [],
        sleep_schedule: {
          sleep_time: prefs.sleep_time || "23:00",
          wake_time: prefs.wake_time || "07:00"
        },
        study_days_per_week: prefs.study_days_per_week || 5,
        learning_style: prefs.learning_style || "visual",
        max_consecutive_hours: prefs.max_consecutive_hours || 2
      };
    }
    
    return JSON.stringify(formatted, null, 2);
  } catch (error) {
    console.error('Error formatting data to JSON:', error);
    throw new Error(`Failed to format data: ${error.message}`);
  }
}

/**
 * Create prompt for Gemini
 */
function createGeminiPrompt(userData) {
  return `
    You are an expert in time management and study planning, utilizing principles similar to the XGBoost algorithm for personalized scheduling.
    
    Please analyze the following student data and create a personalized independent study schedule. The schedule should help the student effectively manage their study time for all courses.
    
    USER DATA:
    \`\`\`json
    ${userData}
    \`\`\`
    
    TASK:
    Create a personalized independent study schedule that:
    
    1. Allocates appropriate study time based on:
       - SKS definition (minutes per credit)
       - Course difficulty
       - Practical requirements
       - Course relationships
       - Evaluation methods
       - Reading load
       - User preferences/interests
    
    2. Respects the existing class schedule (no conflicts)
    
    3. Aligns with the user's:
       - Preferred study times
       - Sleep schedule
       - Number of study days preference (5 or 7 days)
       - Maximum consecutive study hours
    
    4. Suggests specific study activities aligned with the user's learning style
    
    5. Distributes study load evenly throughout the week
    
    6. Optimizes retention by suggesting review sessions at appropriate intervals
    
    IMPORTANT: Your response must ONLY be a JSON array of study sessions with this exact structure:
    [
      {
        "tanggal": "YYYY-MM-DD",
        "waktu_mulai": "HH:MM",
        "waktu_berakhir": "HH:MM",
        "mata_kuliah": "Course Name",
        "aktivitas": "Specific Study Activity Description"
      },
      ...
    ]
    
    Do not include any other text, explanation, or formatting in your response - ONLY the JSON array.
  `;
}

/**
 * Send prompt to Gemini API
 */
async function sendToGemini(prompt, apiKey) {
  try {
    const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    const response = await fetch(GEMINI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending prompt to Gemini:', error);
    throw new Error(`Failed to call Gemini API: ${error.message}`);
  }
}

/**
 * Process Gemini response
 */
function processGeminiResponse(geminiResponse) {
  try {
    // Extract text from response
    const text = geminiResponse.candidates[0].content.parts[0].text;
    
    // Clean up text - remove markdown code blocks
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    // Parse JSON
    const scheduleData = JSON.parse(cleanText);
    
    // Validate format
    if (!Array.isArray(scheduleData)) {
      throw new Error('Response is not an array');
    }
    
    // Validate each item
    for (const item of scheduleData) {
      const requiredKeys = ['tanggal', 'waktu_mulai', 'waktu_berakhir', 'mata_kuliah', 'aktivitas'];
      for (const key of requiredKeys) {
        if (!(key in item)) {
          throw new Error(`Missing required key in schedule item: ${key}`);
        }
      }
    }
    
    return scheduleData;
  } catch (error) {
    console.error('Error processing Gemini response:', error);
    throw new Error(`Failed to process Gemini response: ${error.message}`);
  }
}
