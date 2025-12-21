/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import api from '@/lib/api';

interface DeleteUserAlertProps {
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinished: () => Promise<void>;
}

export default function DeleteUserAlert({
  userId,
  open,
  onOpenChange,
  onFinished,
}: DeleteUserAlertProps) {

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      onOpenChange(false);
      await onFinished();
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Cannot delete: User is still assigned to active classes.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

