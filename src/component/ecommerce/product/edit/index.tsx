'use client';

import { useContext, useState } from 'react';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import cn from '@/utils/class-names';
import FormNav, { formParts } from './form-nav';
import ProductSummary from './product-summary';
import { defaultValues } from './form-utils';
import ProductMedia from './product-media';
import PricingInventory from './pricing-inventory';
import ProductIdentifiers from './product-identifiers';
import ShippingInfo from './shipping-info';
import ProductSeo from './product-seo';
import ProductTaxonomies from './product-tags';
import FormFooter from '@/component/others/form-footer';
import { CreateProductInput, productFormSchema } from './schema';
import { useLayout } from '@/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import { BaseApi, addProduct, updateProduct } from '@/constants';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  [formParts.media]: ProductMedia,
  [formParts.pricing]: PricingInventory,
  [formParts.dimensions]: ProductIdentifiers,
  [formParts.colorsize]: ShippingInfo,
  [formParts.others]: ProductSeo,
  [formParts.tags]: ProductTaxonomies,
};

interface IndexProps {
  slug?: string;
  className?: string;
  product?: any;
}

export default function EditProduct({ slug, className, product }: IndexProps) {
  const { layout } = useLayout();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(product),
  });
  const { state } = useContext(UserContext);

  function extractPostIdFromInstagramLink(link: any) {
    const regex = /\/p\/([^/?#]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
  }

  function validateColors(colors: any) {
    if (colors.length === 0) {
      setLoading(false);
      toast.warning('At least one color is required.');
      return false;
    }
    for (const color of colors) {
      if (!color.name || !color.code) {
        toast.warning('Each color must have both a name and a code.');
        setLoading(false);
        return false;
      }
    }
    return true;
  }

  const onSubmit: SubmitHandler<CreateProductInput> = (data) => {
    // setLoading(true);

    const sellingCategories = state?.user?.sellingCategory;

    let category = sellingCategories?.filter((e: any) => {
      return e.category?.name == data?.category?.split(' ')[0];
    });
    category = category && category[0]?.category?.id;

    const instagramId = extractPostIdFromInstagramLink(data?.instaId);

    if (!instagramId) {
      setLoading(false);
      return toast.warning('Please pass a valid Instagram Post Link');
    }

    validateColors(data?.colors);

    if (!data?.tags?.length) {
      setLoading(false);
      return toast.warning('Minimum 1 tag is required');
    }

    if (!data?.sizes?.length) {
      setLoading(false);
      return toast.warning('Minimum 1 size is required');
    }

    if (!data?.images) {
      setLoading(false);
      return toast.warning('Atleast one image is required');
    }

    const colors = data?.colors?.map((e) => {
      return {
        name: e?.name,
        code: e?.code,
        available: e?.available,
      };
    });

    const sizes = data?.sizes?.map((e) => {
      return { size: e?.size, available: e?.available };
    });

    setLoading(true);
    axios
      .patch(`${BaseApi}${updateProduct}/${slug}`, {
        ...data,
        sellerId: state?.user?.id,
        colors,
        sizes,
        category,
        instaId: instagramId,
        images: data?.images?.url,
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          router.back();
          return toast.success('Product Updated Successfully !');
        } else {
          return toast.error('Something went wrong !');
        }
      })
      .catch((err) => {
        return toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="@container">
      <FormNav
        className={cn(layout === LAYOUT_OPTIONS.BERYLLIUM && '2xl:top-[72px]')}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn('[&_label.block>span]:font-medium', className)}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />}
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={slug ? 'Update Product' : 'Create Product'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
