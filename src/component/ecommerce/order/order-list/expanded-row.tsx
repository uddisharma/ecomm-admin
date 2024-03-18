import Image from 'next/image';
import { Title, Text } from '@/component/ui/text';

export default function ExpandedOrderRow({ record }: any) {
  if (record?.orderItems?.length === 0) {
    return <Text>No product available</Text>;
  }
  return (
    <div className="grid grid-cols-1 divide-y bg-gray-0 px-3.5 dark:bg-gray-50">
      {record?.orderItems?.map((product: any) => (
        <article
          key={Math.random()}
          className="flex items-center gap-10 py-3 first-of-type:pt-2.5 last-of-type:pb-2.5"
        >
          <div className="flex items-start">
            <div className="relative me-4 aspect-[80/60] w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image
                fill
                className=" object-cover"
                src={product?.productId.images && product?.productId.images}
                alt={product?.productId.name}
              />
            </div>
            <header>
              <Title as="h4" className="mb-0.5 text-sm font-medium">
                {product?.productId.name}
              </Title>
              <Text className="mb-1 text-gray-500">{product.category}</Text>
              <Text className="text-xs text-gray-500">
                Unit Price: ₹{product?.productId?.price}
              </Text>
            </header>
          </div>
          <div className="flex w-full max-w-[500px] items-center justify-between gap-4">
            <div className="flex items-center">
              <Text
                as="span"
                className="font-medium text-gray-900 dark:text-gray-700"
              >
                Quantity : {product?.quantity}
              </Text>
            </div>
            <div className="flex items-center">
              <Text
                as="span"
                className="font-medium text-gray-900 dark:text-gray-700"
              >
                Color : {product?.color?.name}
              </Text>
            </div>

            <div className="flex items-center">
              <Text
                as="span"
                className="font-medium text-gray-900 dark:text-gray-700"
              >
                Size : {product?.size}
              </Text>
            </div>
            <Text className="font-medium text-gray-900 dark:text-gray-700">
              Total : ₹{product?.amount}
            </Text>
          </div>
        </article>
      ))}
    </div>
  );
}
