
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase Admin
admin.initializeApp();

exports.generateStudyPlan = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth && !data.isGuestMode) {
      throw new Error('Unauthenticated. Please sign in to use this feature.');
    }

    const userId = context.auth ? context.auth.uid : 'guest';
    
    // Get user data
    const userData = await getUserData(userId);
    
    // Format data for Gemini
    const formattedData = formatDataToJson(userData);
    
    // Create prompt for Gemini
    const prompt = createGeminiPrompt(formattedData);
    
    // Send to Gemini API
    const geminiApiKey = functions.config().gemini.key;
    const geminiResponse = await sendToGemini(prompt, geminiApiKey);
    
    // Process Gemini response
    const schedule = processGeminiResponse(geminiResponse);

    return { success: true, schedule };
  } catch (error) {
    console.error('Error in generateStudyPlan function:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Get user data from Firestore
 */
async function getUserData(userId) {
  try {
    const db = admin.firestore();
    
    // Get user courses
    const coursesSnapshot = await db.collection('user_courses')
      .where('user_id', '==', userId)
      .get();
    
    const courses = [];
    coursesSnapshot.forEach(doc => {
      courses.push(doc.data());
    });
    
    // Get user schedule
    const scheduleSnapshot = await db.collection('user_schedule')
      .where('user_id', '==', userId)
      .get();
    
    const schedule = [];
    scheduleSnapshot.forEach(doc => {
      schedule.push(doc.data());
    });
    
    // Get user preferences
    const preferencesSnapshot = await db.collection('user_preferences')
      .doc(userId)
      .get();
    
    const preferences = preferencesSnapshot.exists ? 
      preferencesSnapshot.data() : {};
    
    // Get user settings
    const settingsSnapshot = await db.collection('user_settings')
      .doc(userId)
      .get();
    
    const settings = settingsSnapshot.exists ? 
      settingsSnapshot.data() : { sks_definition: 50 };
    
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
  // Same implementation as in the Supabase function
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
  // Same implementation as in the Supabase function
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
