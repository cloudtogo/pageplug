import * as React from "react"
import { IWidgetProps, IWidgetState } from "../widgets/BaseWidget"
import { DragSource, DragSourceConnector, DragSourceMonitor } from "react-dnd"
import { ContainerProps } from "./ContainerComponent"

export interface DraggableProps extends ContainerProps {
  connectDragSource: Function;
  isDragging?: boolean;
}

class DraggableComponent extends React.Component<DraggableProps, IWidgetState> {
  render() {
    return this.props.connectDragSource(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          left: this.props.style
            ? this.props.style.xPosition + this.props.style.xPositionUnit
            : 0,
          top: this.props.style
            ? this.props.style.yPosition + this.props.style.yPositionUnit
            : 0
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

const widgetSource = {
  beginDrag(props: IWidgetProps) {
    return {
      widgetId: props.widgetId,
      widgetType: props.widgetType
    }
  }
}

const widgetType = (props: IWidgetProps) => {
  return props.widgetType
}

function collect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource(widgetType, widgetSource, collect)(DraggableComponent)
