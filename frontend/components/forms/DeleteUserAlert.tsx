// 'use client';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { toast } from 'sonner';
// import api from '@/lib/api';

// interface DeleteUserAlertProps {
//   userId: number;
//   onFinished: () => void;
//   onOpenChange: (open: boolean) => void;
// }

// export default function DeleteUserAlert({
//   userId,
//   onFinished,
//   onOpenChange,
// }: DeleteUserAlertProps) {
//   const handleDelete = async () => {
//     try {
//       await api.delete(`/admin/users/${userId}`);
//       toast.success('User deleted successfully');
//       onFinished();
//     } catch (error) {
//       toast.error('Failed to delete user');
//       console.log(error);
//     }
//   };

//   return (
//     <AlertDialog open onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete the user.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

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

// interface DeleteUserAlertProps {
//   userId: number;
//   onFinished: () => void; // 👈 change here
//   onOpenChange: (open: boolean) => void;
// }

export default function DeleteUserAlert({
  userId,
  open,
  onOpenChange,
  onFinished,
}: DeleteUserAlertProps) {
  const handleDelete = async () => {
    await api.delete(`/admin/users/${userId}`);
    toast.success('User deleted');
    onOpenChange(false);
    await onFinished();
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

