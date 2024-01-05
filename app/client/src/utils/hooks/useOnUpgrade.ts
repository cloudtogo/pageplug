import { useSelector } from "react-redux";
import { getInstanceId } from "@appsmith/selectors/tenantSelectors";
import { CUSTOMER_PORTAL_URL_WITH_PARAMS } from "constants/ThirdPartyConstants";
import type { EventName } from "@appsmith/utils/analyticsUtilTypes";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { getAppsmithConfigs } from "@appsmith/configs";
import { pricingPageUrlSource } from "@appsmith/utils/licenseHelpers";
import { BUSINESS_PRICE_URL } from "@appsmith/constants/messages";
import type {
  RampFeature,
  RampSection,
} from "utils/ProductRamps/RampsControlList";

interface Props {
  logEventName?: EventName;
  logEventData?: any;
  featureName?: RampFeature;
  sectionName?: RampSection;
}

const useOnUpgrade = (props: Props) => {
  const { featureName, logEventData, logEventName, sectionName } = props;
  const instanceId = useSelector(getInstanceId);
  const appsmithConfigs = getAppsmithConfigs();

  const onUpgrade = () => {
    AnalyticsUtil.logEvent(
      logEventName || "ADMIN_SETTINGS_UPGRADE",
      logEventData,
    );
    window.open(BUSINESS_PRICE_URL, "_blank");
  };

  return { onUpgrade };
};

export default useOnUpgrade;
