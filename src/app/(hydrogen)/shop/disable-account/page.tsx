'use client';
import React, { useContext, useState } from 'react';
import { Title, Text } from '@/component/ui/text';
import { MdOutlineAutoDelete } from 'react-icons/md';
import { Button } from '@/component/ui/button';
import { useModal } from '@/component/modal-views/use-modal';
import { ActionIcon } from 'rizzui';
import { PiXBold, PiArrowRightBold } from 'react-icons/pi';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { Password } from '@/component/ui/password';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import { routes } from '@/config/routes';
import { z } from 'zod';
import { FaRepeat } from 'react-icons/fa6';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import { BaseApi, Login, updateSeller } from '@/constants';
import { toast } from 'sonner';
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;

const initialValues: LoginSchema = {
  email: '',
  password: '',
};

export default function Page() {
  const { openModal } = useModal();
  const { state } = useContext(UserContext);
  const isActive = state?.user?.isActive;

  return (
    <div
      className="border-b border-dashed border-gray-200 py-6"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        rowGap: '20px',
      }}
    >
      <div className="flex items-center gap-6 ">
        {isActive ? (
          <MdOutlineAutoDelete className="h-7 w-7 text-gray-500" />
        ) : (
          <FaRepeat className="h-7 w-7 text-gray-500" />
        )}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Title
              as="h3"
              className="text-base font-medium text-gray-900 dark:text-gray-700"
            >
              {isActive
                ? 'Temporary disable your account'
                : 'Reactivate your account'}
            </Title>
            {isActive ? (
              <Text
                as="span"
                className="relative hidden rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green sm:block"
              >
                Active Now
              </Text>
            ) : (
              <Text
                as="span"
                className="relative hidden rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-red sm:block"
              >
                Disable Now
              </Text>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <Text className="text-sm text-gray-500">
                Account will be temporary disabled, users cannot buy anything
                from your shop, This action is reversible so you can reactivate
                your shop.
              </Text>
            ) : (
              <Text className="text-sm text-gray-500">
                Account reactivated, users can now resume purchasing from your
                shop. The temporary disablement has been lifted, and your shop
                is fully operational.
              </Text>
            )}
          </div>
          {isActive ? (
            <Text
              as="span"
              className="relative mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green sm:hidden"
            >
              Active Now
            </Text>
          ) : (
            <Text
              as="span"
              className="relative mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-red sm:hidden"
            >
              Disable Now
            </Text>
          )}
        </div>
      </div>
      {isActive ? (
        <Button
          style={{
            marginLeft: '30px',
            border: '2px solid red',
            backgroundColor: 'red',
            color: 'white',
          }}
          variant="outline"
          color="danger"
          className=""
          onClick={() =>
            openModal({
              view: <DisableAccount title="Temporary disable your account" />,
              customSize: '500px',
            })
          }
        >
          Disable Now
        </Button>
      ) : (
        <Button
          style={{
            marginLeft: '30px',
            backgroundColor: '#08bf94',
            color: 'white',
          }}
          variant="outline"
          color="success"
          className=""
          onClick={() =>
            openModal({
              view: <DisableAccount title="Reactivate your account" />,
              customSize: '500px',
            })
          }
        >
          Reactivate Now
        </Button>
      )}
    </div>
  );
}

function DisableAccount({ title }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const { state, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const isActive = state?.user?.isActive;
  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    setLoading(true);
    axios
      .post(`${BaseApi}${Login}`, {
        username: data?.email,
        password: data?.password,
      })
      .then((res) => {
        if (res.data.status === 'SUCCESS') {
          axios
            .patch(`${BaseApi}${updateSeller}/${state?.user?.id}`, {
              isActive: !isActive,
            })
            .then((res) => {
              if (res.data?.status == 'SUCCESS') {
                setUser(res.data?.data);
                closeModal();
                return toast.success(
                  `Account is ${
                    isActive ? 'Temporary disabled' : 'Reactivated'
                  } Successfully !`
                );
              } else {
                return toast.error('Something went wrong !');
              }
            })
            .catch((err) => {
              console.log(err);
              return toast.error('Something went wrong !');
            });
        } else if (res.data?.message == 'wrong password') {
          return toast.error('Wrong Password');
        } else if (res.data?.message == 'Seller not found') {
          return toast.error('User not found');
        } else {
          toast.error('something went wrong');
        }
      })
      .catch(() => {
        return toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      <div className="mb-7 flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          {title}
        </Title>
        <ActionIcon size="sm" variant="text" onClick={() => closeModal()}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
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
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              color="info"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              color="info"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              {/* <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                color="info"
                variant="flat"
                className="[&>label>span]:font-medium"
              /> */}
              <Link
                href={'/auth/forgot-password'}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              isLoading={loading}
              className="w-full"
              type="submit"
              size="lg"
              // color="info"
            >
              <span>Continue</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-6 w-6" />
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
