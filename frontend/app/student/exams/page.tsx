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
import { toast } from 'sonner';
import api from '@/lib/api';

interface Exam {
  id: number;
  name: string;
}

export default function StudentExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/student/exams');
        setExams(response.data);
      } catch (error) {
        toast.error('Failed to fetch exams');
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Exams</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.id}</TableCell>
              <TableCell>{exam.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
