import ActionBar from "./ActionBar";
import ActionBarIcon from "./ActionBarIcon";
import ActionBarButton from "./ActionBarButton";
import "./style/index.less";

const ActionBarNamespace = Object.assign(ActionBar, {
  Icon: ActionBarIcon,
  Button: ActionBarButton,
});

export { ActionBarNamespace as ActionBar, ActionBarIcon, ActionBarButton };
export default ActionBarNamespace;
