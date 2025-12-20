'use client';

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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  classId: z.string().min(1, { message: 'Class is required' }),
  studentId: z.string().min(1, { message: 'Student is required' }),
  examId: z.string().min(1, { message: 'Exam is required' }),
  marks: z.string().refine((val) => !isNaN(Number(val)), { message: 'Score must be a number' }),
  grade: z.string().optional(),
});

interface ResultFormProps {
  result?: any;
  onFinished: () => void;
}

export default function ResultForm({ result, onFinished }: ResultFormProps) {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: result?.exam?.classe?.id ? String(result.exam.classe.id) : '',
      studentId: result?.student?.id ? String(result.student.id) : '',
      examId: result?.exam?.id ? String(result.exam.id) : '',
      marks: result?.marks ? String(result.marks) : '',
      grade: result?.grade || undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, examsRes] = await Promise.all([
          api.get('/teacher/classes'),
          api.get('/teacher/exams'),
        ]);
        setClasses(classesRes.data);
        setExams(examsRes.data);
      } catch (error) {
        toast.error('Failed to fetch initial data');
        console.log(error)
      }
    };
    fetchData();
  }, []);

  const handleClassChange = async (classId: string) => {
    form.setValue('classId', classId);
    try {
      const response = await api.get(`/teacher/classes/${classId}/students`);
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.log(error)
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading(result ? 'Updating result...' : 'Saving result...');
    try {
      const payload = {
        exam: { id: parseInt(values.examId) },
        student: { id: parseInt(values.studentId) },
        marks: parseFloat(values.marks),
        grade: values.grade || null,
      };

      if (result) {
        await api.put(`/teacher/results/${result.id}`, payload);
        toast.success('Result updated successfully');
      } else {
        await api.post('/teacher/results', payload);
        toast.success('Result saved successfully');
      }
      onFinished();
    } catch (error) {
      toast.error('Failed to save result');
      console.log(error)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={handleClassChange} defaultValue={field.value} disabled={!!result}>
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
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!result}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
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
          name="examId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!result}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {exams.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
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
          name="marks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
