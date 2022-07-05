import React from "react";
import { ScrollView, Text } from "@tarojs/components";
import { Cell, Image } from "@taroify/core";
import { Arrow, PhotoFail } from "@taroify/icons";
import { createVanIconComponent } from "@taroify/icons/van";

export interface CellComponentProps {
  cells: Array<{
    id: string;
    label: string;
    widgetId: string;
    picType: "none" | "icon" | "image" | "text";
    prefix?: string;
    icon?: string;
    iconColor?: string;
    picSrc?: string;
    isVisible?: boolean;
    showArrow?: boolean;
    content?: string;
    brief?: string;
    onClick?: string;
  }>;
  title?: string;
  inset: boolean;
  bordered: boolean;
  runAction: (a: string) => void;
}

const CellComponent = (props: CellComponentProps) => {
  const { cells, title, inset, bordered, runAction } = props;

  const onClickCellItem = (action: string) => (e: any) => {
    if (action) {
      runAction(action);
    }
  };

  return (
    <ScrollView style={{ height: "100%" }} scrollY>
      <Cell.Group title={title} inset={inset} bordered={bordered}>
        {cells.map((cell, index) => {
          let icon = null;
          if (cell.picType === "image") {
            icon = (
              <Image
                key={cell.picSrc}
                src={cell.picSrc}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  marginRight: "20px",
                }}
                mode="aspectFit"
                fallback={<PhotoFail />}
              />
            );
          } else if (cell.picType === "icon" && cell.icon) {
            const Icon = createVanIconComponent(cell.icon);
            icon = <Icon color={cell.iconColor} />;
          } else if (cell.picType === "text") {
            icon = (
              <Text
                style={{ color: "#999", fontSize: "16px", marginRight: "20px" }}
              >
                {cell.prefix}
              </Text>
            );
          }
          return (
            <Cell
              key={index}
              clickable
              bordered
              title={cell.label}
              brief={cell.brief}
              icon={icon}
              rightIcon={cell.showArrow ? <Arrow /> : null}
              onClick={onClickCellItem(cell.onClick || "")}
            >
              {cell.content}
            </Cell>
          );
        })}
      </Cell.Group>
    </ScrollView>
  );
};

export default CellComponent;
