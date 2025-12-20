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
  classId: z.string().min(1),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

interface LearningMaterial {
  id: number;
  url: string;
  classe: { id: number; name: string };
}

interface Classe {
  id: number;
  name: string;
}

export default function UploadMaterialsPage() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: '',
      url: '',
    },
  });

  const fetchMaterials = async () => {
    try {
      const response = await api.get('/teacher/materials');
      setMaterials(response.data);
    } catch (error) {
      toast.error('Failed to fetch materials');
      console.log(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data);
    } catch (error) {
      toast.error('Failed to fetch classes');
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchMaterials();
      await fetchClasses();
    };

    loadData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await api.post('/teacher/materials', {
        classe: { id: parseInt(values.classId) },
        url: values.url,
      });
      toast.success('Material uploaded successfully');
      fetchMaterials();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to upload material');
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    toast.loading('Deleting material...');
    try {
      await api.delete(`/teacher/materials/${id}`);
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to delete material');
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload Materials</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Upload Material</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Material</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/material.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Upload</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.classe.name}</TableCell>
              <TableCell>
                <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {material.url}
                </a>
              </TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(material.id)}>
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
