'use client';

import { startTransition, useEffect, useState } from 'react';
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

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       const response = await api.get('/teacher/students');
  //       setStudents(response.data);
  //     } catch (error) {
  //       toast.error('Failed to fetch students', {
  //         description: 'Something went wrong. Please try again.',
  //       });
  //       console.log(error);
  //     }
  //   };

  //   fetchStudents();
  // }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await api.get('/teacher/students');
        if (!isMounted) return;
        startTransition(() => {
          setStudents(response.data);
        });
      } catch (error) {
        toast.error('Failed to fetch students', {
          description: 'Something went wrong. Please try again.',
        });
        console.log(error);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Students</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
