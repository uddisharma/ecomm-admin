import { z } from 'zod';
import { fileSchema } from './common-rules';

export const legalSchema = z.object({
  aadhar: z.object({
    name: z.string(),
    address: z.string(),
    careof: z.string(),
    aadharnumber: z.string(),
    signed: z.boolean(),
  }),
  pan: z.object({
    name: z.string(),
    type1: z.string(),
    pannumber: z.string(),
    signed: z.boolean(),
  }),
  bank: z.object({
    name: z.string(),
    branch: z.string(),
    account: z.string(),
    ifsc: z.string(),
    signed: z.boolean(),
  }),
  gst: z.string(),
  taxid: z.string(),
  signed: z.boolean(),
  certificate: z.array(fileSchema).optional(),
});

export type LegalFormTypes = z.infer<typeof legalSchema>;

export function defaultProfileFormValues(data?: LegalFormTypes) {
  return {
    aadhar: {
      name: data?.aadhar?.name ?? '',
      address: data?.aadhar?.address ?? '',
      careof: data?.aadhar?.careof ?? '',
      aadharnumber: data?.aadhar?.aadharnumber ?? '',
      signed: data?.aadhar?.signed ?? false,
    },
    pan: {
      name: data?.pan?.name ?? '',
      type: data?.pan?.type1 ?? '',
      pannumber: data?.pan?.pannumber ?? '',
      signed: data?.pan?.signed ?? false,
    },
    bank: {
      name: data?.bank?.name ?? '',
      branch: data?.bank?.branch ?? '',
      account: data?.bank?.account ?? '',
      ifsc: data?.bank?.ifsc ?? '',
      signed: data?.bank?.signed ?? false,
    },
    gst: data?.gst ?? '',
    taxid: data?.taxid ?? '',
    certificate: data?.certificate ?? [],
  };
}
