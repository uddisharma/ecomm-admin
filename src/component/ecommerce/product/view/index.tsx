'use client';
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
import { CreateProductInput, productFormSchema } from './schema';
import { useLayout } from '@/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';

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

export default function ViewProduct({ slug, className, product }: IndexProps) {
  const { layout } = useLayout();
  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(product),
  });

  const onSubmit: SubmitHandler<CreateProductInput> = (data) => {};

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
        </form>
      </FormProvider>
    </div>
  );
}
