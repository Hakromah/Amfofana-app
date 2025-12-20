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
import { toast } from 'sonner';
import api from '@/lib/api';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Subject name is required' }),
});

interface Subject {
  id: number;
  name: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/admin/subjects');
      setSubjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch subjects');
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSubjects();
    };

    loadData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isEditing = !!editingSubject;
    const toastId = toast.loading(isEditing ? 'Updating subject...' : 'Creating subject...');

    try {
      if (isEditing) {
        await api.put(`/admin/subjects/${editingSubject.id}`, values);
        toast.success('Subject updated successfully', { id: toastId });
      } else {
        await api.post('/admin/subjects', values);
        toast.success('Subject created successfully', { id: toastId });
      }
      fetchSubjects();
      setIsDialogOpen(false);
      setEditingSubject(null);
      form.reset();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update subject' : 'Failed to create subject', { id: toastId });
      console.log(error);
    }
  };

  const openDialog = (subject: Subject | null = null) => {
    setEditingSubject(subject);
    form.reset({ name: subject?.name || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const toastId = toast.loading('Deleting subject...');
    try {
      await api.delete(`/admin/subjects/${id}`);
      toast.success('Subject deleted successfully', { id: toastId });
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to delete subject', { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subject Management</h1>
        <Button onClick={() => openDialog()}>Create Subject</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingSubject ? 'Save Changes' : 'Create'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.id}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => openDialog(subject)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(subject.id)}>
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
