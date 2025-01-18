import { Suspense } from "react";

export default function NettromContent() {
  return (
    <div>
      {/* Other content */}
      <Suspense fallback={<div>Loading search results...</div>}>
        {/* Component that uses useSearchParams() */}
      </Suspense>
    </div>
  );
}
