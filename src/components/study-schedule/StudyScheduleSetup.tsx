
import React, { useState } from 'react';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Clock, Book, BarChart, Save, Brain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Define course difficulty levels
const difficultyLevels = [
  { value: '1', label: 'Sangat Mudah' },
  { value: '2', label: 'Mudah' },
  { value: '3', label: 'Sedang' },
  { value: '4', label: 'Sulit' },
  { value: '5', label: 'Sangat Sulit' },
];

// Define evaluation methods
const evaluationMethods = [
  { value: 'exam', label: 'Ujian' },
  { value: 'assignment', label: 'Tugas' },
  { value: 'project', label: 'Proyek' },
  { value: 'presentation', label: 'Presentasi' },
  { value: 'mix', label: 'Campuran' },
];

// Course type interface
interface Course {
  id: string;
  name: string;
  sks: number;
  difficulty: string;
  practicum: boolean;
  evaluationMethod: string;
  targetGrade: string;
  notes: string;
}

export function StudyScheduleSetup() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Course>({
    id: '',
    name: '',
    sks: 2,
    difficulty: '3',
    practicum: false,
    evaluationMethod: 'mix',
    targetGrade: 'A',
    notes: '',
  });
  const [sksDefinition, setSksDefinition] = useState<number>(50); // Default 50 minutes per SKS
  const [error, setError] = useState<string | null>(null);

  // Generate a unique ID for a new course
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Handle input changes for new course
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes for new course
  const handleSelectChange = (name: string, value: string) => {
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for new course
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: checked }));
  };

  // Add a new course to the list
  const handleAddCourse = () => {
    if (!newCourse.name) {
      setError('Nama mata kuliah harus diisi');
      return;
    }

    // Add the new course with a unique ID
    const courseToAdd = { ...newCourse, id: generateId() };
    setCourses([...courses, courseToAdd]);

    // Reset the form
    setNewCourse({
      id: '',
      name: '',
      sks: 2,
      difficulty: '3',
      practicum: false,
      evaluationMethod: 'mix',
      targetGrade: 'A',
      notes: '',
    });
    setError(null);

    toast({
      title: 'Mata kuliah ditambahkan',
      description: `${courseToAdd.name} berhasil ditambahkan ke daftar`,
    });
  };

  // Remove a course from the list
  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
    toast({
      title: 'Mata kuliah dihapus',
      description: 'Mata kuliah berhasil dihapus dari daftar',
    });
  };

  // Save all courses and SKS definition
  const handleSave = () => {
    if (courses.length === 0) {
      setError('Tambahkan minimal satu mata kuliah');
      return;
    }

    // In a real app, you would save this data to a database or localStorage
    // For now, we'll just show a success message
    toast({
      title: 'Data berhasil disimpan',
      description: `${courses.length} mata kuliah dengan definisi SKS ${sksDefinition} menit telah disimpan`,
    });

    // You can add additional logic to navigate to the next tab or update global state
  };

  return (
    <div className="space-y-6">
      {/* SKS Definition Input */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Definisi SKS</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Berapa menit waktu belajar mandiri yang diasumsikan per 1 SKS per minggu di universitas Anda?
          </p>
          
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              value={sksDefinition}
              onChange={(e) => setSksDefinition(parseInt(e.target.value) || 50)}
              min={10}
              max={120}
              className="w-24"
            />
            <span>menit per 1 SKS per minggu</span>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p>
              <strong>Contoh:</strong> Jika Anda memasukkan 50 menit, maka untuk mata kuliah 3 SKS akan
              dialokasikan 150 menit (2,5 jam) waktu belajar mandiri per minggu.
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Course List */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Book className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Daftar Mata Kuliah</h3>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          
          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="border-t border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Mata Kuliah</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead>Kesulitan</TableHead>
                    <TableHead>Praktikum</TableHead>
                    <TableHead>Target Nilai</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{course.sks}</TableCell>
                      <TableCell>
                        {difficultyLevels.find((d) => d.value === course.difficulty)?.label}
                      </TableCell>
                      <TableCell>{course.practicum ? 'Ya' : 'Tidak'}</TableCell>
                      <TableCell>{course.targetGrade}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center border-dashed border-2 border-gray-200 rounded-lg">
              <Book className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">Belum ada mata kuliah</h3>
              <p className="text-sm text-gray-500">
                Tambahkan mata kuliah untuk membuat jadwal belajar
              </p>
            </div>
          )}
        </div>
      </AnimatedCard>

      {/* Add New Course Form */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Tambah Mata Kuliah</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Mata Kuliah</Label>
              <Input
                id="name"
                name="name"
                value={newCourse.name}
                onChange={handleInputChange}
                placeholder="Contoh: Kalkulus 1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sks">Jumlah SKS</Label>
              <Input
                id="sks"
                name="sks"
                type="number"
                value={newCourse.sks}
                onChange={handleInputChange}
                min={1}
                max={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
              <Select
                value={newCourse.difficulty}
                onValueChange={(value) => handleSelectChange('difficulty', value)}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Pilih tingkat kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="evaluationMethod">Metode Evaluasi</Label>
              <Select
                value={newCourse.evaluationMethod}
                onValueChange={(value) => handleSelectChange('evaluationMethod', value)}
              >
                <SelectTrigger id="evaluationMethod">
                  <SelectValue placeholder="Pilih metode evaluasi" />
                </SelectTrigger>
                <SelectContent>
                  {evaluationMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetGrade">Target Nilai</Label>
              <Select
                value={newCourse.targetGrade}
                onValueChange={(value) => handleSelectChange('targetGrade', value)}
              >
                <SelectTrigger id="targetGrade">
                  <SelectValue placeholder="Pilih target nilai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="BC">BC</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="practicum"
                name="practicum"
                checked={newCourse.practicum}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="practicum">Mata kuliah memiliki praktikum</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (opsional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={newCourse.notes}
              onChange={handleInputChange}
              placeholder="Tambahkan catatan khusus untuk mata kuliah ini..."
              rows={3}
            />
          </div>
          
          <Button onClick={handleAddCourse} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Mata Kuliah
          </Button>
        </div>
      </AnimatedCard>

      {/* Assessment Parameters */}
      <AnimatedCard animation="fade" className="p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Parameter Asesmen</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Tetapkan parameter tambahan untuk mempersonalisasi jadwal belajar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studyStyle">Gaya Belajar yang Disukai</Label>
              <Select defaultValue="visual">
                <SelectTrigger id="studyStyle">
                  <SelectValue placeholder="Pilih gaya belajar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditory">Auditori</SelectItem>
                  <SelectItem value="kinesthetic">Kinestetik</SelectItem>
                  <SelectItem value="reading">Membaca/Menulis</SelectItem>
                  <SelectItem value="mixed">Campuran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="motivation">Tingkat Motivasi Belajar</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="motivation">
                  <SelectValue placeholder="Pilih tingkat motivasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredTime">Waktu Belajar yang Disukai</Label>
              <Select defaultValue="evening">
                <SelectTrigger id="preferredTime">
                  <SelectValue placeholder="Pilih waktu belajar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Pagi (05:00 - 10:00)</SelectItem>
                  <SelectItem value="noon">Siang (10:00 - 14:00)</SelectItem>
                  <SelectItem value="afternoon">Sore (14:00 - 18:00)</SelectItem>
                  <SelectItem value="evening">Malam (18:00 - 22:00)</SelectItem>
                  <SelectItem value="night">Larut malam (22:00 - 05:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studyDays">Hari Belajar</Label>
              <Select defaultValue="5days">
                <SelectTrigger id="studyDays">
                  <SelectValue placeholder="Pilih hari belajar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5days">5 hari (Senin-Jumat)</SelectItem>
                  <SelectItem value="7days">7 hari (Senin-Minggu)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        className="w-full" 
        size="lg"
        disabled={courses.length === 0}
      >
        <Save className="mr-2 h-5 w-5" />
        Simpan & Buat Jadwal Belajar
      </Button>
    </div>
  );
}
