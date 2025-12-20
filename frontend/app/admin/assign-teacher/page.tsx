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
  teacherId: z.string().min(1, { message: 'Teacher is required' }),
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

export default function AssignTeacherPage() {
  const [teachers, setTeachers] = useState<UserDTO[]>([]);
  const [classes, setClasses] = useState<ClasseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherId: '',
      classId: '',
    },
  });

  const fetchTeachersAndClasses = async () => {
    try {
      const [teachersResponse, classesResponse] = await Promise.all([
        api.get('/admin/users?role=TEACHER'),
        api.get('/admin/classes'),
      ]);
      setTeachers(teachersResponse.data);
      setClasses(classesResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeachersAndClasses();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const toastId = toast.loading('Assigning teacher...');
    try {
      await api.post('/admin/assign-teacher', {
        teacherId: parseInt(values.teacherId),
        classId: parseInt(values.classId),
      });
      toast.success('Assignment Successful', { id: toastId });
      form.reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error('Assignment Failed', {
        id: toastId,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Assign Teacher to Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={String(teacher.id)}>
                            {teacher.name}
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
