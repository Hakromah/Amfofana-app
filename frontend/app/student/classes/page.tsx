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

// Interface for the nested teacher object
interface Teacher {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Updated Class interface to include the nested teacher object
interface Class {
  id: number;
  name: string;
  teacher: Teacher | null; // Teacher can be null
}

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/student/classes');
        if (response.status !== 200) {
          return null;
        }
        setClasses(response.data);
      } catch (error) {
        toast.error('Failed to fetch classes', {
          description: 'Something went wrong. Please try again.',
        });
        console.error(error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Classes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Teacher</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              {/* This will now work correctly */}
              <TableCell>{c.teacher?.name || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
