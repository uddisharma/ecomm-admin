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
import UploadZone from '@/component/ui/file-upload/upload-zone1';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BaseApi, addBanner, singleBanner, updateBanner } from '@/constants';
import useSWR from 'swr';
import Spinner from '@/component/ui/spinner';
const schema = z.object({
  desktop: z.array(fileSchema).optional(),
  mobile: z.array(fileSchema).optional(),
  link: z.string().min(1, { message: 'Redirect Link is required' }),
});

type Schema = z.infer<typeof schema>;

export default function AssetInit() {
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
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

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);

  let {
    data,
    error,
    isLoading: loading,
  } = useSWR(`${BaseApi}${singleBanner}/${params?.slug}`, fetcher, {
    refreshInterval: 3600000,
  });
  data = data?.data;
  const images = data?.images && data?.images[0];
  const desktop = images?.desktop?.url;
  const desktopBanner = { name: 'desktop', size: 1024, url: desktop };
  const phone = images?.mobile?.url;
  const mobileBanner = { name: 'mobile', size: 1024, url: phone };
  const redirectLink = data?.redirectLink;
  const initialValues = {
    desktop: [desktopBanner] ?? undefined,
    mobile: [mobileBanner] ?? undefined,
    link: redirectLink ?? '',
  };
  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (!validateData(data?.desktop, data?.mobile, data?.link)) {
      return toast.warning('All fields are required');
    }
    setIsLoading(true);
    axios
      .patch(`${BaseApi}${updateBanner}/${params?.slug}`, {
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
          router.back();
          return toast.success('Banner Updated Successfully !');
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
    title: 'Edit Banner',
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
        name: 'Edit',
      },
    ],
  };
  if (loading) {
    <div>
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
      {loading && (
        <div style={{ paddingBottom: '100px' }}>{loading && <Spinner />}</div>
      )}
    </div>;
  } else if (error) {
    return (
      <div>
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
        {error && (
          <div style={{ paddingBottom: '100px' }}>
            <Empty
              image={<SearchNotFoundIcon />}
              text="Something Went Wrong !"
              className="h-full justify-center"
            />
          </div>
        )}
      </div>
    );
  }
  if (data) {
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
            defaultValues: initialValues,
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
}
