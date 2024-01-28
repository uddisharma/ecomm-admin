import cn from '@/utils/class-names';
import { Title, Text } from '@/component/ui/text';
import { Avatar, AvatarProps } from '@/component/ui/avatar';

interface AddressCardProps {
  state: string;
  className?: string;
  district?: string;
  avatarProps?: AvatarProps;
}

export default function AddressCard({
  state,
  className,
  district,
  avatarProps,
}: AddressCardProps) {
  return (
    <figure className={cn('flex items-center gap-3', className)}>
      <figcaption className="grid gap-0.5">
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {state}
        </Text>
        {district && (
          <Text className="text-[13px] text-gray-500">{district}</Text>
        )}
      </figcaption>
    </figure>
  );
}
