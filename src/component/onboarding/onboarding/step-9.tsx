'use client';
import Image from 'next/image';
import Confetti from 'react-confetti';
import congratulationsImg from '@public/hat-confetti.png';
import { useElementSize } from '@/hooks/use-element-size';
import { useContext } from 'react';
import { OnboardingContext } from '@/store/onboarding/context';

export default function StepNine({ step, setStep }: any) {
  const [ref, { width, height }] = useElementSize();
  const { state } = useContext(OnboardingContext);

  return (
    <>
      <div ref={ref} className="col-span-full grid place-content-center">
        <figure className="relative mx-auto grid place-content-center">
          <Image
            src={congratulationsImg}
            alt="congratulation image"
            priority
            className="mx-auto object-contain"
          />
          <figcaption className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl text-white @7xl:text-3xl @[113rem]:text-4xl">
              Congratulations ! {state?.onboarding && state?.onboarding?.shopname}
            </h2>
            <p className="mb-14 mt-6 text-base text-white">
              Your store is now ready to showcase its unique offerings to the
              world. Our team will verify the information you provided, and
              within two working days, {"you'll"} be all set to start selling.
              Get ready to embark on a new journey and connect with eager
              customers looking for what you have to offer. Thank you for
              choosing our platform, and we look forward to seeing your success
              unfold!
            </p>
          </figcaption>
        </figure>
        <Confetti className="!fixed mx-auto" width={width} height={height} />
      </div>
    </>
  );
}
