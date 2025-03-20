
/**
 * API Services
 * 
 * File ini berisi semua konfigurasi dan fungsi untuk mengakses layanan API eksternal
 * yang digunakan dalam aplikasi Jadwalin.ae.
 */

import { supabase } from '@/integrations/supabase/client';
import { useGuestMode } from '@/hooks/useGuestMode';

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
      // Mock implementation for guest mode
      if (document.cookie.includes('guest-mode=true')) {
        console.log('Guest mode detected, simulating calendar API call');
        return Array(scheduleData.length).fill('').map(() => `mock-event-${Math.random().toString(36).substring(2, 11)}`);
      }
      
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
      // Mock implementation for guest mode
      if (document.cookie.includes('guest-mode=true')) {
        console.log('Guest mode detected, simulating study plan generation');
        return this.generateMockStudyPlan();
      }
      
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
  
  // Helper method to generate mock data for guest mode
  private static generateMockStudyPlan(): StudyScheduleItem[] {
    const subjects = [
      'Kalkulus', 'Fisika Dasar', 'Kimia Dasar', 'Algoritma Pemrograman',
      'Struktur Data', 'Basis Data', 'Jaringan Komputer', 'Sistem Operasi'
    ];
    
    const activities = [
      'Membaca materi', 'Mengerjakan latihan', 'Review catatan', 
      'Diskusi kelompok', 'Persiapan ujian', 'Praktikum'
    ];
    
    const mockPlan: StudyScheduleItem[] = [];
    const today = new Date();
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const startHour = 8 + Math.floor(Math.random() * 8); // Between 8 AM and 4 PM
      const endHour = startHour + 1 + Math.floor(Math.random() * 2); // 1-3 hours duration
      
      mockPlan.push({
        tanggal: date.toISOString().split('T')[0],
        waktu_mulai: `${startHour.toString().padStart(2, '0')}:00`,
        waktu_berakhir: `${endHour.toString().padStart(2, '0')}:00`,
        mata_kuliah: subjects[Math.floor(Math.random() * subjects.length)],
        aktivitas: activities[Math.floor(Math.random() * activities.length)]
      });
    }
    
    return mockPlan;
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
    // If in guest mode, return mock data
    if (document.cookie.includes('guest-mode=true')) {
      return this.getMockUserCourses();
    }
    
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
      return [];
    }
  }

  /**
   * Mendapatkan jadwal pengguna
   */
  public static async getUserSchedule(userId: string): Promise<any[]> {
    // If in guest mode, return mock data
    if (document.cookie.includes('guest-mode=true')) {
      return this.getMockUserSchedule();
    }
    
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
      return [];
    }
  }

  /**
   * Mendapatkan preferensi pengguna
   */
  public static async getUserPreferences(userId: string): Promise<any> {
    // If in guest mode, return mock data
    if (document.cookie.includes('guest-mode=true')) {
      return this.getMockUserPreferences();
    }
    
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
      return {};
    }
  }

  /**
   * Mendapatkan pengaturan pengguna
   */
  public static async getUserSettings(userId: string): Promise<any> {
    // If in guest mode, return mock data
    if (document.cookie.includes('guest-mode=true')) {
      return { sks_definition: 50 }; // Default: 1 SKS = 50 menit
    }
    
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
      return { sks_definition: 50 };
    }
  }
  
  // Helper methods for mock data in guest mode
  private static getMockUserCourses(): any[] {
    return [
      { id: 1, name: 'Kalkulus', credits: 3, difficulty: 'high' },
      { id: 2, name: 'Fisika Dasar', credits: 4, difficulty: 'high' },
      { id: 3, name: 'Pemrograman Dasar', credits: 3, difficulty: 'medium' },
      { id: 4, name: 'Struktur Data', credits: 3, difficulty: 'medium' },
      { id: 5, name: 'Algoritma', credits: 3, difficulty: 'high' },
    ];
  }
  
  private static getMockUserSchedule(): any[] {
    const today = new Date();
    const schedule = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      schedule.push({
        id: i + 1,
        date: date.toISOString().split('T')[0],
        course: this.getMockUserCourses()[i].name,
        start_time: '09:00',
        end_time: '10:40',
        is_completed: false
      });
    }
    
    return schedule;
  }
  
  private static getMockUserPreferences(): any {
    return {
      study_time_preference: 'morning',
      break_duration: 15,
      session_duration: 45,
      preferred_study_days: ['monday', 'wednesday', 'friday', 'saturday']
    };
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
