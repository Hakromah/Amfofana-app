'use client';

import { useEffect, useState, startTransition, } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Student {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface AttendanceRecord {
  studentId: number;
  present: boolean;
}

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

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

  const fetchStudentsByClass = async (classId: string) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/students`);
      setStudents(response.data);
      setAttendance(
        response.data.map((student: Student) => ({
          studentId: student.id,
          present: false,
        }))
      );
    } catch (error) {
      toast.error('Failed to fetch students');
      console.log(error)
    }
  };



  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    fetchStudentsByClass(classId);
  };

  const handleAttendanceChange = (studentId: number, present: boolean) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, present } : record
      )
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      await api.post(`/teacher/attendance`, {
        classId: parseInt(selectedClass),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        records: attendance,
      });
      toast.success('Attendance Submitted');
    } catch (error) {
      toast.error('Failed to submit attendance');
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Mark Attendance</h1>
      <div className="mb-4">
        <Select onValueChange={handleClassChange}>
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
      </div>
      {selectedClass && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={
                        attendance.find((a) => a.studentId === student.id)
                          ?.present ?? false
                      }
                      onCheckedChange={(checked) =>
                        handleAttendanceChange(student.id, !!checked)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleSubmitAttendance} className="mt-4">
            Submit Attendance
          </Button>
        </>
      )}
    </div>
  );
}
