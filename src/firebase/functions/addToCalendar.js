
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.addToCalendar = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth && !data.isGuestMode) {
      throw new Error('Unauthenticated. Please sign in to use this feature.');
    }

    const userId = context.auth ? context.auth.uid : 'guest';
    const { scheduleData } = data;
    
    // Validate schedule data
    if (!scheduleData || !Array.isArray(scheduleData) || scheduleData.length === 0) {
      throw new Error('Invalid schedule data. Expected a non-empty array.');
    }
    
    // Get user's Google Calendar credentials
    let credentials;
    if (userId !== 'guest') {
      const userDoc = await admin.firestore().collection('user_google_credentials').doc(userId).get();
      if (userDoc.exists) {
        credentials = userDoc.data().credentials;
      }
    }
    
    if (!credentials) {
      // Use service account for guest mode or if user doesn't have credentials
      credentials = JSON.parse(functions.config().google.calendar_credentials);
    }
    
    // Set up Google Calendar API client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Add events to Google Calendar
    const eventIds = [];
    
    for (const item of scheduleData) {
      const { tanggal, waktu_mulai, waktu_berakhir, mata_kuliah, aktivitas } = item;
      
      const startDate = new Date(`${tanggal}T${waktu_mulai}`);
      const endDate = new Date(`${tanggal}T${waktu_berakhir}`);
      
      const event = {
        summary: `${mata_kuliah} - ${aktivitas}`,
        description: `Aktivitas belajar: ${aktivitas}\nMata kuliah: ${mata_kuliah}`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Asia/Jakarta',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Asia/Jakarta',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 },
          ],
        },
      };
      
      try {
        const { data: createdEvent } = await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });
        
        eventIds.push(createdEvent.id);
      } catch (error) {
        console.error(`Error adding event to calendar: ${error.message}`);
        // Continue with other events
      }
    }
    
    return { success: true, eventIds };
  } catch (error) {
    console.error('Error in addToCalendar function:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
