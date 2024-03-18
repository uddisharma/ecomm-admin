'use client';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import cn from '@/utils/class-names';
import UploadIcon from '@/component/shape/upload';
import { Loader } from '@/component/ui/loader';
import { FieldError } from '@/component/ui/field-error';
import { PiPencilSimple } from 'react-icons/pi';
import { LoadingSpinner } from '@/component/ui/file-upload/upload-zone';
import { toast } from 'sonner';
import axios from 'axios';

interface UploadZoneProps {
  name: string;
  getValues?: any;
  setValue?: any;
  className?: string;
  error?: string;
}

export default function AvatarUploadS3({
  name,
  error,
  className,
  getValues,
  setValue,
}: UploadZoneProps) {
  const formValue = getValues(name);

  const [files, setFiles] = useState<File[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const startUpload = async (files: any) => {
    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append('files', file);
    });
    try {
      setIsUploading(true);
      const response: any = await axios.post<{
        data: { uploadSuccess: { path: string }[] };
      }>('http://localhost:5000/seller/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status == 'SUCCESS') {
        if (setValue) {
          setFiles([]);
          const respondedUrls = response?.data?.data?.uploadSuccess?.map(
            (r: any) => ({
              name: r.name,
              size: 1024,
              url: r.path,
            })
          );
          setValue(name, respondedUrls?.[0]);
        }
        toast.success(response?.data?.message);
      }
      if (response.data.data?.uploadFailed?.length > 0) {
        toast.error(
          'Upload Failed for ' +
            response?.data?.data?.uploadFailed?.length +
            ' Photos'
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  //   const fileTypes = permittedFileInfo?.config
  //     ? Object.keys(permittedFileInfo?.config)
  //     : [];

  const fileTypes: any = [];

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
