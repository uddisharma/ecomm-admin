'use client';
import FormSummary from './form-summary';
import { Button, Input, Password, Switch, Text, Textarea, Title } from 'rizzui';
import cn from '@/utils/class-names';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import axios from 'axios';
import { BaseApi, Register, RegisterSeller } from '@/constants/index';
import { toast } from 'sonner';
import { messages } from '@/config/messages';
import { z } from 'zod';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '@/utils/validators/common-rules';

const signUpSchema = z
  .object({
    email: validateEmail,
    username: z
      .string({ required_error: 'Username is required' })
      .refine((value) => !/\s/.test(value), {
        message: 'Username must not contain spaces',
      })
      .refine((value) => value === value.toLowerCase(), {
        message: 'Username must be in lowercase',
      }),
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
    isAgreed: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.passwordsDidNotMatch,
    path: ['confirmPassword'],
  });
type SignUpSchema = z.infer<typeof signUpSchema>;

export default function StepZero({ step, setStep }: any) {
  const initialValues: SignUpSchema = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    isAgreed: true,
  };
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState({});
  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    if (!data?.isAgreed) {
      return toast.warning('Please accpect Terms & Conditions');
    }
    if (data?.password != data?.confirmPassword) {
      return toast.warning("Password doesn't match");
    }
    setLoading(true);
    axios
      .post(`${BaseApi}${RegisterSeller}`, { ...data, isActive: false })
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setStep(1);
          return toast.success('Registration Successfull', {
            description: `as ${data?.email}`,
          });
        } else if (res?.data?.data?.status == 'EXIST') {
          return toast.warning('Email Exist', {
            description: `Seller Already Exist with this email`,
          });
        } else if (res?.data?.data?.status == 'USERNAME') {
          return toast.warning('Username Exist', {
            description: 'Seller Already Exist with this Username',
          });
        } else {
          return toast.error('Error Occured', {
            description: 'Something went wrong !',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Error Occured', {
          description: 'Something went wrong !',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <div
        className={cn(
          'mx-auto grid w-full max-w-screen-2xl grid-cols-12 place-content-center gap-6 px-5 py-10 @3xl:min-h-[calc(100vh-10rem)] @5xl:gap-8 @6xl:gap-16 xl:px-7'
        )}
      >
        <div className="col-span-full flex flex-col justify-center @5xl:col-span-5">
          <FormSummary
            className="@7xl:me-10"
            step={0}
            title="Join Our Community Today !"
            description="Ready to unlock the full potential of our platform? Sign up now to become a part of our vibrant community. Create your account in a few simple steps and gain access to a world of opportunities. we're excited to welcome you on board."
          />
        </div>

        <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
          <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
            <Title
              as="h2"
              className="mb-5 text-center text-[26px] leading-normal @container md:text-3xl md:!leading-normal lg:mb-7 lg:pe-8 lg:text-3xl  xl:text-[32px] 2xl:pe-0 2xl:text-4xl"
            >
              Join our community and unlock a world of possibilities
            </Title>
            <Form<SignUpSchema>
              validationSchema={signUpSchema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                mode: 'onChange',
                defaultValues: initialValues,
              }}
            >
              {({ register, formState: { errors } }) => (
                <div className="loginform">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    color="info"
                    className="[&>label>span]:font-medium"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <Input
                    type="text"
                    label="Username"
                    placeholder="Enter your Username"
                    color="info"
                    className="mt-5 [&>label>span]:font-medium"
                    {...register('username')}
                    error={errors.username?.message}
                  />
                  <Password
                    label="Password"
                    placeholder="Enter your password"
                    color="info"
                    className="mt-5 [&>label>span]:font-medium"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <Password
                    label="Confirm Password"
                    placeholder="Confirm password"
                    color="info"
                    className="mt-5 [&>label>span]:font-medium"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />

                  <div className="mb-5 mt-5 flex items-center justify-between">
                    <Switch
                      variant="flat"
                      label="Agree to terms & Conditions"
                      color="info"
                      className="[&>label>span]:font-medium [&>label]:my-1"
                      {...register('isAgreed')}
                      error={errors.isAgreed?.message}
                    />
                    {/* <Link
                      href={'/forgot-password'}
                      className="h-auto p-0 text-sm font-medium text-gray-900 underline transition-colors hover:text-primary hover:no-underline"
                    >
                      Forgot Password?
                    </Link> */}
                  </div>

                  <Button
                    isLoading={loading}
                    className=" w-full"
                    type="submit"
                    color="primary"
                  >
                    Sign Up
                  </Button>
                  <Text className="mt-5 text-center text-[15px] leading-loose text-gray-500 lg:mt-5 xl:text-base">
                    Already have an account?{' '}
                    <span
                      onClick={() => {
                        setStep(1);
                      }}
                      className="cursor-pointer font-bold text-gray-700 transition-colors hover:text-primary"
                    >
                      Sign In
                    </span>
                  </Text>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
