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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const formSchema = z.object({
  subjectId: z.string().min(1, { message: 'Subject is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
});

interface Exam {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  classe: { id: number; name: string };
  subject: { id: number; name: string };
}

interface Subject {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

export default function TeacherExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: '',
      classId: '',
      date: '',
      startTime: '',
      endTime: '',
    },
  });

  const fetchInitialData = async () => {
    try {
      const [examsRes, subjectsRes, classesRes] = await Promise.all([
        api.get('/teacher/exams'),
        api.get('/teacher/subjects'),
        api.get('/teacher/classes'),
      ]);
      setExams(examsRes.data);
      setSubjects(subjectsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchInitialData();
    };

    loadData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isEditing = !!editingExam;
    const toastId = toast.loading(isEditing ? 'Updating exam...' : 'Creating exam...');

    const selectedSubject = subjects.find(s => s.id === parseInt(values.subjectId));
    const examName = selectedSubject ? selectedSubject.name : 'Exam';

    const payload = {
      name: examName,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      classe: { id: parseInt(values.classId) },
      subject: { id: parseInt(values.subjectId) },
    };

    try {
      if (isEditing) {
        await api.put(`/teacher/exams/${editingExam.id}`, payload);
        toast.success('Exam updated successfully', { id: toastId });
      } else {
        await api.post('/teacher/exams', payload);
        toast.success('Exam created successfully', { id: toastId });
      }
      fetchInitialData();
      setIsDialogOpen(false);
      setEditingExam(null);
      form.reset();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update exam' : 'Failed to create exam', { id: toastId });
      console.log(error);
    }
  };

  const openDialog = (exam: Exam | null = null) => {
    setEditingExam(exam);
    if (exam) {
      form.reset({
        subjectId: String(exam.subject.id),
        classId: String(exam.classe.id),
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
      });
    } else {
      form.reset({
        subjectId: '',
        classId: '',
        date: '',
        startTime: '',
        endTime: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const toastId = toast.loading('Deleting exam...');
    try {
      await api.delete(`/teacher/exams/${id}`);
      toast.success('Exam deleted successfully', { id: toastId });
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete exam', { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Exams Management</h1>
        <Button onClick={() => openDialog()}>Create Exam</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject (Exam Name)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={String(subject.id)}>
                            {subject.name}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingExam ? 'Save Changes' : 'Create'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exam Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{exam.classe?.name || 'N/A'}</TableCell>
              <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
              <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => openDialog(exam)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
