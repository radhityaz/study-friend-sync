
import React, { useState } from 'react';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Calendar, 
  Clock, 
  Brain,
  Save,
  Lightbulb,
  Star,
  BookOpen
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { SKSInput } from '@/components/settings/SKSInput';

export function StudyScheduleSettings() {
  const { toast } = useToast();
  const [learningAlgorithm, setLearningAlgorithm] = useState('xgboost');
  const [integrateCalendar, setIntegrateCalendar] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  
  // Sample course preferences (in a real app, this would come from your state management)
  const coursePreferences = [
    { name: 'Kalkulus 1', isStrength: false, isWeakness: true },
    { name: 'Fisika Dasar', isStrength: true, isWeakness: false },
    { name: 'Kimia Dasar', isStrength: false, isWeakness: false },
    { name: 'Pemrograman', isStrength: true, isWeakness: false },
    { name: 'Bahasa Inggris', isStrength: false, isWeakness: false },
  ];
  
  // Sample constraint entries (in a real app, this would be user-defined)
  const [constraints, setConstraints] = useState([
    { day: 'Senin', startTime: '12:00', endTime: '14:00', description: 'Istirahat dan makan siang' },
    { day: 'Rabu', startTime: '16:00', endTime: '18:00', description: 'Ekstrakurikuler' },
    { day: 'Jumat', startTime: '11:30', endTime: '13:30', description: 'Sholat Jumat dan istirahat' },
  ]);
  
  // Handle save settings
  const handleSaveSettings = () => {
    toast({
      title: 'Pengaturan disimpan',
      description: 'Preferensi belajar dan pengaturan jadwal Anda telah diperbarui',
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Algorithm Settings */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Pengaturan Algoritma</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Pilih algoritma machine learning yang akan digunakan untuk menyusun rekomendasi jadwal
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="algorithm">Algoritma Penjadwalan</Label>
            <Select 
              value={learningAlgorithm} 
              onValueChange={setLearningAlgorithm}
            >
              <SelectTrigger id="algorithm">
                <SelectValue placeholder="Pilih algoritma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xgboost">XGBoost (Rekomendasi)</SelectItem>
                <SelectItem value="random-forest">Random Forest</SelectItem>
                <SelectItem value="basic">Penjadwalan Dasar (Tanpa ML)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-700">Tentang XGBoost</h4>
            <p className="text-sm mt-1">
              XGBoost memberikan rekomendasi jadwal yang lebih optimal dengan mempelajari pola studi dan
              preferensi belajar Anda. Algoritma ini menyesuaikan jadwal berdasarkan tingkat kesulitan
              mata kuliah, kecenderungan belajar, dan waktu optimal.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="optimize-for">Optimasi Jadwal Untuk</Label>
            </div>
            <Select defaultValue="balanced">
              <SelectTrigger id="optimize-for">
                <SelectValue placeholder="Pilih strategi optimasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Seimbang (Rekomendasi)</SelectItem>
                <SelectItem value="performance">Performa Maksimal</SelectItem>
                <SelectItem value="efficiency">Efisiensi Waktu</SelectItem>
                <SelectItem value="focus">Fokus pada Mata Kuliah Sulit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AnimatedCard>

      {/* SKS Definition */}
      <SKSInput />
      
      {/* Time Constraints */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Batasan Waktu</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Tetapkan waktu-waktu yang tidak tersedia untuk belajar
          </p>
          
          {constraints.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="border-t border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Hari</TableHead>
                    <TableHead>Mulai</TableHead>
                    <TableHead>Selesai</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {constraints.map((constraint, index) => (
                    <TableRow key={index}>
                      <TableCell>{constraint.day}</TableCell>
                      <TableCell>{constraint.startTime}</TableCell>
                      <TableCell>{constraint.endTime}</TableCell>
                      <TableCell>{constraint.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Belum ada batasan waktu yang ditambahkan</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label htmlFor="day">Hari</Label>
              <Select defaultValue="Senin">
                <SelectTrigger id="day">
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Senin">Senin</SelectItem>
                  <SelectItem value="Selasa">Selasa</SelectItem>
                  <SelectItem value="Rabu">Rabu</SelectItem>
                  <SelectItem value="Kamis">Kamis</SelectItem>
                  <SelectItem value="Jumat">Jumat</SelectItem>
                  <SelectItem value="Sabtu">Sabtu</SelectItem>
                  <SelectItem value="Minggu">Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startTime">Mulai</Label>
              <Input id="startTime" type="time" defaultValue="08:00" />
            </div>
            
            <div>
              <Label htmlFor="endTime">Selesai</Label>
              <Input id="endTime" type="time" defaultValue="10:00" />
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">Tambah Batasan</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sleepTime">Jam Tidur</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Waktu tidur</p>
                <Input id="sleepTime" type="time" defaultValue="22:00" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Waktu bangun</p>
                <Input id="wakeTime" type="time" defaultValue="06:00" />
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Learning Preferences */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Preferensi Belajar</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studySessionDuration">Durasi Sesi Belajar Optimal</Label>
              <Select defaultValue="45">
                <SelectTrigger id="studySessionDuration">
                  <SelectValue placeholder="Pilih durasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 menit (Pomodoro Pendek)</SelectItem>
                  <SelectItem value="45">45 menit (Rekomendasi)</SelectItem>
                  <SelectItem value="60">60 menit</SelectItem>
                  <SelectItem value="90">90 menit</SelectItem>
                  <SelectItem value="120">120 menit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breakDuration">Durasi Istirahat Antar Sesi</Label>
              <Select defaultValue="10">
                <SelectTrigger id="breakDuration">
                  <SelectValue placeholder="Pilih durasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 menit</SelectItem>
                  <SelectItem value="10">10 menit (Rekomendasi)</SelectItem>
                  <SelectItem value="15">15 menit</SelectItem>
                  <SelectItem value="30">30 menit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Kekuatan & Kelemahan Mata Kuliah</Label>
            <div className="overflow-x-auto">
              <Table className="border-t border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>Kekuatan</TableHead>
                    <TableHead>Kelemahan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursePreferences.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={course.isStrength} 
                          aria-label={`${course.name} adalah kekuatan`}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={course.isWeakness} 
                          aria-label={`${course.name} adalah kelemahan`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Integration Settings */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Integrasi & Notifikasi</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="calendarIntegration" className="text-base font-medium">
                Integrasi Google Calendar
              </Label>
              <p className="text-sm text-muted-foreground">
                Sinkronkan jadwal belajar ke Google Calendar
              </p>
            </div>
            <Switch 
              id="calendarIntegration" 
              checked={integrateCalendar} 
              onCheckedChange={setIntegrateCalendar}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-base font-medium">
                Notifikasi Pengingat Belajar
              </Label>
              <p className="text-sm text-muted-foreground">
                Dapatkan pengingat 30 menit sebelum jadwal belajar dimulai
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={showNotifications} 
              onCheckedChange={setShowNotifications}
            />
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700">Fitur Mendatang</h4>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
              <li>Integrasi dengan sistem LMS universitas</li>
              <li>Fitur kolaborasi belajar dengan teman</li>
              <li>Analisis performa akademik</li>
              <li>Gamifikasi untuk meningkatkan motivasi belajar</li>
            </ul>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Save Settings Button */}
      <Button 
        onClick={handleSaveSettings} 
        className="w-full" 
        size="lg"
      >
        <Save className="mr-2 h-5 w-5" />
        Simpan Pengaturan
      </Button>
    </div>
  );
}
