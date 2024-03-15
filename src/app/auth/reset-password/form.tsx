'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Password } from '@/component/ui/password';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Text } from '@/component/ui/text';

import {
  ResetPasswordSchema1,
  resetPasswordSchema1,
} from '@/utils/validators/reset.schema';

import axios from 'axios';
import { AdminResetPassword, BaseApi, ResetPassword } from '@/constants';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const initialValues = {
  password: '',
  confirmPassword: '',
};

export default function ForgetPasswordForm() {
  const [reset, setReset] = useState({});
  const path = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // console.log(path);
  const onSubmit: SubmitHandler<ResetPasswordSchema1> = (data) => {
    // console.log(data);
    // setReset(initialValues);
    if (data.confirmPassword != data?.password) {
      return toast.error('Password Should Match');
    } else {
      setLoading(true);
      axios
        .put(`${BaseApi}${AdminResetPassword}`, {
          code: path?.id,
          newPassword: data?.password,
        })
        .then((res) => {
          if (res.data.status == 'SUCCESS') {
            toast.success('Password Reset Successfully');
            setReset(initialValues);
            router.push('/');
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
    }
  };

  return (
    <>
      <Form<ResetPasswordSchema1>
        validationSchema={resetPasswordSchema1}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
        className="pt-1.5"
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-6">
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              color="info"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <Password
              label="Confirm Password"
              placeholder="Enter confirm password"
              size="lg"
              className="[&>label>span]:font-medium"
              color="info"
              inputClassName="text-sm"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button
              className="mt-2 w-full"
              type="submit"
              isLoading={loading}
              size="lg"
              color="info"
            >
              Reset Password
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-8 lg:text-start xl:text-base">
        Don’t want to reset your password?{' '}
        <Link
          href={'/sign-in'}
          className="font-bold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
