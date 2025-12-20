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
  classId: z.string().min(1, { message: 'Class is required' }),
  subjectId: z.string().min(1, { message: 'Subject is required' }),
  dayOfWeek: z.string().min(1, { message: 'Day is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
});

interface Timetable {
  id: number;
  classe: { id: number; name: string };
  subject: { id: number; name: string };
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Classe {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Timetable | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: '',
      subjectId: '',
      dayOfWeek: '',
      startTime: '', // Initialize with empty string to avoid uncontrolled input error
      endTime: '',   // Initialize with empty string
    },
  });

  const fetchTimetable = async () => {
    try {
      const response = await api.get('/admin/timetables');
      setTimetable(response.data);
    } catch (error) {
      toast.error('Failed to fetch timetable');
      console.log(error);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        api.get('/admin/classes'),
        api.get('/admin/subjects'),
      ]);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      toast.error('Failed to fetch initial data');
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      fetchTimetable();
      fetchInitialData();
    };

    loadData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isEditing = !!editingEntry;
    const toastId = toast.loading(isEditing ? 'Updating entry...' : 'Creating entry...');

    try {
      const payload = {
        classe: { id: parseInt(values.classId) },
        subject: { id: parseInt(values.subjectId) },
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime,
        endTime: values.endTime,
      };

      if (isEditing) {
        await api.put(`/admin/timetables/${editingEntry.id}`, payload);
        toast.success('Entry updated successfully', { id: toastId });
      } else {
        await api.post('/admin/timetables', payload);
        toast.success('Entry created successfully', { id: toastId });
      }
      fetchTimetable();
      setIsDialogOpen(false);
      setEditingEntry(null);
      form.reset({
        classId: '',
        subjectId: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      });
    } catch (error) {
      toast.error(isEditing ? 'Failed to update entry' : 'Failed to create entry', { id: toastId });
      console.log(error);
    }
  };

  const openDialog = (entry: Timetable | null = null) => {
    setEditingEntry(entry);
    if (entry) {
      form.reset({
        classId: String(entry.classe.id),
        subjectId: String(entry.subject.id),
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
      });
    } else {
      form.reset({
        classId: '',
        subjectId: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const toastId = toast.loading('Deleting entry...');
    try {
      await api.delete(`/admin/timetables/${id}`);
      toast.success('Entry deleted successfully', { id: toastId });
      fetchTimetable();
    } catch (error) {
      toast.error('Failed to delete entry', { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Timetable Management</h1>
        <Button onClick={() => openDialog()}>Add Entry</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Entry' : 'Add Timetable Entry'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((s) => (
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
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
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
              <Button type="submit">{editingEntry ? 'Save Changes' : 'Add'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timetable.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.classe.name}</TableCell>
              <TableCell>{entry.subject.name}</TableCell>
              <TableCell>{entry.dayOfWeek}</TableCell>
              <TableCell>{entry.startTime}</TableCell>
              <TableCell>{entry.endTime}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => openDialog(entry)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>
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
