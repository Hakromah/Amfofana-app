/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';
import ResultForm from '@/components/forms/ResultForm';

export default function TeacherResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any | null>(null);
  const [filterClassId, setFilterClassId] = useState('all'); // Initialize as 'all'
  const [filterStudentId, setFilterStudentId] = useState('');

  // Wrapped in useCallback so it can be used in useEffect safely
  const fetchResults = useCallback(async () => {
    const url = '/teacher/results/filter';
    const params = new URLSearchParams();

    // Convert 'all' back to empty for API call
    if (filterClassId && filterClassId !== 'all') {
      params.append('classId', filterClassId);
    }
    if (filterStudentId) {
      params.append('studentId', filterStudentId);
    }

    try {
      const response = await api.get(`${url}?${params.toString()}`);
      setResults(response.data);
    } catch (error) {
      toast.error('Failed to fetch results');
      console.error(error);
    }
  }, [filterClassId, filterStudentId]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data);
    } catch (error) {
      toast.error('Failed to fetch classes');
      console.log(error)
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchClasses();
      await fetchResults();
    };

    loadData();
  }, []);

  const openDialog = (result: any | null = null) => {
    setEditingResult(result);
    setIsDialogOpen(true);
  };

  const handleSubmitResults = async () => {
    const draftResultIds = results
      .filter(r => r.status === 'DRAFT')
      .map(r => r.id);

    if (draftResultIds.length === 0) {
      toast.info('No draft results to submit.');
      return;
    }

    const toastId = toast.loading('Submitting results...');
    try {
      await api.post('/teacher/results/submit', draftResultIds);
      toast.success('Results submitted successfully', { id: toastId });
      fetchResults();
    } catch (error) {
      toast.error('Failed to submit results', { id: toastId });
      console.log(error)
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Results Management</h1>
          <p className="text-muted-foreground">Manage student marks and exam performance.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openDialog()}>Add Record</Button>
          <Button variant="secondary" onClick={handleSubmitResults}>Submit All Drafts</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Class Filter</label>
          <Select value={filterClassId} onValueChange={setFilterClassId}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Search Student</label>
          <Input
            className="w-60"
            placeholder="Student ID..."
            value={filterStudentId}
            onChange={(e) => setFilterStudentId(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results && results.length > 0 ? (
              results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.exam.classe.name}</TableCell>
                  <TableCell>{result.student.name}</TableCell>
                  <TableCell>{result.exam.subject.name}</TableCell>
                  <TableCell>{result.marks}</TableCell>
                  <TableCell>{result.grade || '—'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${result.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {result.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {result.status === 'DRAFT' && (
                      <Button variant="outline" size="sm" onClick={() => openDialog(result)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
          </DialogHeader>
          <ResultForm
            result={editingResult}
            onFinished={() => {
              setIsDialogOpen(false);
              fetchResults();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useEffect, useState } from 'react';
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import api from '@/lib/api';
// import ResultForm from '@/components/forms/ResultForm';

// export default function TeacherResultsPage() {
//   const [results, setResults] = useState<any[]>([]);
//   const [classes, setClasses] = useState<any[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingResult, setEditingResult] = useState<any | null>(null);
//   const [filterClassId, setFilterClassId] = useState('');
//   const [filterStudentId, setFilterStudentId] = useState('');

//   const fetchResults = async () => {
//     const url = '/teacher/results/filter';
//     const params = new URLSearchParams();
//     if (filterClassId) params.append('classId', filterClassId);
//     if (filterStudentId) params.append('studentId', filterStudentId);

//     try {
//       const response = await api.get(`${url}?${params.toString()}`);
//       setResults(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch results');
//       console.log(error);
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const response = await api.get('/teacher/classes');
//       setClasses(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch classes');
//       console.log(error)
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchClasses();
//       await fetchResults();
//     };

//     loadData();
//   }, []);

//   const openDialog = (result: any | null = null) => {
//     setEditingResult(result);
//     setIsDialogOpen(true);
//   };

//   const handleSubmitResults = async () => {
//     const draftResultIds = results
//       .filter(r => r.status === 'DRAFT')
//       .map(r => r.id);

//     if (draftResultIds.length === 0) {
//       toast.info('No draft results to submit.');
//       return;
//     }

//     toast.loading('Submitting results...');
//     try {
//       await api.post('/teacher/results/submit', draftResultIds);
//       toast.success('Results submitted successfully');
//       fetchResults();
//     } catch (error) {
//       toast.error('Failed to submit results');
//       console.log(error);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Results Management</h1>
//         <div className="flex gap-2">
//           <Button onClick={() => openDialog()}>Add Record</Button>
//           <Button onClick={handleSubmitResults}>Submit All Drafts</Button>
//         </div>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <Select onValueChange={setFilterClassId}>
//           <SelectTrigger className="w-[280px]">
//             <SelectValue placeholder="Filter by class" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Classes</SelectItem>
//             {classes.map((c) => (
//               <SelectItem key={c.id} value={String(c.id)}>
//                 {c.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Input
//           placeholder="Filter by Student ID"
//           value={filterStudentId}
//           onChange={(e) => setFilterStudentId(e.target.value)}
//         />
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
//           </DialogHeader>
//           <ResultForm
//             result={editingResult}
//             onFinished={() => {
//               setIsDialogOpen(false);
//               fetchResults();
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Class</TableHead>
//             <TableHead>Student</TableHead>
//             <TableHead>Subject</TableHead>
//             <TableHead>Score</TableHead>
//             <TableHead>Grade</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {results.map((result) => (
//             <TableRow key={result.id}>
//               <TableCell>{result.exam.classe.name}</TableCell>
//               <TableCell>{result.student.name}</TableCell>
//               <TableCell>{result.exam.subject.name}</TableCell>
//               <TableCell>{result.marks}</TableCell>
//               <TableCell>{result.grade || 'N/A'}</TableCell>
//               <TableCell>{result.status}</TableCell>
//               <TableCell>
//                 {result.status === 'DRAFT' && (
//                   <Button variant="outline" size="sm" onClick={() => openDialog(result)}>
//                     Edit
//                   </Button>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
