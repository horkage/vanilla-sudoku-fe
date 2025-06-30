"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function CustomPage() {
  /* some kind of noise about "suspense boundaries" and useSearchParams() being async under the hood */
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerCustomPage />
    </Suspense>
  );
}

function InnerCustomPage() {

  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  console.log(data);

  return (
    <main className="bg-[#EEE9DA] flex justify-center">
      <div className="w-[95%] md:w-[75%] mt-4">
        <h1 className="text-2xl font-semibold text-[#333333] mb-2 text-center">Custom Puzzle</h1>
        Hello Custom Page
      </div>
    </main>
  );

}
