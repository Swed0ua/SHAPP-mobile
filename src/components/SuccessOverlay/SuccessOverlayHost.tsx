import { memo } from "react";

import { useSuccessOverlayStore } from "../../store/slices/useSuccessOverlayStore";
import { SuccessOverlay } from "./SuccessOverlay";

export const SuccessOverlayHost = memo(() => {
  const visible = useSuccessOverlayStore((state) => state.visible);
  const complete = useSuccessOverlayStore((state) => state.complete);

  if (!visible) {
    return null;
  }

  return <SuccessOverlay onComplete={complete} />;
});

SuccessOverlayHost.displayName = "SuccessOverlayHost";
