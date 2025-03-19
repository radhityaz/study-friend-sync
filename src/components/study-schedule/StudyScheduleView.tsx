
import React, { useState } from 'react';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Download, Share2, RefreshCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample schedule data (in a real app, this would come from your algorithm)
const sampleSchedule = [
  {
    day: 'Senin',
    schedule: [
      { time: '08:00 - 09:30', course: 'Kalkulus 1', activity: 'Review materi kuliah' },
      { time: '13:00 - 14:30', course: 'Fisika Dasar', activity: 'Latihan soal' },
      { time: '16:00 - 17:00', course: 'Bahasa Inggris', activity: 'Membaca materi baru' },
    ],
  },
  {
    day: 'Selasa',
    schedule: [
      { time: '09:00 - 10:30', course: 'Kimia Dasar', activity: 'Review materi kuliah' },
      { time: '14:00 - 16:00', course: 'Kalkulus 1', activity: 'Mengerjakan tugas' },
    ],
  },
  {
    day: 'Rabu',
    schedule: [
      { time: '08:00 - 09:30', course: 'Fisika Dasar', activity: 'Persiapan praktikum' },
      { time: '15:00 - 16:30', course: 'Pemrograman', activity: 'Latihan coding' },
    ],
  },
  {
    day: 'Kamis',
    schedule: [
      { time: '10:00 - 11:30', course: 'Kalkulus 1', activity: 'Mengerjakan tugas' },
      { time: '13:00 - 14:30', course: 'Bahasa Inggris', activity: 'Latihan speaking' },
    ],
  },
  {
    day: 'Jumat',
    schedule: [
      { time: '08:00 - 09:30', course: 'Pemrograman', activity: 'Review code' },
      { time: '13:00 - 14:30', course: 'Kimia Dasar', activity: 'Persiapan kuis' },
    ],
  },
  {
    day: 'Sabtu',
    schedule: [
      { time: '09:00 - 11:00', course: 'Kalkulus 1', activity: 'Latihan soal tambahan' },
      { time: '14:00 - 16:00', course: 'Fisika Dasar', activity: 'Mengerjakan tugas' },
    ],
  },
  {
    day: 'Minggu',
    schedule: [
      { time: '10:00 - 12:00', course: 'Review Mingguan', activity: 'Semua mata kuliah' },
      { time: '15:00 - 16:30', course: 'Persiapan Minggu Depan', activity: 'Planning' },
    ],
  },
];

export function StudyScheduleView() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewType, setViewType] = useState('week');
  
  // Get current day of week from selected date
  const getDayOfWeek = (date: Date | undefined) => {
    if (!date) return 'Senin';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };
  
  // Get current day's schedule
  const currentDaySchedule = sampleSchedule.find(
    (day) => day.day === getDayOfWeek(selectedDate)
  ) || sampleSchedule[0];
  
  // Handle exporting calendar
  const handleExportCalendar = () => {
    toast({
      title: 'Ekspor kalender',
      description: 'Jadwal belajar berhasil diekspor ke format iCal',
    });
  };
  
  // Handle sharing calendar
  const handleShareCalendar = () => {
    toast({
      title: 'Bagikan jadwal',
      description: 'Link jadwal belajar berhasil disalin ke clipboard',
    });
  };
  
  // Handle regenerating schedule
  const handleRegenerateSchedule = () => {
    toast({
      title: 'Regenerasi jadwal',
      description: 'Jadwal belajar baru sedang dibuat. Mohon tunggu sebentar...',
    });
    
    // Simulate regeneration delay
    setTimeout(() => {
      toast({
        title: 'Jadwal baru tersedia',
        description: 'Jadwal belajar berhasil diperbarui',
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Picker */}
        <AnimatedCard animation="fade" className="p-5 md:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Kalender</h3>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger>
                <SelectValue placeholder="Tampilan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Harian</SelectItem>
                <SelectItem value="week">Mingguan</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleExportCalendar}
              >
                <Download className="mr-2 h-4 w-4" />
                Ekspor
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleShareCalendar}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan
              </Button>
            </div>
            
            <Button 
              onClick={handleRegenerateSchedule}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerasi Jadwal
            </Button>
          </div>
        </AnimatedCard>
        
        {/* Schedule Display */}
        <AnimatedCard animation="fade" className="p-5 md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">
                  {viewType === 'day' 
                    ? `Jadwal ${getDayOfWeek(selectedDate)}` 
                    : 'Jadwal Mingguan'}
                </h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedDate?.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            
            {viewType === 'day' ? (
              <div className="space-y-3">
                {currentDaySchedule.schedule.length > 0 ? (
                  currentDaySchedule.schedule.map((item, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg flex">
                      <div className="w-32 font-medium">{item.time}</div>
                      <div>
                        <div className="font-medium">{item.course}</div>
                        <div className="text-sm text-muted-foreground">{item.activity}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center border-dashed border-2 border-gray-200 rounded-lg">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">Tidak ada jadwal</h3>
                    <p className="text-sm text-gray-500">
                      Tidak ada kegiatan belajar yang dijadwalkan untuk hari ini
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Tabs defaultValue="Senin">
                <TabsList className="grid grid-cols-7">
                  <TabsTrigger value="Senin">Sen</TabsTrigger>
                  <TabsTrigger value="Selasa">Sel</TabsTrigger>
                  <TabsTrigger value="Rabu">Rab</TabsTrigger>
                  <TabsTrigger value="Kamis">Kam</TabsTrigger>
                  <TabsTrigger value="Jumat">Jum</TabsTrigger>
                  <TabsTrigger value="Sabtu">Sab</TabsTrigger>
                  <TabsTrigger value="Minggu">Min</TabsTrigger>
                </TabsList>
                
                {sampleSchedule.map((day) => (
                  <TabsContent key={day.day} value={day.day} className="space-y-3 mt-3">
                    {day.schedule.map((item, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg flex">
                        <div className="w-32 font-medium">{item.time}</div>
                        <div>
                          <div className="font-medium">{item.course}</div>
                          <div className="text-sm text-muted-foreground">{item.activity}</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </AnimatedCard>
      </div>
      
      {/* Study Statistics */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Statistik Belajar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700">Total Waktu Belajar</h4>
              <p className="text-2xl font-bold mt-1">12.5 jam/minggu</p>
              <p className="text-sm text-muted-foreground">Berdasarkan rekomendasi dari 22 SKS</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700">Mata Kuliah Prioritas</h4>
              <p className="text-xl font-bold mt-1">Kalkulus 1</p>
              <p className="text-sm text-muted-foreground">4 SKS dengan tingkat kesulitan tinggi</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700">Waktu Belajar Optimal</h4>
              <p className="text-xl font-bold mt-1">08:00 - 11:00</p>
              <p className="text-sm text-muted-foreground">Berdasarkan preferensi dan performa</p>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-700">Rekomendasi Machine Learning</h4>
            <p className="text-sm mt-1">
              Berdasarkan analisis pola belajar dan tingkat kesulitan mata kuliah, sistem merekomendasikan:
            </p>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
              <li>Tambahkan 30 menit untuk latihan soal Kalkulus 1 setiap hari Selasa dan Kamis</li>
              <li>Jadwalkan review mingguan untuk mata kuliah Fisika Dasar</li>
              <li>Belajar dalam sesi 2 x 45 menit lebih optimal daripada 1 x 90 menit</li>
            </ul>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
