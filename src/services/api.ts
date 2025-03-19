
/**
 * API Services
 * 
 * File ini berisi semua konfigurasi dan fungsi untuk mengakses layanan API eksternal
 * yang digunakan dalam aplikasi Jadwalin.ae.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Kelas untuk mengelola API Gemini
 */
export class GeminiAPI {
  private static API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private static API_KEY: string | null = null;

  /**
   * Mengatur API key untuk Gemini
   */
  public static setApiKey(apiKey: string): void {
    this.API_KEY = apiKey;
  }

  /**
   * Mendapatkan API key Gemini dari penyimpanan
   */
  public static getApiKey(): string | null {
    return this.API_KEY;
  }

  /**
   * Mengirim prompt ke Gemini API dan mendapatkan respons
   */
  public static async generateContent(prompt: string): Promise<any> {
    if (!this.API_KEY) {
      throw new Error('Gemini API key tidak ditemukan');
    }

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.API_KEY
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
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}

/**
 * Kelas untuk mengelola API Google Calendar
 */
export class GoogleCalendarAPI {
  /**
   * Menambahkan jadwal belajar ke Google Calendar
   */
  public static async addStudySchedule(scheduleData: StudyScheduleItem[]): Promise<string[]> {
    try {
      // Panggil edge function untuk menambahkan jadwal
      const { data, error } = await supabase.functions.invoke('add-to-calendar', {
        body: { scheduleData }
      });

      if (error) {
        throw new Error(`Error adding to calendar: ${error.message}`);
      }

      return data.eventIds;
    } catch (error) {
      console.error('Error adding study schedule to calendar:', error);
      throw error;
    }
  }
}

/**
 * Kelas untuk mengelola API Study Planner
 */
export class StudyPlannerAPI {
  /**
   * Mendapatkan jadwal belajar yang dipersonalisasi
   */
  public static async generateStudyPlan(userId: string): Promise<StudyScheduleItem[]> {
    try {
      // Panggil edge function untuk membuat jadwal belajar
      const { data, error } = await supabase.functions.invoke('generate-study-plan', {
        body: { userId }
      });

      if (error) {
        throw new Error(`Error generating study plan: ${error.message}`);
      }

      return data.schedule;
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw error;
    }
  }
}

/**
 * Kelas untuk mengelola API Supabase
 */
export class SupabaseAPI {
  /**
   * Mendapatkan data mata kuliah pengguna
   */
  public static async getUserCourses(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw new Error(`Error fetching user courses: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user courses:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan jadwal pengguna
   */
  public static async getUserSchedule(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_schedule')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw new Error(`Error fetching user schedule: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user schedule:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan preferensi pengguna
   */
  public static async getUserPreferences(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        throw new Error(`Error fetching user preferences: ${error.message}`);
      }
      
      return data || {};
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan pengaturan pengguna
   */
  public static async getUserSettings(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        throw new Error(`Error fetching user settings: ${error.message}`);
      }
      
      return data || { sks_definition: 50 }; // Default: 1 SKS = 50 menit
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }
}

/**
 * Type untuk item jadwal belajar
 */
export interface StudyScheduleItem {
  tanggal: string;        // Format: "YYYY-MM-DD"
  waktu_mulai: string;    // Format: "HH:MM"
  waktu_berakhir: string; // Format: "HH:MM"
  mata_kuliah: string;    // Nama mata kuliah
  aktivitas: string;      // Deskripsi aktivitas belajar
}

/**
 * API Services - titik akses utama untuk semua API
 */
export const APIServices = {
  Supabase: SupabaseAPI,
  Gemini: GeminiAPI,
  GoogleCalendar: GoogleCalendarAPI,
  StudyPlanner: StudyPlannerAPI
};
