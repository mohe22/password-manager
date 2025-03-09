import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Icon from '@/components/auth/icon';
import { Loader2 as Loader2Icon, Eye, EyeOff } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(12, { message: 'Password must be at least 12 characters' }),
  confirmPassword: z
    .string()
    .min(12, { message: 'Password must be at least 12 characters' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const id = queryParams.get("id");

  
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  console.log(token);
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/auth/reset-password',
        { token, new_password: data.newPassword,id },
        { withCredentials: true }
      );

      console.log(response);
      
      if (response.status === 200) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(response.data.detail);
      }
    } catch (error) {         
      const axiosError = error as AxiosError<{ detail?: string }>;
      const errorMessage =
        axiosError.response?.data.detail|| 'An error occurred. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='flex flex-row items-center justify-center h-screen'>
      <div className="text-black">
        <div className="relative mx-4 max-w-[340px] w-fit sm:w-[340px]">
          <Icon title={"Reset Password"} />
        </div>

        <div>
          <p className="mb-4 text-center text-sm text-zinc-600">
            Please enter your new password.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mx-1"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="newPassword"
                          placeholder="New Password"
                          autoComplete="new-password"
                          className="h-[42px] w-full rounded-sm border bg-white px-4 transition placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 ring-blue-300 border-zinc-300"
                          type={showNewPassword ? 'text' : 'password'} // Toggle type
                          name="newPassword"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-zinc-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-zinc-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="confirmPassword"
                          placeholder="Confirm Password"
                          autoComplete="new-password"
                          className="h-[42px] w-full rounded-sm border bg-white px-4 transition placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 ring-blue-300 border-zinc-300"
                          type={showConfirmPassword ? 'text' : 'password'} // Toggle type
                          name="confirmPassword"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-zinc-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-zinc-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-[42px] bg-[#10b981] rounded-[6px] text-sm flex items-center justify-center font-medium text-white cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="size-4 mx-1 animate-spin" />
                )}
                <span>Reset Password</span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;