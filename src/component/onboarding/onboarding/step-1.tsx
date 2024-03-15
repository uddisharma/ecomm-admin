'use client';
import FormSummary from './form-summary';
import { Button, Input, Password, Switch, Text, Title } from 'rizzui';
import Link from 'next/link';
import cn from '@/utils/class-names';
import { LoginSchema, loginSchema } from '@/utils/validators/login.schema';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { toast } from 'sonner';
import { BaseApi, Login, LoginSeller } from '@/constants/index';
import axios from 'axios';
import { UserContext } from '@/store/user/context';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { OnboardingContext } from '@/store/onboarding/context';

export default function StepOne({ step, setStep }: any) {
  const initialValues: LoginSchema = {
    email: '',
    password: '',
    rememberMe: true,
  };
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const { setOnboarding, state } = useContext(OnboardingContext);
  // useEffect(() => {
  //   const seller = state?.onboarding?.email;
  //   if (seller) {
  //     setStep(2);
  //   }
  // }, []);

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    setLoading(true);
    axios
      .post(`${BaseApi}${LoginSeller}`, {
        username: data?.email,
        password: data?.password,
      })
      .then((res) => {
        if (res.data.status === 'SUCCESS') {
          // if (res.data.data?.isActive) {
          //   return toast.success(
          //     'You have complete your onboarding process ✌️',
          //     {
          //       description: 'Now you cannot re onboard again',
          //     }
          //   );
          // }

          setOnboarding(res.data.data);
          setStep(2);
          toast.success('Logined Successfully', {
            description: `as ${res.data.data?.email}`,
          });
          setReset(initialValues);
        } else if (res.data?.message == 'wrong password') {
          return toast.warning('Wrong Password');
        } else if (res.data?.message == 'user not found') {
          return toast.warning('Seller not found');
        } else {
          toast.error('something went wrong');
        }
      })
      .catch((err: any) => {
        console.log(err);
        toast.error('something went wrong');
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
            step={1}
            title="Welcome Back !"
            description="Ready to dive back into your account? Sign in to access your personalized dashboard, manage your listings, and explore the latest updates. Your journey continues here, where every click brings you closer to your goals. Let's make the most of your experience – sign in and let the adventure begin !"
          />
        </div>

        <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
          <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
            <Title
              as="h2"
              className="mb-5 text-center text-[26px] leading-normal @container md:text-3xl md:!leading-normal lg:mb-7 lg:pe-8 lg:text-3xl  xl:text-[32px] 2xl:pe-0 2xl:text-4xl"
            >
              Welcome back! Secure your account with just a few clicks
            </Title>
            <Form<LoginSchema>
              validationSchema={loginSchema}
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
                  <Password
                    label="Password"
                    placeholder="Enter your password"
                    color="info"
                    className="mt-5 [&>label>span]:font-medium"
                    {...register('password')}
                    error={errors.password?.message}
                  />

                  <div className="mb-5 mt-5 flex items-center justify-between">
                    <Switch
                      variant="flat"
                      label="Remember me"
                      color="info"
                      className="[&>label>span]:font-medium [&>label]:my-1"
                      {...register('rememberMe')}
                      error={errors.rememberMe?.message}
                    />
                    <Link
                      href={'/forgot-password'}
                      className="h-auto p-0 text-sm font-medium text-gray-900 underline transition-colors hover:text-primary hover:no-underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    isLoading={loading}
                    className=" w-full"
                    type="submit"
                    color="primary"
                  >
                    Sign In
                  </Button>
                  <Text className="mt-5 text-center text-[15px] leading-loose text-gray-500 lg:mt-5 xl:text-base">
                    {"Dont't"} have an account?{' '}
                    <span
                      onClick={() => {
                        setStep(0);
                      }}
                      // href={'/'}
                      className="cursor-pointer font-bold text-gray-700 transition-colors hover:text-primary"
                    >
                      Sign Up
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
