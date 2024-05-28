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
              <WaveShape className="absolute left-0 top-1/2 h-11 w-[600] -translate-y-1/2 text-primary md:h-[52px] md:w-[500] xl:h-14 xl:w-[500] 2xl:w-[500]" />
            </span>{' '}
          </>
        </>
      }
      pageImage={
        <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
          <Image
            src={'/reset-password.png'}
            alt="Reset Password Thumbnail"
            style={{ scale: '0.7' }}
            width={1000}
            height={1000}
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
