import { useFormContext } from 'react-hook-form';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import UploadZoneS3 from '@/component/ui/file-upload/upload-zone-s3';

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
      <div className="col-span-full">
        <UploadZoneS3
          name="images"
          setValue={setValue}
          getValues={getValues}
          error={errors?.images?.message as string}
        />
      </div>
    </FormGroup>
  );
}
