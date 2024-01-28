import ForgetPasswordForm from '../form';

import Image from 'next/image';
import AuthWrapperFive from '@/component/others/auth-wrapper-five';
import WaveShape from '@/component/shape/wave';

export default function SignIn() {
  return (
    <AuthWrapperFive
      title={
        <>
          <>
            Reset your{' '}
            <span className="relative px-2 text-white">
              <span className="relative z-10"> password!</span>{' '}
              <WaveShape className="absolute left-0 top-1/2 h-11 w-24 -translate-y-1/2 text-primary md:h-[52px] md:w-28 xl:h-14 xl:w-[120px] 2xl:w-[132px]" />
            </span>{' '}
          </>
        </>
      }
      pageImage={
        <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
          <Image
            src={
              'https://isomorphic-furyroad.s3.amazonaws.com/public/auth/sign-in-thumb5.webp'
            }
            alt="Reset Password Thumbnail"
            fill
            priority
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
      }
    >
      <ForgetPasswordForm />
    </AuthWrapperFive>
  );
}
