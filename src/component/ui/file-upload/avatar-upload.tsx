'use client';
import Image from 'next/image';

import { useCallback, useState } from 'react';
import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import {
  UploadFileResponse,
  generateClientDropzoneAccept,
} from 'uploadthing/client';
import { useUploadThing } from '@/utils/uploadthing';
import { Text } from '@/component/ui/text';
import cn from '@/utils/class-names';
import UploadIcon from '@/component/shape/upload';
import { Loader } from '@/component/ui/loader';
import { FieldError } from '@/component/ui/field-error';
import { PiPencilSimple } from 'react-icons/pi';
import { LoadingSpinner } from '@/component/ui/file-upload/upload-zone';
import { toast } from 'sonner';

interface UploadZoneProps {
  name: string;
  getValues?: any;
  setValue?: any;
  className?: string;
  error?: string;
}

export default function AvatarUpload({
  name,
  error,
  className,
  getValues,
  setValue,
}: UploadZoneProps) {
  const formValue = getValues(name);

  const [files, setFiles] = useState<File[]>([]);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    'avatar',
    {
      onClientUploadComplete: (res: UploadFileResponse[] | undefined) => {
        if (setValue) {
          const respondedUrls = res?.map((r) => ({
            name: r.name,
            size: r.size,
            url: r.url,
          }));
          setValue(name, respondedUrls?.[0]);
        }
        toast.success('Avatar Uploaded');
      },
      onUploadError: (error: Error) => {
        console.error(error);
        toast.error(error.message);
      },
    }
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const filteredFiles = acceptedFiles.filter(
        (file) => file.size <= 100 * 1024
      ); // Filter files below 100 KB

      if (filteredFiles.length !== acceptedFiles.length) {
        // Some files exceeded the size limit
        toast.error('File size not allowed. Maximum size is 100 KB.');
        return;
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );

      // Pass acceptedFiles directly to startUpload
      startUpload(acceptedFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div className={cn('grid gap-5', className)}>
      <div
        className={cn(
          'relative grid h-40 w-40 place-content-center rounded-full border'
        )}
      >
        {formValue ? (
          <>
            <figure className="absolute inset-0 rounded-full">
              <Image
                fill
                alt="user avatar"
                src={formValue?.url}
                className="rounded-full"
              />
            </figure>
            <div
              {...getRootProps()}
              className={cn(
                'absolute inset-0 grid place-content-center rounded-full bg-black/70'
              )}
            >
              {isUploading ? (
                <LoadingSpinner />
              ) : (
                <PiPencilSimple className="h-5 w-5 text-white" />
              )}

              <input {...getInputProps()} />
            </div>
          </>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'absolute inset-0 z-10 grid cursor-pointer place-content-center'
            )}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12" />
            {isUploading ? (
              <Loader className="justify-center" />
            ) : (
              <p style={{ fontSize: '12px', textAlign: 'center' }}>
                Drop or select file (max 100KB)
              </p>
            )}{' '}
          </div>
        )}
      </div>
      {error && <FieldError error={error} />}
    </div>
  );
}
