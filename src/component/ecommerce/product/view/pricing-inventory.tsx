import FormGroup from '@/component/others/form-group';
import ProductPricing from './product-pricing';
import cn from '@/utils/class-names';

interface PricingInventoryProps {
  className?: string;
}

export default function PricingInventory({ className }: PricingInventoryProps) {
  return (
    <>
      <FormGroup
        title="Pricing"
        description="Add your product pricing here"
        className={cn(className)}
      >
        <ProductPricing />
      </FormGroup>
    </>
  );
}
