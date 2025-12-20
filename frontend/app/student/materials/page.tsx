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
import { toast } from 'sonner';
import api from '@/lib/api';

interface Material {
  id: number;
  fileName: string;
  className: string;
}

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get('/student/materials');
        setMaterials(response.data);
      } catch (error) {
        toast.error('Failed to fetch materials', {
          description: 'Something went wrong. Please try again.',
        });
      }
    };
    fetchMaterials();
  }, []);

  const handleDownload = (materialId: number, fileName: string) => {
    toast.loading('Downloading file...');
    api.get(`/student/materials/${materialId}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Download complete');
      })
      .catch(() => {
        toast.error('Download failed');
      });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Learning Materials</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.fileName}</TableCell>
              <TableCell>{material.className}</TableCell>
              <TableCell>
                <Button onClick={() => handleDownload(material.id, material.fileName)}>
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
