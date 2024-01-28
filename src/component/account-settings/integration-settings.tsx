'use client';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Input } from '@/component/ui/input';
import FormGroup from '../others/form-group';
import FormFooter from '../others/form-footer';
import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import { LuInstagram } from 'react-icons/lu';
import { z } from 'zod';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, updateSeller } from '@/constants';
const profileFormSchema = z.object({
  facebook: z.string().min(1, { message: 'Facebook link is required' }),
  instagram: z.string().min(1, { message: 'Instagram link is required' }),
  youtube: z.string().min(1, { message: 'Youtube link is required' }),
});

// generate form types from zod validation schema
export type ProfileFormTypes = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsView() {
  const [Loading, setLoading] = useState(false);
  const { state, setUser } = useContext(UserContext);
  const onSubmit: SubmitHandler<ProfileFormTypes> = (data) => {
    setLoading(true);
    axios
      .patch(`${BaseApi}${updateSeller}/${state?.user?.id}`, {
        socialLinks: data,
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setUser(res.data?.data);
          return toast.success('Social Links successfully updated!');
        } else {
          return toast.error('Something went wrong !');
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const defaultValues = {
    facebook: state?.user?.socialLinks?.facebook ?? '',
    instagram: state?.user?.socialLinks?.instagram ?? '',
    youtube: state?.user?.socialLinks?.youtube ?? '',
  };

  return (
    <>
      <Form<ProfileFormTypes>
        validationSchema={profileFormSchema}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: 'onChange',
          defaultValues,
        }}
      >
        {({ register, formState: { errors } }) => {
          return (
            <>
              <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                <FormGroup
                  title="Facebook"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  description=""
                >
                  <Input
                    prefix={<FaFacebookF className="h-4 w-4 text-gray-500" />}
                    type="url"
                    className="col-span-full"
                    placeholder="https://facebook.com"
                    {...register('facebook')}
                    error={errors.facebook?.message}
                  />
                </FormGroup>
                <FormGroup
                  title="Instagram"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  description=""
                >
                  <Input
                    prefix={<LuInstagram className="h-4 w-4 text-gray-500" />}
                    type="url"
                    className="col-span-full"
                    placeholder="https://instagram.com"
                    {...register('instagram')}
                    error={errors.instagram?.message}
                  />
                </FormGroup>
                <FormGroup
                  title="Youtube"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  description=""
                >
                  <Input
                    prefix={<FaYoutube className="h-4 w-4 text-gray-500" />}
                    type="url"
                    className="col-span-full"
                    placeholder="https://youtube.com"
                    {...register('youtube')}
                    error={errors.youtube?.message}
                  />
                </FormGroup>
              </div>
              <FormFooter
                isLoading={Loading}
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
