import React from 'react';
import Spinner from '@/component/ui/spinner';

export default function SVGLoader({ fileName }: { fileName: string }) {
  const SvgComponent = React.lazy(
    () => import(`@/component/icons/${fileName}`)
  );

  return (
    <React.Suspense fallback={<Spinner />}>
      <SvgComponent />
    </React.Suspense>
  );
}
