import { useSelector } from "react-redux";
import { getInstanceId } from "@appsmith/selectors/tenantSelectors";
import { PRICING_PAGE_URL } from "constants/ThirdPartyConstants";
import type { EventName } from "@appsmith/utils/analyticsUtilTypes";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { getAppsmithConfigs } from "@appsmith/configs";
import { pricingPageUrlSource } from "@appsmith/utils/licenseHelpers";
import { BUSINESS_PRICE_URL } from "ce/constants/messages";

type Props = {
  logEventName?: EventName;
  logEventData?: any;
};

const useOnUpgrade = (props: Props) => {
  const { logEventData, logEventName } = props;
  const instanceId = useSelector(getInstanceId);
  const appsmithConfigs = getAppsmithConfigs();

  const onUpgrade = () => {
    AnalyticsUtil.logEvent(
      logEventName || "ADMIN_SETTINGS_UPGRADE",
      logEventData,
    );
    window.open(
      BUSINESS_PRICE_URL,
      "_blank",
    );
  };

  return { onUpgrade };
};

export default useOnUpgrade;
