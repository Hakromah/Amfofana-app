'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, School, BookOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ReportDTO {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalClasses: number;
  totalExams: number;
  totalSubjects: number;
}

export default function AdminDashboard() {
  const [report, setReport] = useState<ReportDTO | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/admin/reports/summary');
        setReport(response.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.log(error);
      }
    };

    fetchReport();
  }, []);

  if (!report) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              Active teachers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Active classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Exams
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalExams}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled exams
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Active subjects
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
