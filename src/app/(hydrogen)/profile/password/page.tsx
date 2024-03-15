'use client';
import { useContext, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiDesktop } from 'react-icons/pi';
import cn from '@/utils/class-names';
import { Form } from '@/component/ui/form';
import { Title, Text } from '@/component/ui/text';
import { Password } from '@/component/ui/password';
import HorizontalFormBlockWrapper from '@/component/account-settings/horiozontal-block';
import {
  passwordFormSchema,
  PasswordFormTypes,
} from '@/utils/validators/password-settings.schema';
import FormFooter from '@/component/others/form-footer';
import axios from 'axios';
import { BaseApi, changeAdminPassword } from '@/constants';
import { UserContext } from '@/store/user/context';
import { toast } from 'sonner';

export default function PasswordSettingsView() {
  const [isLoading, setLoading] = useState(false);
  const [reset, setReset] = useState({});
  const { state } = useContext(UserContext);
  const onSubmit: SubmitHandler<PasswordFormTypes> = (data) => {
    setLoading(true);
    axios
      .patch(`${BaseApi}${changeAdminPassword}/${state?.user?.id}`, {
        oldPassword: data?.currentPassword,
        newPassword: data?.newPassword,
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setReset({
            currentPassword: '',
            newPassword: '',
            confirmedPassword: '',
          });
          return toast.success('Password changed successfully');
        } else if (res?.data?.status == 'FAILURE') {
          return toast.warning(res.data?.message);
        } else {
          return toast.error('Something went wrong !');
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Form<PasswordFormTypes>
        validationSchema={passwordFormSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: 'onChange',
          defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmedPassword: '',
          },
        }}
      >
        {({ register, control, formState: { errors }, getValues }) => {
          return (
            <>
              <div className="mx-auto w-full max-w-screen-2xl">
                <HorizontalFormBlockWrapper
                  title="Current Password"
                  titleClassName="text-base font-medium"
                >
                  <Password
                    {...register('currentPassword')}
                    placeholder="Enter your password"
                    error={errors.currentPassword?.message}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="New Password"
                  titleClassName="text-base font-medium"
                >
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, value } }) => (
                      <Password
                        placeholder="Enter your password"
                        onChange={onChange}
                        error={errors.newPassword?.message}
                      />
                    )}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="Confirm New Password"
                  titleClassName="text-base font-medium"
                >
                  <Controller
                    control={control}
                    name="confirmedPassword"
                    render={({ field: { onChange, value } }) => (
                      <Password
                        placeholder="Enter your password"
                        onChange={onChange}
                        error={errors.confirmedPassword?.message}
                      />
                    )}
                  />
                </HorizontalFormBlockWrapper>
              </div>
              <FormFooter
                isLoading={isLoading}
                altBtnText="Cancel"
                submitBtnText="Save"
              />
            </>
          );
        }}
      </Form>
      {/* <LoggedDevices className="mt-10" /> */}
    </>
  );
}

// Logged devices
function LoggedDevices({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-screen-2xl', className)}>
      <div className="border-b border-dashed border-gray-200">
        <Title as="h2" className="mb-3 text-xl font-bold text-gray-900">
          Where you’re logged in
        </Title>
        <Text className="mb-6 text-sm text-gray-500">
          We’ll alert you via olivia@untitledui.com if there is any unusual
          activity on your account.
        </Text>
      </div>
      <div className="flex items-center gap-6 border-b border-dashed border-gray-200 py-6">
        <PiDesktop className="h-7 w-7 text-gray-500" />
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Title
              as="h3"
              className="text-base font-medium text-gray-900 dark:text-gray-700"
            >
              2018 Macbook Pro 15-inch
            </Title>
            <Text
              as="span"
              className="relative hidden rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green sm:block"
            >
              Active Now
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Text className="text-sm text-gray-500">Melbourne, Australia</Text>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <Text className="text-sm text-gray-500">22 Jan at 4:20pm</Text>
          </div>
          <Text
            as="span"
            className="relative mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green sm:hidden"
          >
            Active Now
          </Text>
        </div>
      </div>
      <div className="flex items-center gap-6 py-6">
        <PiDesktop className="h-7 w-7 text-gray-500" />
        <div>
          <Title
            as="h3"
            className="mb-2 text-base font-medium text-gray-900 dark:text-gray-700"
          >
            2020 Macbook Air M1
          </Title>
          <div className="flex items-center gap-2">
            <Text className="text-sm text-gray-500">Melbourne, Australia</Text>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <Text className="text-sm text-gray-500">22 Jan at 4:20pm</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
