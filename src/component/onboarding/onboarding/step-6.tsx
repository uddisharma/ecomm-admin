'use client';
import { Button, Checkbox, Input, Text } from 'rizzui';
import cn from '@/utils/class-names';
import { Controller, SubmitHandler } from 'react-hook-form';
import FormSummary from './form-summary';
import { Step5Schema, step5Schema } from '@/utils/validators/onboarding.schema';
import { useContext, useState } from 'react';
import { Form } from '@/component/ui/form';
import {
  MdDocumentScanner,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';

import UploadZone from '@/component/ui/file-upload/upload-zone';
import axios from 'axios';
import { BaseApi, UpdateSeller } from '@/constants/index';
import { toast } from 'sonner';
import { useModal } from '@/component/modal-views/use-modal';
import Aadhaar from '../policies/aadhaar';
import Pan from '../policies/pan';
import Bank from '../policies/bank';
import Others from '../policies/others';
import SelectLoader from '@/component/loader/select-loader';
import dynamic from 'next/dynamic';
import { OnboardingContext } from '@/store/onboarding/context';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
export default function StepSix({ step, setStep }: any) {
  const { setOnboarding, state } = useContext(OnboardingContext);
  const [cookies] = useCookies(['admintoken']);
  const seller = state?.onboarding;
  const aadhar = seller?.legal?.aadhar;
  const pan = seller?.legal?.pan;
  const bank = seller?.legal?.bank;

  const initialValues: Step5Schema = {
    aadhar: {
      name: aadhar?.name ?? '',
      address: aadhar?.address ?? '',
      careof: aadhar?.careof ?? '',
      aadharnumber: aadhar?.aadharnumber ?? '',
      signed: aadhar?.signed ?? false,
    },
    pan: {
      name: pan?.name ?? '',
      ptype: pan?.type ?? '',
      pannumber: pan?.pannumber ?? '',
      signed: pan?.signed ?? false,
    },
    bank: {
      name: bank?.name ?? '',
      branch: bank?.branch ?? '',
      account: bank?.account ?? '',
      ifsc: bank?.ifsc ?? '',
      signed: bank?.signed ?? false,
    },
    gst: seller?.legal?.gst ?? '',
    taxid: seller?.legal?.taxid ?? '',
    certificate: seller?.legal?.certificate
      ? seller?.legal?.certificate?.map((e: any) => {
          return { name: seller?.shopname, size: 1024, url: e };
        })
      : undefined,
    signed: seller?.legal?.signed ?? false,
  };
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Step5Schema> = (data) => {
    setLoading(true);
    axios
      .patch(
        `${BaseApi}${UpdateSeller}/${seller?.id}`,
        {
          legal: {
            ...data,
            pan: {
              type: data?.pan?.ptype,
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
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setOnboarding(res?.data?.data);
          setStep(7);
          return toast.success('Details saved Successfully');
        } else {
          toast.warning(res?.data?.message ?? 'Something went wrong!');
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.status == 'UNAUTHORIZED') {
          localStorage.removeItem('admin');
          const currentUrl = window.location.href;
          const path = extractPathAndParams(currentUrl);
          if (typeof window !== 'undefined') {
            location.href = `/auth/sign-in?ref=${path}`;
          }
          return toast.error('Session Expired');
        }
        toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const { openModal } = useModal();
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
            step={6}
            title="Ensure Smooth Transactions"
            description="Provide essential legal and financial details to facilitate smooth transactions. This information is crucial for building trust and transparency with customers and regulatory authorities."
          />
        </div>

        <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
          <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
            <Form<Step5Schema>
              validationSchema={step5Schema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                mode: 'onChange',
                defaultValues: initialValues,
              }}
            >
              {({
                register,
                control,
                getValues,
                setValue,
                formState: { errors },
              }) => (
                <>
                  <Text className="mb-5  font-semibold text-gray-900">
                    Aadhaar Details
                  </Text>
                  <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    <Input
                      prefix={<MdDocumentScanner className="h-4 w-4" />}
                      label="Aadhaar Number"
                      type="number"
                      maxLength={12}
                      placeholder="Aadhaar Number"
                      {...register('aadhar.aadharnumber')}
                      error={errors.aadhar?.aadharnumber?.message}
                    />
                    <Input
                      label="Aadhaar Name"
                      placeholder="Aadhaar Name"
                      type="text"
                      {...register('aadhar.name')}
                      error={errors.aadhar?.name?.message}
                    />
                    <Input
                      label="Parent / Guardian Name in Aadhaar"
                      placeholder="Parent / Guardian Name"
                      {...register('aadhar.careof')}
                      error={errors.aadhar?.careof?.message}
                    />
                    <Input
                      label="Aadhaar Address"
                      placeholder="Aadhaar Address"
                      type="text"
                      {...register('aadhar.address')}
                      error={errors.aadhar?.address?.message}
                    />
                    <div className="col-span-full flex flex-row gap-3">
                      <Checkbox
                        // label="Agree to term & conditions"
                        className=""
                        {...register('aadhar.signed')}
                        error={errors.aadhar?.signed?.message}
                      />
                      <p>
                        Agree to{' '}
                        <span
                          onClick={() => {
                            openModal({
                              view: <Aadhaar />,
                              customSize: '900px',
                            });
                          }}
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          term & conditions
                        </span>
                      </p>
                    </div>
                  </div>
                  <Text className="mb-5 mt-10 font-semibold text-gray-900">
                    PAN Details
                  </Text>
                  <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    <Input
                      prefix={<MdDocumentScanner className="h-4 w-4" />}
                      label="PAN Number"
                      placeholder="PAN Number"
                      {...register('pan.pannumber')}
                      error={errors.pan?.pannumber?.message}
                      maxLength={10}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <Input
                      label="PAN Name"
                      placeholder="PAN Name"
                      type="text"
                      {...register('pan.name')}
                      error={errors.pan?.name?.message}
                    />
                    <Controller
                      name="pan.ptype"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label="Select PAN Type"
                          options={[
                            {
                              name: 'Individuals (personal)',
                              value: 'Individuals',
                            },
                            {
                              name: 'Partnership Firms',
                              value: 'Partnership Firms',
                            },
                            {
                              name: 'Company',
                              value: 'Company',
                            },
                          ]}
                          value={value}
                          onChange={onChange}
                          placeholder="Select PAN Type"
                          error={errors.pan?.ptype?.message}
                          getOptionValue={(option) => option.value}
                          getOptionDisplayValue={(option) => option.name}
                        />
                      )}
                    />

                    {/* <Checkbox
                      label="Agree to term & conditions"
                      className="col-span-full"
                      {...register('pan.signed')}
                      error={errors.pan?.signed?.message}
                    /> */}
                    <div className="col-span-full flex flex-row gap-3">
                      <Checkbox
                        // label="Agree to term & conditions"
                        className=""
                        {...register('pan.signed')}
                        error={errors.pan?.signed?.message}
                      />
                      <p>
                        Agree to{' '}
                        <span
                          onClick={() => {
                            openModal({
                              view: <Pan />,
                              customSize: '900px',
                            });
                          }}
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          term & conditions
                        </span>
                      </p>
                    </div>
                  </div>
                  <Text className="mb-5 mt-10 font-semibold text-gray-900">
                    Bank Details
                  </Text>
                  <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    <Input
                      prefix={<MdDocumentScanner className="h-4 w-4" />}
                      label="Account Number"
                      placeholder="Account Number"
                      {...register('bank.account')}
                      error={errors.bank?.account?.message}
                    />
                    <Input
                      label="IFSC Code"
                      placeholder="IFSC Code"
                      type="text"
                      {...register('bank.ifsc')}
                      error={errors.bank?.ifsc?.message}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <Input
                      label="Bank Name"
                      placeholder="Bank Name"
                      type="text"
                      {...register('bank.name')}
                      error={errors.bank?.name?.message}
                    />
                    <Input
                      label="Branch Name"
                      placeholder="Branch Name"
                      type="text"
                      {...register('bank.branch')}
                      error={errors.bank?.branch?.message}
                    />
                    {/* <Checkbox
                      label="Agree to term & conditions"
                      {...register('bank.signed')}
                      error={errors.bank?.signed?.message}
                      // className="col-span-full"
                    /> */}
                    <div className="col-span-full flex flex-row gap-3">
                      <Checkbox
                        // label="Agree to term & conditions"
                        className=""
                        {...register('bank.signed')}
                        error={errors.bank?.signed?.message}
                      />
                      <p>
                        Agree to{' '}
                        <span
                          onClick={() => {
                            openModal({
                              view: <Bank />,
                              customSize: '900px',
                            });
                          }}
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          term & conditions
                        </span>
                      </p>
                    </div>
                  </div>
                  <Text className="mb-5 mt-10 font-semibold text-gray-900">
                    Others Details
                  </Text>
                  <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    <Input
                      label="GST Number"
                      placeholder="GST Number"
                      type="text"
                      {...register('gst')}
                      error={errors.gst?.message}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <Input
                      label="TAX Number"
                      placeholder="TAX Number"
                      type="text"
                      {...register('taxid')}
                      error={errors.taxid?.message}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <UploadZone
                      name="certificate"
                      className="col-span-full"
                      label="Soft copies of Aadhaar, PAN, Bank, GST & TAX"
                      getValues={getValues}
                      setValue={setValue}
                    />
                    {/* <Checkbox
                      {...register('signed')}
                      error={errors.signed?.message}
                      label="Agree to term & conditions"
                      className="col-span-full"
                    /> */}
                    <div className="col-span-full flex flex-row gap-3">
                      <Checkbox
                        // label="Agree to term & conditions"
                        className=""
                        {...register('signed')}
                        error={errors.signed?.message}
                      />
                      <p>
                        Agree to{' '}
                        <span
                          onClick={() => {
                            openModal({
                              view: <Others />,
                              customSize: '900px',
                            });
                          }}
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          term & conditions
                        </span>
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setStep(5);
                      }}
                      variant="outline"
                      className="w-full"
                      type="button"
                      color="primary"
                    >
                      <MdKeyboardArrowLeft className="ml-3 h-4 w-4 text-gray-500" />
                      Prev
                    </Button>
                    <Button className=" w-full" type="submit" color="primary">
                      Next
                      <MdKeyboardArrowRight className="ml-3 h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
