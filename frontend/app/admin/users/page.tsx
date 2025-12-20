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
import EditUserForm from '@/components/forms/EditUserForm';
import DeleteUserAlert from '@/components/forms/DeleteUserAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const createFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  birthDate: z.string().optional(),
  birthCountry: z.string().optional(),
  birthCity: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
});

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  birthDate?: string;
  birthCountry?: string;
  birthCity?: string;
  address?: string;
  gender?: string;
  phoneNumber?: string;
}

interface Classe {
  id: number;
  name: string;
  grade: string;
  teacher: User | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentClasses, setStudentClasses] = useState<Classe[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'STUDENT',
      birthDate: '',
      birthCountry: '',
      birthCity: '',
      address: '',
      gender: '',
      phoneNumber: '',
    },
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateSubmit = async (values: z.infer<typeof createFormSchema>) => {
    try {
      await api.post('/admin/users', values);
      toast.success('User created successfully');
      fetchUsers();
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to create user');
      console.log(error);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleStudentSelect = async (studentId: string) => {
    setSelectedStudentId(studentId);
    if (studentId) {
      setIsLoadingClasses(true);
      try {
        const response = await api.get(`/admin/students/${studentId}/classes`);
        setStudentClasses(response.data);
      } catch (error) {
        toast.error("Failed to fetch student's classes");
        console.log(error);
      } finally {
        setIsLoadingClasses(false);
      }
    } else {
      setStudentClasses([]);
    }
  };

  return (
    <div className="p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student Class Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select onValueChange={handleStudentSelect}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.role === 'STUDENT')
                  .map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {isLoadingClasses ? (
            <p className="mt-4">Loading classes...</p>
          ) : (
            selectedStudentId && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Classes for Selected Student:</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Teacher</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentClasses.map((classe) => (
                      <TableRow key={classe.id}>
                        <TableCell>{classe.name}</TableCell>
                        <TableCell>{classe.grade}</TableCell>
                        <TableCell>{classe.teacher?.name || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Create User</Button>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="birthDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="birthCountry" render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="birthCity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full">Create User</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <EditUserForm
              user={selectedUser}
              onFinished={() => {
                setIsEditDialogOpen(false);
                fetchUsers();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedUser && (
        <DeleteUserAlert
          userId={selectedUser.id}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onFinished={async () => {
            setIsDeleteDialogOpen(false);
            await fetchUsers();
          }}
        />
      )}

      <div className="rounded-md border w-[90%]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>More Info</TableHead>
              {/* <TableHead>Birth Date</TableHead>
              <TableHead>Birth City</TableHead>
              <TableHead>Birth Country</TableHead>
              <TableHead>Address</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-fuchsia-950">{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber || '-'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.gender || '-'}</TableCell>

                {/* Popover Column */}
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                      >
                        More...
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 shadow-lg">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="font-semibold text-sm tracking-tight text-foreground">
                            Additional Details
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            ID: {user.userId}
                          </span>
                        </div>

                        <div className="grid gap-3">
                          {/* Birth Date & City (Side by Side) */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[11px] font-medium text-muted-foreground uppercase">Birth Date</p>
                              <p className="text-sm">{user.birthDate || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium text-muted-foreground uppercase">Birth City</p>
                              <p className="text-sm truncate" title={user.birthCity}>{user.birthCity || '-'}</p>
                            </div>
                          </div>

                          {/* Birth Country */}
                          <div>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase">Birth Country</p>
                            <p className="text-sm">{user.birthCountry || '-'}</p>
                          </div>

                          {/* Address - The fix for text overflow */}
                          <div className="pt-2 border-t">
                            <p className="text-[11px] font-medium text-muted-foreground uppercase mb-1">Residential Address</p>
                            <p className="text-sm leading-relaxed text-pretty wrap-break-word italic text-foreground/80">
                              {user.address || 'No address provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>

                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditDialog(user)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(user)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
