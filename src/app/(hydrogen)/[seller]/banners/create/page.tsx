'use client';
import { useState } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import cn from '@/utils/class-names';
import { z } from 'zod';
import axios from 'axios';
import { fileSchema } from '@/utils/validators/common-rules';
import UploadZone from '../../../../../component/ui/file-upload/upload-zone1';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import { Button } from 'rizzui';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { BaseApi, addBanner } from '@/constants';
const schema = z.object({
  desktop: z.array(fileSchema).optional(),
  mobile: z.array(fileSchema).optional(),
  link: z.string().min(1, { message: 'Redirect Link is required' }),
});

type Schema = z.infer<typeof schema>;

const initialValues = {
  desktop: undefined,
  mobile: undefined,
  link: '',
};

export default function AssetInit() {
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  function validateData(desktop: any, mobile: any, link: any) {
    if (!desktop?.length) {
      return false;
    }

    if (!mobile?.length) {
      return false;
    }

    if (!link || link.trim() === '') {
      return false;
    }

    return true;
  }
  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (!validateData(data?.desktop, data?.mobile, data?.link)) {
      return toast.warning('All fields are required');
    }
    const maindata = {
      redirectLink: data?.link,
      images: [
        {
          desktop: {
            url: data?.desktop && data?.desktop[0].url,
            height: 300,
            width: 1600,
          },
          mobile: {
            url: data?.mobile && data?.mobile[0].url,
            height: 210,
            width: 480,
          },
        },
      ],
      sellerId: params?.seller,
    };
    console.log(maindata);
    setIsLoading(true);
    axios
      .post(`${BaseApi}${addBanner}`, {
        redirectLink: data?.link,
        images: [
          {
            desktop: {
              url: data?.desktop && data?.desktop[0].url,
              height: 300,
              width: 1600,
            },
            mobile: {
              url: data?.mobile && data?.mobile[0].url,
              height: 210,
              width: 480,
            },
          },
        ],
        sellerId: params?.seller,
      })
      .then((res) => {
        if (res.data.status == 'SUCCESS') {
          setReset(initialValues);
          return toast.success('Banner Uploaded Successfully !');
        } else {
          toast.error('Error', {
            description: 'Something went wrong',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error', {
          description: 'Something went wrong',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const pageHeader = {
    title: 'Add Banner',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/${params?.slug}/banners`,
        name: 'Banners',
      },
      {
        name: 'Add',
      },
    ],
  };
  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/${params?.seller}/banners`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Banners
          </Button>
        </Link>
      </PageHeader>
      <Form<Schema>
        validationSchema={schema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            desktop: undefined,
            mobile: undefined,
            link: '',
          },
        }}
      >
        {({
          register,
          control,
          setValue,
          getValues,
          formState: { errors },
        }) => (
          <div
            className={cn(
              'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium'
            )}
          >
            <div>
              <>
                <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                  <FormGroup
                    title="Upload Banner For Desktop"
                    description="This will shown in big screens"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <UploadZone
                      className="col-span-full"
                      name="desktop"
                      getValues={getValues}
                      setValue={setValue}
                      error={errors?.desktop?.message as string}
                    />
                  </FormGroup>
                  <FormGroup
                    title="Upload Banner for Mobile"
                    description="This will shown in small screens"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <UploadZone
                      className="col-span-full"
                      name="mobile"
                      getValues={getValues}
                      setValue={setValue}
                      error={errors?.desktop?.message as string}
                    />
                  </FormGroup>
                  <FormGroup
                    title="Redirect Link"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      className="col-span-full"
                      type="text"
                      placeholder="Redirect Link"
                      {...register('link')}
                      error={errors.link?.message as string}
                    />
                  </FormGroup>
                </div>
                <FormFooter
                  isLoading={isLoading}
                  altBtnText="Cancel"
                  submitBtnText="Save"
                />
              </>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
