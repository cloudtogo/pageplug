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
  const { bordered, cells, inset, runAction, title } = props;

  const onClickCellItem = (action: string) => (e: any) => {
    if (action) {
      runAction(action);
    }
  };

  return (
    <ScrollView scrollY style={{ height: "100%" }}>
      <Cell.Group bordered={bordered} inset={inset} title={title}>
        {cells.map((cell, index) => {
          let icon = null;
          if (cell.picType === "image") {
            icon = (
              <Image
                fallback={<PhotoFail />}
                key={cell.picSrc}
                mode="aspectFit"
                src={cell.picSrc}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  marginRight: "20px",
                }}
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
              bordered
              brief={cell.brief}
              clickable
              icon={icon}
              key={index}
              onClick={onClickCellItem(cell.onClick || "")}
              rightIcon={cell.showArrow ? <Arrow /> : null}
              title={cell.label}
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
