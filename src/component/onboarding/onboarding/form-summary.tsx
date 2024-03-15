'use client';
import cn from '@/utils/class-names';

interface FormSummaryProps {
  step: number;
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function FormSummary({
  step,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: FormSummaryProps) {
  return (
    <div className={cn('text-base text-white', className)}>
      <div className="flex">
        <span className="me-2 mt-2.5 h-0.5 w-11 bg-white/[.35]" /> Step {step}{' '}
        of 8
      </div>
      <article className="mt-4 @3xl:mt-9">
        <h1
          className={cn(
            'text-xl text-white @3xl:text-2xl @7xl:text-3xl @[113rem]:text-4xl',
            titleClassName
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            'mt-3 text-sm leading-relaxed @3xl:text-base',
            descriptionClassName
          )}
        >
          {description}
        </p>
      </article>
    </div>
  );
}
