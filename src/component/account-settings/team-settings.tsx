'use client';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Input } from '@/component/ui/input';

import { legalSchema, LegalFormTypes } from '@/utils/validators/legal.schema';
import FormGroup from '../others/form-group';
import { Checkbox } from 'rizzui';
import cn from '@/utils/class-names';
import Image from 'next/image';
import { endsWith } from 'lodash';
import { toast } from 'sonner';
import SelectLoader from '../loader/select-loader';
import dynamic from 'next/dynamic';
import UploadZone from '../ui/file-upload/upload-zone';
import FormFooter from '../others/form-footer';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BaseApi, updateSeller } from '@/constants';
import { useParams, useRouter } from 'next/navigation';
import { SellerContext } from '@/store/seller/context';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const panTypes = [
  {
    name: 'Individual',
    value: 'Individual',
  },
  {
    name: 'Partnerships or Firms',
    value: 'Partnerships or Firms',
  },
  {
    name: 'Company',
    value: 'Company',
  },
];

export default function Legal({ legal, name }: any) {
  const [isloading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { setSeller } = useContext(SellerContext);

  // const handleDownload = async (imageLinks: any) => {
  //   const zip = new JSZip();
  //   await Promise.all(
  //     imageLinks.map(async (imageLink: any, index: any) => {
  //       const response = await fetch(imageLink);
  //       const arrayBuffer = await response.arrayBuffer();
  //       zip.file(`image_${index + 1}.png`, arrayBuffer);
  //     })
  //   );

  //   const content = await zip.generateAsync({ type: 'blob' });
  //   saveAs(content, `${name}_certificates.zip`);
  // };

  const handleDownload = async (fileLinks: any) => {
    const zip = new JSZip();

    // Fetch files and add them to the zip file
    await Promise.all(
      fileLinks.map(async (fileLink: any, index: any) => {
        const response = await fetch(fileLink);
        const arrayBuffer = await response.arrayBuffer();

        // Determine the file extension
        const fileExtension = fileLink.split('.').pop().toLowerCase();

        // Use different file names based on the file type
        const fileName = `file_${index + 1}.${fileExtension}`;
        zip.file(fileName, arrayBuffer);
      })
    );

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Save the zip file
    saveAs(content, `${name}_certificates.zip`);
  };

  // useEffect(() => {
  //   if (!legal?.aadhar?.name) {
  //     router.push(`/${params?.seller}/shop`);
  //   }
  // }, [legal]);
  const onSubmit: SubmitHandler<LegalFormTypes> = (data) => {
    setIsLoading(true);
    axios
      .patch(`${BaseApi}${updateSeller}/${params?.seller}`, {
        legal: {
          ...data,
          pan: {
            type: data?.pan?.type1,
            name: data?.pan?.name,
            pannumber: data?.pan?.pannumber,
            signed: data?.pan?.signed,
          },
          certificate: data?.certificate?.map((e: any) => {
            return e?.url;
          }),
          gst: data?.gst,
          taxid: data?.taxid,
        },
      })
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setSeller(res?.data?.data);
          return toast.success('Profile successfully updated!');
        } else {
          toast.warning(res?.data?.message ?? 'Something went wrong!');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong !');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const defaultValues = {
    aadhar: {
      name: legal?.aadhar?.name ?? '',
      address: legal?.aadhar?.address ?? '',
      careof: legal?.aadhar?.careof ?? '',
      aadharnumber: legal?.aadhar?.aadharnumber ?? '',
      signed: legal?.aadhar?.signed ?? false,
    },
    pan: {
      name: legal?.pan?.name ?? '',
      type1: legal?.pan?.type ?? '',
      pannumber: legal?.pan?.pannumber ?? '',
      signed: legal?.pan?.signed ?? false,
    },
    bank: {
      name: legal?.bank?.name ?? '',
      branch: legal?.bank?.branch ?? '',
      account: legal?.bank?.account ?? '',
      ifsc: legal?.bank?.ifsc ?? '',
      signed: legal?.bank?.signed ?? false,
    },
    gst: legal?.gst ?? 'NA',
    taxid: legal?.taxid ?? 'NA',
    signed: legal?.signed ?? false,
    // certificate: legal?.certificate ?? [],
    certificate: legal?.certificate
      ? legal?.certificate?.map((e: any, i: any) => {
          return { name: `document${i + 1}`, size: 1024, url: e };
        })
      : undefined,
  };

  return (
    <>
      <Form<LegalFormTypes>
        validationSchema={legalSchema}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: 'onChange',
          defaultValues,
        }}
      >
        {({
          register,
          control,
          getValues,
          setValue,
          formState: { errors },
        }) => {
          return (
            <>
              <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                <FormGroup
                  title="Aadhar Details"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <Input
                    className="col-grow"
                    placeholder="Aadhaar Number"
                    label="Aadhaar Number"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('aadhar.aadharnumber')}
                    error={errors.aadhar?.aadharnumber?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Aadhaar Name"
                    label="Aadhaar Name"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('aadhar.name')}
                    error={errors.aadhar?.name?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Care Of"
                    label="Care Of"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('aadhar.careof')}
                    error={errors.aadhar?.careof?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Address"
                    label="Aadhaar Address"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('aadhar.address')}
                    error={errors.aadhar?.address?.message}
                  />
                  <Checkbox
                    label="Aadhaar Card Signed"
                    className="mt-3"
                    {...register('aadhar.signed')}
                    error={errors.aadhar?.signed?.message}
                  />
                </FormGroup>

                <FormGroup
                  title="PAN Details"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <Input
                    className="col-grow"
                    placeholder="PAN Number"
                    label="PAN Number"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('pan.pannumber')}
                    error={errors.pan?.pannumber?.message}
                  />
                  {/* <Input
                    className="col-grow"
                    placeholder="PAN Type"
                    label="PAN Type"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('pan.type1')}
                    error={errors.pan?.type1?.message}
                  /> */}
                  <Controller
                    name="pan.type1"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={panTypes}
                        value={value}
                        onChange={onChange}
                        label="PAN Type"
                        className="col-grow"
                        error={errors?.pan?.type1?.message as string}
                        getOptionValue={(option) => option.value}
                        getOptionDisplayValue={(option) => option.name}
                      />
                    )}
                  />
                  <Checkbox
                    label="PAN Card Signed"
                    className="mt-3"
                    {...register('pan.signed')}
                    error={errors.pan?.signed?.message}
                  />
                </FormGroup>

                <FormGroup
                  title="Bank Details"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <Input
                    className="col-grow"
                    placeholder="Account Number"
                    label="Account Number"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('bank.account')}
                    error={errors.bank?.account?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="IFSC Code"
                    label="IFSC Code"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('bank.ifsc')}
                    error={errors.bank?.ifsc?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Bank Name"
                    label="Bank Name"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('bank.name')}
                    error={errors.bank?.name?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Branch Name"
                    label="Branch Name"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('bank.branch')}
                    error={errors.bank?.branch?.message}
                  />
                  <Checkbox
                    label="Bank Details Signed"
                    className="mt-3"
                    {...register('bank.signed')}
                    error={errors.bank?.signed?.message}
                  />
                </FormGroup>

                <FormGroup
                  title="GST and TAX"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <Input
                    className="col-grow"
                    placeholder="GST Number"
                    label="GST Number"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('gst')}
                    error={errors.gst?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="TAX ID"
                    label="TAX ID"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('taxid')}
                    error={errors.taxid?.message}
                  />
                </FormGroup>

                <FormGroup
                  title="Certificates"
                  description=""
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <p
                    style={{ textDecoration: 'underline' }}
                    className="flex cursor-pointer "
                    onClick={() => {
                      handleDownload(legal?.certificate);
                    }}
                  >
                    Download Certificates
                  </p>
                  <UploadZone
                    name="certificate"
                    className="col-span-full"
                    label="Soft copies of Aadhaar, PAN, Bank, GST & TAX"
                    getValues={getValues}
                    setValue={setValue}
                  />
                  {/* <div
                    className="col-span-full"
                    style={{
                      display: 'flex',
                      gap: '20px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {legal?.certificate?.map((e: any, i: any) => (
                      <div key={i} className={cn('relative')}>
                        <figure className="group relative h-40 w-40 rounded-md bg-gray-50">
                          <a target="_blank" href={e}>
                            <MediaPreview name={e} url={e} />
                          </a>
                        </figure>
                      </div>
                    ))}
                  </div> */}
                  <Checkbox
                    label="Document Signed"
                    className="mt-3"
                    {...register('signed')}
                    error={errors.signed?.message}
                  />
                </FormGroup>
              </div>
              <FormFooter
                isLoading={isloading}
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

function MediaPreview({ name, url }: { name: string; url: string }) {
  return endsWith(name, '.pdf') ? (
    <object data={url} type="application/pdf" width="100%" height="100%">
      <p>
        <a style={{ textDecoration: 'underline' }} target="_blank" href={url}>
          View Document!
        </a>
      </p>
    </object>
  ) : (
    <Image
      fill
      src={url}
      alt={name}
      className="transform rounded-md object-contain"
    />
  );
}
