'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';
import { startTransition, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Class {
  id: number;
  name: string;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await api.get('/teacher/classes');
        if (!isMounted) return;
        startTransition(() => {
          setClasses(response.data);
        });
      } catch (error) {
        toast.error('Failed to fetch classes');
        console.error(error);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Classes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
