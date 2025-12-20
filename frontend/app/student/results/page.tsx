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
import { toast } from 'sonner';
import api from '@/lib/api';

interface ExamResult {
  id: number;
  exam: { name: string; classe: { name: string } };
  marks: number;
  grade: string | null;
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/student/results');
        setResults(response.data);
      } catch (error) {
        toast.error('Failed to fetch results');
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Exam Results</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.exam.name}</TableCell>
              <TableCell>{result.exam.classe.name}</TableCell>
              <TableCell>{result.marks}</TableCell>
              <TableCell>{result.grade || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
