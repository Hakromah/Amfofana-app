/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [studentId, setStudentId] = useState('');

  const fetchResults = async () => {
    let url = '/admin/results/filter';
    if (studentId) {
      url += `?studentId=${studentId}`;
    }
    try {
      const response = await api.get(url);
      setResults(response.data);
    } catch (error) {
      toast.error('Failed to fetch results');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchResults();
    };

    loadData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">View Student Results</h1>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Enter Student ID to Filter"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button onClick={fetchResults}>Search</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.exam.classe.name}</TableCell>
              <TableCell>{result.student.name}</TableCell>
              <TableCell>{result.exam.subject.name}</TableCell>
              <TableCell>{result.marks}</TableCell>
              <TableCell>{result.grade || 'N/A'}</TableCell>
              <TableCell>{result.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
