import { useFormContext } from 'react-hook-form';
import UploadZone from '@/component/ui/file-upload/upload-zone';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import AvatarUpload from '@/component/ui/file-upload/avatar-upload';

interface ProductMediaProps {
  className?: string;
}

export default function ProductMedia({ className }: ProductMediaProps) {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Upload new product images"
      description="Upload your product image gallery here"
      className={cn(className)}
    >
      <div className="col-span-2 flex flex-col items-center gap-4 @xl:flex-row">
        <AvatarUpload
          name="images"
          setValue={setValue}
          getValues={getValues}
          error={errors?.images?.message as string}
        />
      </div>
    </FormGroup>
  );
}
