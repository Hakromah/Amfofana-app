'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
}

interface Classe {
  id: number;
  name: string;
}

interface Exam {
  id: number;
  name: string;
  classe: Classe;
  subject: { id: number; name: string };
  date: string;
  startTime: string;
  endTime: string;
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>('');

  const fetchInitialData = async () => {
    try {
      const [teachersRes, classesRes] = await Promise.all([
        api.get('/admin/users?role=TEACHER'),
        api.get('/admin/classes'),
      ]);
      setTeachers(teachersRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      toast.error('Failed to fetch initial data');
      console.log(error);
    }
  };

  // const fetchExams = async () => {
  //   let url = '/admin/exams';
  //   if (filterType === 'teacher' && selectedId) {
  //     url = `/admin/exams?teacherId=${selectedId}`;
  //   } else if (filterType === 'class' && selectedId) {
  //     url = `/admin/exams?classId=${selectedId}`;
  //   }

  //   try {
  //     const response = await api.get(url);
  //     setExams(response.data);
  //   } catch (error) {
  //     toast.error('Failed to fetch exams');
  //     console.log(error);
  //   }
  // };

  const fetchExams = async (type = filterType, id = selectedId) => {
    let url = '/admin/exams';
    if (type === 'teacher' && id) {
      url = `/admin/exams?teacherId=${id}`;
    } else if (type === 'class' && id) {
      url = `/admin/exams?classId=${id}`; 
    }

    try {
      const response = await api.get(url);
      setExams(response.data);
    } catch (error) {
      toast.error('Failed to fetch exams');
      console.log(error)
    }
  };
  useEffect(() => {
    const loadInitial = async () => {
      await fetchInitialData();
      await fetchExams(); // Load all exams once on mount
    };
    loadInitial();
  }, []);

  // 2. Create a handler for when the Filter Type changes
  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setSelectedId('');

    // If they switch back to 'all', fetch everything immediately
    if (value === 'all') {
      fetchExams('all');
    }
  };

  // 3. Create a handler for when a specific ID (Teacher/Class) is selected
  const handleIdChange = (id: string) => {
    setSelectedId(id);
    fetchExams(filterType, id);
  };

  return (
    <div className="p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Exam Filter</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              <SelectItem value="teacher">By Teacher</SelectItem>
              <SelectItem value="class">By Class</SelectItem>
            </SelectContent>
          </Select>

          {filterType === 'teacher' && (
            <Select onValueChange={handleIdChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={String(teacher.id)}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filterType === 'class' && (
            <Select onValueChange={handleIdChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exam Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{exam.classe.name}</TableCell>
              <TableCell>{exam.subject.name}</TableCell>
              <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
              <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
