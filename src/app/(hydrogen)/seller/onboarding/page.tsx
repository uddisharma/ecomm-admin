'use client';
import StepZero from '@/component/onboarding/onboarding/step-0';
import StepFour from '@/component/onboarding/onboarding/step-4';
import StepSix from '@/component/onboarding/onboarding/step-6';
import StepSeven from '@/component/onboarding/onboarding/step-7';
import { useState } from 'react';
import StepEight from '@/component/onboarding/onboarding/step-8';
import StepNine from '@/component/onboarding/onboarding/step-9';
import StepOne from '@/component/onboarding/onboarding/step-1';
import StepTwo from '@/component/onboarding/onboarding/step-2';
import StepThree from '@/component/onboarding/onboarding/step-3';
import StepFive from '@/component/onboarding/onboarding/step-5';

export default function MultiStepFormPage() {
  const [step, setStep] = useState(1);
  return (
    <div>
      {step == 0 && <StepZero step={step} setStep={setStep} />}
      {step == 1 && <StepOne step={step} setStep={setStep} />}
      {step == 2 && <StepTwo step={step} setStep={setStep} />}
      {step == 3 && <StepThree step={step} setStep={setStep} />}
      {step == 4 && <StepFour step={step} setStep={setStep} />}
      {step == 5 && <StepFive step={step} setStep={setStep} />}
      {step == 6 && <StepSix step={step} setStep={setStep} />}
      {step == 7 && <StepSeven step={step} setStep={setStep} />}
      {step == 8 && <StepEight step={step} setStep={setStep} />}
      {step == 9 && <StepNine step={step} setStep={setStep} />}
    </div>
  );
}
