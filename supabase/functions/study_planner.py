
#!/usr/bin/env python3
"""
Study Planner - Jadwalin.ae

This script creates personalized study schedules using Supabase for data storage,
Google's Gemini API for schedule generation, and Google Calendar for scheduling.

Author: Radhitya Guntoro Adhi
"""

import os
import json
import logging
import datetime
from typing import Dict, List, Any, Optional

import requests
from supabase import create_client, Client
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

"""
==================== IMPORTANT SETUP INSTRUCTIONS ====================

1. Create a .env file in the same directory as this script with the following variables:
   - SUPABASE_URL=your_supabase_url
   - SUPABASE_API_KEY=your_supabase_api_key
   - GEMINI_API_KEY=your_gemini_api_key

2. Place your Google Calendar API credentials file (credentials.json) in the same directory.
   This file is obtained from the Google Cloud Console after setting up OAuth.

3. Before running this script:
   - Enable Google Calendar API in your Google Cloud Project
   - Create an OAuth client ID and download credentials.json
   - Configure OAuth consent screen with accurate information

4. Google Cloud Console Setup:
   - Project name: Jadwalin.ae
   - Support email: your_email@example.com
   - Authorized domains: your-domain.com
   - Privacy policy URL: https://your-domain.com/privacy-policy

5. OAuth Consent Screen Requirements:
   - Application name should be consistent (Jadwalin.ae)
   - Application logo (if available)
   - Authorized domains must be verified
   - Privacy policy URL must be valid

6. Homepage Requirements:
   - Must be on a verified domain
   - Must accurately represent your application
   - Must explain functionality clearly
   - Must include privacy policy link

7. Privacy Policy Requirements:
   - Must explain how Google user data is handled
   - Must include usage limitations
   - Must comply with Google's API Services User Data Policy

8. Additional Considerations:
   - Annual recertification may be required
   - Restricted scopes may have additional requirements
   - Keep project contact information updated
   - Document why your app needs Calendar access

==================== API CONSTANTS ====================
"""

# Gemini API endpoint for generative AI
GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

# Timezone for calendar events (adjust as needed)
TIMEZONE = "Asia/Jakarta"

def get_supabase_client() -> Client:
    """
    Create and return a Supabase client using environment variables.
    
    Returns:
        Client: Configured Supabase client
    """
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_API_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_API_KEY must be set in .env file")
    
    return create_client(url, key)

def get_user_data(user_id: str) -> Dict[str, Any]:
    """
    Retrieve user data from Supabase based on user_id.
    
    Args:
        user_id (str): The ID of the user
        
    Returns:
        Dict[str, Any]: Dictionary containing user data
        
    Raises:
        Exception: If data retrieval fails
    """
    try:
        logger.info(f"Retrieving data for user {user_id}")
        supabase = get_supabase_client()
        
        # Get user courses
        courses_response = supabase.table("user_courses").select(
            "course_name, sks, difficulty, has_practical, related_courses, evaluation_methods, reading_load, preference"
        ).eq("user_id", user_id).execute()
        
        # Get user schedule
        schedule_response = supabase.table("user_schedule").select(
            "day, start_time, end_time, activity"
        ).eq("user_id", user_id).execute()
        
        # Get user preferences
        preferences_response = supabase.table("user_preferences").select(
            "*"
        ).eq("user_id", user_id).execute()
        
        # Get user settings
        settings_response = supabase.table("user_settings").select(
            "sks_definition"
        ).eq("user_id", user_id).execute()
        
        # Combine data into a single dictionary
        user_data = {
            "user_id": user_id,
            "courses": courses_response.data,
            "existing_schedule": schedule_response.data,
            "preferences": preferences_response.data[0] if preferences_response.data else {},
            "settings": settings_response.data[0] if settings_response.data else {"sks_definition": 50}  # Default: 1 SKS = 50 minutes
        }
        
        logger.info(f"Successfully retrieved data for user {user_id}")
        return user_data
        
    except Exception as e:
        logger.error(f"Error retrieving user data: {str(e)}")
        raise

def format_data_to_json(user_data: Dict[str, Any]) -> str:
    """
    Format user data into a structured JSON string for the AI model.
    
    Args:
        user_data (Dict[str, Any]): User data dictionary
        
    Returns:
        str: Formatted JSON string
    """
    try:
        # Create a clean, structured format that's easy for the AI to understand
        formatted_data = {
            "user_id": user_data["user_id"],
            "courses": [],
            "existing_schedule": [],
            "study_preferences": {},
            "sks_definition": user_data["settings"].get("sks_definition", 50)
        }
        
        # Format courses data
        for course in user_data["courses"]:
            formatted_course = {
                "name": course["course_name"],
                "sks": course["sks"],
                "difficulty": course["difficulty"],  # 1-5 scale
                "has_practical": course["has_practical"],
                "reading_load": course["reading_load"],  # 1-5 scale
                "preference": course["preference"]  # User's interest/preference for this course (1-5)
            }
            
            # Add optional fields if they exist
            if course.get("related_courses"):
                formatted_course["related_courses"] = course["related_courses"]
                
            if course.get("evaluation_methods"):
                formatted_course["evaluation_methods"] = course["evaluation_methods"]
                
            formatted_data["courses"].append(formatted_course)
        
        # Format existing schedule
        for item in user_data["existing_schedule"]:
            formatted_data["existing_schedule"].append({
                "day": item["day"],
                "start_time": item["start_time"],
                "end_time": item["end_time"],
                "activity": item["activity"]
            })
        
        # Format preferences
        if user_data["preferences"]:
            prefs = user_data["preferences"]
            formatted_data["study_preferences"] = {
                "preferred_study_times": prefs.get("preferred_study_times", []),
                "sleep_schedule": {
                    "sleep_time": prefs.get("sleep_time", "23:00"),
                    "wake_time": prefs.get("wake_time", "07:00")
                },
                "study_days_per_week": prefs.get("study_days_per_week", 5),
                "learning_style": prefs.get("learning_style", "visual"),
                "max_consecutive_hours": prefs.get("max_consecutive_hours", 2)
            }
        
        # Convert to JSON string with proper formatting
        return json.dumps(formatted_data, indent=2)
        
    except Exception as e:
        logger.error(f"Error formatting data to JSON: {str(e)}")
        raise

def create_gemini_prompt(user_data_json: str) -> str:
    """
    Create a detailed prompt for Gemini API to generate a personalized study schedule.
    
    Args:
        user_data_json (str): User data in JSON format
        
    Returns:
        str: Detailed prompt for Gemini
    """
    prompt = """
    You are an expert in time management and study planning, utilizing principles similar to the XGBoost algorithm for personalized scheduling.
    
    Please analyze the following student data and create a personalized independent study schedule. The schedule should help the student effectively manage their study time for all courses.
    
    USER DATA:
    ```json
    {user_data}
    ```
    
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
      {{
        "tanggal": "YYYY-MM-DD",
        "waktu_mulai": "HH:MM",
        "waktu_berakhir": "HH:MM",
        "mata_kuliah": "Course Name",
        "aktivitas": "Specific Study Activity Description"
      }},
      ...
    ]
    
    Do not include any other text, explanation, or formatting in your response - ONLY the JSON array.
    """.format(user_data=user_data_json)
    
    return prompt

def send_to_gemini(prompt: str) -> Dict[str, Any]:
    """
    Send prompt to Gemini API and get response.
    
    Args:
        prompt (str): Prompt for Gemini API
        
    Returns:
        Dict[str, Any]: JSON response from Gemini
        
    Raises:
        Exception: If API call fails
    """
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY must be set in .env file")
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.8,
                "topK": 40,
                "maxOutputTokens": 8192
            }
        }
        
        logger.info("Sending request to Gemini API")
        response = requests.post(
            GEMINI_API_ENDPOINT,
            headers=headers,
            json=data
        )
        
        if response.status_code != 200:
            logger.error(f"Gemini API error: {response.status_code}, {response.text}")
            raise Exception(f"Gemini API error: {response.status_code}, {response.text}")
        
        return response.json()
        
    except Exception as e:
        logger.error(f"Error sending prompt to Gemini: {str(e)}")
        raise

def process_gemini_response(gemini_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Extract and parse the schedule from Gemini API response.
    
    Args:
        gemini_response (Dict[str, Any]): Response from Gemini API
        
    Returns:
        List[Dict[str, Any]]: List of schedule items
        
    Raises:
        ValueError: If response format is invalid
    """
    try:
        # Extract the text from the Gemini response
        text = gemini_response["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean up the text - remove any markdown code blocks if present
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Parse the JSON
        schedule_data = json.loads(text)
        
        # Validate the format
        if not isinstance(schedule_data, list):
            raise ValueError("Response is not a list")
        
        for item in schedule_data:
            required_keys = ["tanggal", "waktu_mulai", "waktu_berakhir", "mata_kuliah", "aktivitas"]
            if not all(key in item for key in required_keys):
                raise ValueError(f"Missing required keys in schedule item: {item}")
        
        logger.info(f"Successfully processed Gemini response with {len(schedule_data)} schedule items")
        return schedule_data
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in Gemini response: {str(e)}")
        raise ValueError(f"Invalid JSON in Gemini response: {str(e)}")
    except Exception as e:
        logger.error(f"Error processing Gemini response: {str(e)}")
        raise

def send_to_google_calendar(schedule_data: List[Dict[str, Any]], user_email: Optional[str] = None) -> List[str]:
    """
    Add schedule items to Google Calendar.
    
    Args:
        schedule_data (List[Dict[str, Any]]): List of schedule items
        user_email (Optional[str]): Email of the user for the calendar (if not using 'primary')
        
    Returns:
        List[str]: List of created event IDs
        
    Raises:
        Exception: If calendar API call fails
    """
    try:
        # Load credentials from file
        credentials_path = 'credentials.json'
        if not os.path.exists(credentials_path):
            raise FileNotFoundError(f"Credentials file not found: {credentials_path}")
        
        credentials = Credentials.from_authorized_user_file(credentials_path)
        
        # Build the Calendar API service
        service = build('calendar', 'v3', credentials=credentials)
        
        # Calendar ID - 'primary' refers to the user's primary calendar
        calendar_id = 'primary' if not user_email else user_email
        
        event_ids = []
        
        # Add each schedule item as a calendar event
        for item in schedule_data:
            # Format date and time for Google Calendar (RFC3339)
            date_str = item["tanggal"]
            start_time_str = item["waktu_mulai"]
            end_time_str = item["waktu_berakhir"]
            
            start_datetime = f"{date_str}T{start_time_str}:00"
            end_datetime = f"{date_str}T{end_time_str}:00"
            
            # Create event object
            event = {
                'summary': f"Study: {item['mata_kuliah']}",
                'description': item['aktivitas'],
                'start': {
                    'dateTime': start_datetime,
                    'timeZone': TIMEZONE,
                },
                'end': {
                    'dateTime': end_datetime,
                    'timeZone': TIMEZONE,
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'popup', 'minutes': 15},
                    ],
                },
            }
            
            # Add event to calendar
            created_event = service.events().insert(calendarId=calendar_id, body=event).execute()
            event_ids.append(created_event['id'])
            logger.info(f"Event created: {created_event['htmlLink']}")
        
        logger.info(f"Successfully added {len(event_ids)} events to Google Calendar")
        return event_ids
    
    except FileNotFoundError as e:
        logger.error(str(e))
        raise
    except HttpError as e:
        logger.error(f"Google Calendar API error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error adding events to Google Calendar: {str(e)}")
        raise

def main(user_id: str) -> List[Dict[str, Any]]:
    """
    Main function to orchestrate the entire process.
    
    Args:
        user_id (str): User ID to generate schedule for
        
    Returns:
        List[Dict[str, Any]]: The generated schedule
        
    Raises:
        Exception: If any step fails
    """
    try:
        # 1. Get user data from Supabase
        user_data = get_user_data(user_id)
        
        # 2. Format data for Gemini
        formatted_data = format_data_to_json(user_data)
        
        # 3. Create prompt for Gemini
        prompt = create_gemini_prompt(formatted_data)
        
        # 4. Send to Gemini and get response
        gemini_response = send_to_gemini(prompt)
        
        # 5. Process Gemini response to get schedule
        schedule = process_gemini_response(gemini_response)
        
        # 6. Send schedule to Google Calendar (optional step)
        # Uncomment the line below if you want to automatically add to calendar
        # event_ids = send_to_google_calendar(schedule)
        
        return schedule
        
    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")
        raise

if __name__ == "__main__":
    # Example usage
    try:
        # Example user ID - replace with actual ID when using
        USER_ID = "example_user_id"
        
        # Generate schedule
        schedule = main(USER_ID)
        
        # Print the schedule (for demonstration)
        print(json.dumps(schedule, indent=2))
        
        # Optionally add to Google Calendar
        print("\nTo add this schedule to Google Calendar, uncomment the relevant line in the main() function.")
        
    except Exception as e:
        print(f"Error: {str(e)}")
