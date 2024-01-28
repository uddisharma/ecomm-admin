'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { useMedia } from '@/hooks/use-media';
import { Form } from '@/component/ui/form';
import { Text } from '@/component/ui/text';
import {
  forgetPasswordSchema,
  ForgetPasswordSchema,
} from '@/utils/validators/forget-password.schema';
import { useRouter } from 'next/navigation';
import { BaseApi, ForgotPassword } from '@/constants';
import axios from 'axios';
import { toast } from 'sonner';

const initialValues = {
  email: '',
};

export default function ForgetPasswordForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);

  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = (data: any) => {
    setLoading(true);
    axios
      .post(`${BaseApi}${ForgotPassword}`, {
        email: data?.email,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 'SUCCESS') {
          toast.success('Reset link sent to this email', {
            description: `${data?.email}`,
          });
          setReset(initialValues);
          router.push('/');
        } else if (res.data.status == 'RECORD_NOT_FOUND') {
          return toast.error('Record Not Found');
        } else {
          toast.error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="xl:pe-12 2xl:pe-20">
      <Form<ForgetPasswordSchema>
        validationSchema={forgetPasswordSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-6">
            <Input
              type="email"
              size={isMedium ? 'lg' : 'xl'}
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              color="info"
              {...register('email')}
              error={errors.email?.message}
            />
            <Button
              className="w-full"
              type="submit"
              isLoading={loading}
              size={isMedium ? 'lg' : 'xl'}
              color="info"
            >
              Reset Password
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-9 xl:text-base">
        Don’t want to reset?{' '}
        <Link
          href={'/auth/sign-in'}
          className="font-semibold text-gray-700 transition-colors hover:text-primary"
        >
          Sign In
        </Link>
      </Text>
    </div>
  );
}
