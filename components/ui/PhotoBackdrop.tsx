"use client";

import { useEffect, useRef, useState } from "react";

export default function PhotoBackdrop() {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // A cached failure can finish before hydration attaches the error handler.
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-page">
      <picture>
        {!failed && <source media="(orientation: portrait)" srcSet="/assets/hero/city-terminal-detail-tall.webp" type="image/webp" />}
        <img
          ref={imageRef}
          src={failed ? "/assets/hero/city-wide-color-3840.jpg" : "/assets/hero/city-terminal-detail.webp"}
          width={1672} height={941} alt="" fetchPriority="high" decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[48%_center] ${failed ? "opacity-20" : "pixel-backdrop"}`}
        />
      </picture>
      <div className="tty-readability absolute inset-0" />
    </div>
  );
}
