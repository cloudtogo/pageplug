import * as React from "react";
import { IComponentProps } from "./BaseComponent";
import { Icon, Intent } from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons";
import PositionContainer from "./PositionContainer";

class IconComponent extends React.Component<IIconComponentProps> {
  render() {
    return (
      <PositionContainer {...this.props}>
        <Icon icon={this.props.icon} iconSize={this.props.iconSize} />
      </PositionContainer>
    );
  }
}

export interface IIconComponentProps extends IComponentProps {
  iconSize?: number;
  icon?: IconName;
  intent?: string;
  ellipsize?: boolean;
}

export default IconComponent;
