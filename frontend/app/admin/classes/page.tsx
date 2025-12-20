'use client';

import DeleteClassAlert from '@/components/forms/DeleteClassAlert';
import EditClassForm from '@/components/forms/EditClassForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Class name is required' }),
  grade: z.string().min(1, { message: 'Grade is required' }),
});

interface Classe {
  id: number;
  name: string;
  grade: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

  const isMounted = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      grade: '',
    },
  });

  // Stable fetch function
  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get('/admin/classes');
      // avoid updating state if unmounted
      if (!isMounted.current) return;

      // mark update as non-urgent so React won't warn about sync setState in effect
      startTransition(() => {
        setClasses(response.data);
      });
    } catch (error) {
      if (!isMounted.current) return;
      toast.error('Failed to fetch classes');
      console.error('fetchClasses error:', error);
    }
  }, []); // stable identity

  // set mounted ref and run initial load
  useEffect(() => {
    isMounted.current = true;
    fetchClasses();

    return () => {
      isMounted.current = false;
    };
  }, [fetchClasses]);

  const handleCreateSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading('Creating class...');
    try {
      await api.post('/admin/classes', values);
      toast.success('Class created successfully');

      // wait for fetch to complete so UI is in sync before closing the dialog / resetting
      await fetchClasses();

      setIsCreateDialogOpen(false);
      form.reset();
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Failed to create class');
      toast.dismiss(toastId);
      console.error('handleCreateSubmit error:', error);
    }
  };

  const openEditDialog = (classe: Classe) => {
    setSelectedClass(classe);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (classe: Classe) => {
    setSelectedClass(classe);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Create Class</Button>
      </div>

      {/* Create Class Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // call handleSubmit only in the event handler (not during render)
                void form.handleSubmit(handleCreateSubmit)();
              }}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Class Name" {...field} />
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
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input placeholder="Grade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create</Button>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      {selectedClass && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
            </DialogHeader>
            <EditClassForm
              classe={selectedClass}
              onFinished={async () => {
                setIsEditDialogOpen(false);
                await fetchClasses();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Class Alert */}
      {selectedClass && isDeleteDialogOpen && (
        <DeleteClassAlert
          classId={selectedClass.id}
          onFinished={async () => {
            setIsDeleteDialogOpen(false);
            await fetchClasses();
          }}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.grade}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => openEditDialog(c)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(c)}
                >
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




// 'use client';

// import { useEffect, useState, useRef, useCallback, startTransition } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import api from '@/lib/api';
// import EditClassForm from '@/components/forms/EditClassForm';
// import DeleteClassAlert from '@/components/forms/DeleteClassAlert';

// const formSchema = z.object({
//   name: z.string().min(1, { message: 'Class name is required' }),
//   grade: z.string().min(1, { message: 'Grade is required' }),
// });

// interface Classe {
//   id: number;
//   name: string;
//   grade: string;
// }

// export default function ClassesPage() {
//   const [classes, setClasses] = useState<Classe[]>([]);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

//   const isMounted = useRef(true);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       grade: '',
//     },
//   });

//   const fetchClasses = async () => {
//     try {
//       const response = await api.get('/admin/classes');
//       setClasses(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch classes');
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const handleCreateSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await api.post('/admin/classes', values);
//       toast.success('Class created successfully');
//       fetchClasses();
//       setIsCreateDialogOpen(false);
//       form.reset();
//     } catch (error) {
//       toast.error('Failed to create class');
//     }
//   };

//   const openEditDialog = (classe: Classe) => {
//     setSelectedClass(classe);
//     setIsEditDialogOpen(true);
//   };

//   const openDeleteDialog = (classe: Classe) => {
//     setSelectedClass(classe);
//     setIsDeleteDialogOpen(true);
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Class Management</h1>
//         <Button onClick={() => setIsCreateDialogOpen(true)}>Create Class</Button>
//       </div>

//       {/* Create Class Dialog */}
//       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Class</DialogTitle>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-8">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Class Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Class Name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="grade"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Grade</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Grade" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit">Create</Button>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Class Dialog */}
//       {selectedClass && (
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit Class</DialogTitle>
//             </DialogHeader>
//             <EditClassForm
//               classe={selectedClass}
//               onFinished={() => {
//                 setIsEditDialogOpen(false);
//                 fetchClasses();
//               }}
//             />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Delete Class Alert */}
//       {selectedClass && isDeleteDialogOpen && (
//         <DeleteClassAlert
//           classId={selectedClass.id}
//           onFinished={() => {
//             setIsDeleteDialogOpen(false);
//             fetchClasses();
//           }}
//           onOpenChange={setIsDeleteDialogOpen}
//         />
//       )}

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Grade</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {classes.map((c) => (
//             <TableRow key={c.id}>
//               <TableCell>{c.id}</TableCell>
//               <TableCell>{c.name}</TableCell>
//               <TableCell>{c.grade}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="mr-2"
//                   onClick={() => openEditDialog(c)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => openDeleteDialog(c)}
//                 >
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
