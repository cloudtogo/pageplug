import React, { useCallback, useContext } from "react";
import type { WidgetCardProps } from "widgets/BaseWidget";
import styled from "styled-components";
import { useWidgetDragResize } from "utils/hooks/dragResizeHooks";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { generateReactKey } from "utils/generators";
import { useWidgetSelection } from "utils/hooks/useWidgetSelection";
import { IconWrapper } from "constants/IconConstants";
import { Colors } from "constants/Colors";
import { Text } from "design-system";
import WalkthroughContext from "components/featureWalkthrough/walkthroughContext";

type CardProps = {
  details: WidgetCardProps;
};

export const Wrapper = styled.div`
  border-radius: var(--ads-v2-border-radius);
  border: none;
  position: relative;
  color: ${Colors.MINT_BLACK};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius};
  cursor: grab;
  img {
    cursor: grab;
  }

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 2px;
    text-align: center;
  }

  &:hover {
    background: #f0f0f0;
    cursor: grab;
  }

  & i {
    font-family: ${(props) => props.theme.fonts.text};
    font-size: ${(props) => props.theme.fontSizes[7]}px;
  }
`;

export const BetaLabel = styled.div`
  font-size: 10px;
  background: ${Colors.MINT_YELLOW};
  margin-top: 3px;
  padding: 2px 4px;
  border-radius: 3px;
  position: absolute;
  top: 0;
  right: -2%;
`;

function WidgetCard(props: CardProps) {
  const { setDraggingNewWidget } = useWidgetDragResize();
  const { deselectAll } = useWidgetSelection();

  const { isOpened: isWalkthroughOpened, popFeature } =
    useContext(WalkthroughContext) || {};
  const closeWalkthrough = useCallback(() => {
    if (isWalkthroughOpened && popFeature) {
      popFeature();
    }
  }, [isWalkthroughOpened, popFeature]);

  const onDragStart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    AnalyticsUtil.logEvent("WIDGET_CARD_DRAG", {
      widgetType: props.details.type,
      widgetName: props.details.displayName,
    });
    setDraggingNewWidget &&
      setDraggingNewWidget(true, {
        ...props.details,
        widgetId: generateReactKey(),
      });
    deselectAll();
    closeWalkthrough();
  };

  const type = `${props.details.type.split("_").join("").toLowerCase()}`;
  const className = `t--widget-card-draggable t--widget-card-draggable-${type}`;

  return (
    <Wrapper
      className={className}
      data-guided-tour-id={`widget-card-${type}`}
      draggable
      onDragStart={onDragStart}
    >
      <div className="gap-2 mt-2">
        <IconWrapper>
          <img className="w-6 h-6" src={props.details.icon} />
        </IconWrapper>
        <Text kind="body-s">{props.details.displayName}</Text>
        {props.details.isBeta && <BetaLabel>Beta</BetaLabel>}
      </div>
    </Wrapper>
  );
}

export default WidgetCard;
