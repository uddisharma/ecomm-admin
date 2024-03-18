'use client';

import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { Password } from '@/component/ui/password';
import { Button } from '@/component/ui/button';
import { Switch } from '@/component/ui/switch';
import { Input } from '@/component/ui/input';
import { useMedia } from '@/hooks/use-media';
import { Form } from '@/component/ui/form';
import { loginSchema, LoginSchema } from '@/utils/validators/login.schema';
import { adminLogin, BaseApi, Login } from '@/constants';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserContext } from '@/store/user/context';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
const initialValues: LoginSchema = {
  email: '',
  password: '',
  rememberMe: true,
};

export default function SignInForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['admintoken']);
  const { setUser, state } = useContext(UserContext);

  useEffect(() => {
    const cookieValue = cookies.admintoken;
    const admin = state?.user?.name;
    if (cookieValue && admin) {
      router.push('/');
    }
  }, []);
  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    setLoading(true);
    axios
      .post(`${BaseApi}${adminLogin}`, {
        username: data?.email,
        password: data?.password,
      })
      .then((res) => {
        if (res.data.status === 'SUCCESS') {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);
          setCookie('admintoken', res.data.data.token, {
            path: '/',
            expires: expirationDate,
          });
          setUser(res.data.data);
          toast.success('Logined Successfully', {
            description: `as ${res.data.data?.email}`,
          });
          setReset(initialValues);
          if (params.has('ref')) {
            router.push(`/${params.get('ref')}`);
          } else {
            router.push('/');
          }
        } else if (res.data?.message == 'wrong password') {
          return toast.error('Wrong Password');
        } else if (res.data?.message == 'Seller not found') {
          return toast.error('User not found');
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

    // setReset({ email: "", password: "", isRememberMe: false });
  };

  return (
    <div className="xl:pe-12 2xl:pe-20">
      <Form<LoginSchema>
        validationSchema={loginSchema}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
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
              color="info"
              className="[&>label>span]:font-medium"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size={isMedium ? 'lg' : 'xl'}
              color="info"
              className="[&>label>span]:font-medium"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between">
              <Switch
                variant="active"
                label="Remember Me"
                color="info"
                className="[&>label>span]:font-medium [&>label]:my-1"
                {...register('rememberMe')}
              />
              <Link
                href={'/auth/forgot-password'}
                className="h-auto p-0 text-sm font-medium text-gray-900 underline transition-colors hover:text-primary hover:no-underline"
              >
                Forget Password?
              </Link>
            </div>
            <Button
              className="w-full"
              type="submit"
              isLoading={loading}
              size={isMedium ? 'lg' : 'xl'}
              color="info"
            >
              Sign In
            </Button>
          </div>
        )}
      </Form>
      {/* <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-9 xl:text-base">
        Don’t have an account?{' '}
        <Link
          href={'/sign-up'}
          className="font-bold text-gray-700 transition-colors hover:text-primary"
        >
          Sign Up
        </Link>
      </Text> */}
    </div>
  );
}
