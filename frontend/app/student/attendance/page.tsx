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

interface Attendance {
  className: string;
  date: string;
  present: boolean;
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/student/attendance');
        setAttendance(response.data);
      } catch (error) {
        toast.error('Failed to fetch attendance', {
          description: 'Something went wrong. Please try again.',
        });
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Attendance</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.className}</TableCell>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell>{record.present ? 'Present' : 'Absent'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
