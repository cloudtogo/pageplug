import { useSelector } from "react-redux";
import { getInstanceId } from "@appsmith/selectors/tenantSelectors";
import { PRICING_PAGE_URL } from "constants/ThirdPartyConstants";
import type { EventName } from "@appsmith/utils/analyticsUtilTypes";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { getAppsmithConfigs } from "@appsmith/configs";
import { pricingPageUrlSource } from "@appsmith/utils/licenseHelpers";

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
      "https://docs.pageplug.cn/%E5%95%86%E4%B8%9A%E7%89%88&%E4%BC%81%E4%B8%9A%E7%89%88/%E4%BB%B7%E6%A0%BC%E8%A1%A8",
      "_blank",
    );
  };

  return { onUpgrade };
};

export default useOnUpgrade;
