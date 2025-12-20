/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

const formSchema = z.object({
  studentId: z.string().min(1, { message: 'Student is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
});

interface UserDTO {
  id: number;
  name: string;
}

interface ClasseDTO {
  id: number;
  name: string;
}

export default function AssignStudentPage() {
  const [students, setStudents] = useState<UserDTO[]>([]);
  const [classes, setClasses] = useState<ClasseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      classId: '',
    },
  });

  const fetchStudentsAndClasses = async () => {
    try {
      const [studentsResponse, classesResponse] = await Promise.all([
        api.get('/admin/users?role=STUDENT'),
        api.get('/admin/classes'),
      ]);
      setStudents(studentsResponse.data);
      setClasses(classesResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudentsAndClasses();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const toastId = toast.loading('Assigning student...');
    try {
      await api.post('/admin/assign-student', {
        studentId: parseInt(values.studentId),
        classId: parseInt(values.classId),
      });
      toast.success('Assignment Successful', { id: toastId });
      form.reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error('Assignment Failed', {
        id: toastId,
        description: (
          <span className="text-yellow-500 text-sm font-medium">
            {errorMessage}
          </span>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Assign Student to Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Assigning...' : 'Assign'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
