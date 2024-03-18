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
    </>
  );
}
