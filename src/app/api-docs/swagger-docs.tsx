"use client";

import dynamic from "next/dynamic";

// Dynamically import SwaggerUI to ensure it only loads on the client side
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <div className="p-4 text-sm text-gray-500">Loading API documentation...</div>,
});

export default function SwaggerDocs({ spec }: { spec: Record<string, unknown> }) {
  return (
    <div className="swagger-container">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.20.0/swagger-ui.min.css"
      />
      <SwaggerUI spec={spec} />
    </div>
  );
}