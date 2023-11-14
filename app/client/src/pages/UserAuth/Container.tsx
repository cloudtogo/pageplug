import React from "react";
import { useSelector } from "react-redux";

import { getTenantConfig } from "@appsmith/selectors/tenantSelectors";
import { getAssetUrl } from "@appsmith/utils/airgapHelpers";

type ContainerProps = {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  disabledLoginForm?: boolean;
};

function Container(props: ContainerProps) {
  const { children, footer } = props;
  const tenantConfig = useSelector(getTenantConfig);

  return (
    <div className="flex flex-col items-center gap-4 my-auto min-w-min">
      <div className="bg-white border-[color:var(--ads-v2\-color-border)] border-t-[color:var(--ads-v2\-color-border-brand)] px-6 w-[min(400px,80%)] flex flex-col gap-6 t--login-container rounded-[var(--ads-v2\-border-radius)] login-bg">
        <img
          className="mx-auto login-img"
          src={getAssetUrl(tenantConfig.brandLogoUrl)}
        />
        {children}
      </div>
      {footer}
    </div>
  );
}

export default Container;
