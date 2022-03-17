import React from "react";
import { ScrollView } from "@tarojs/components";
import { Sidebar, Tabs } from "@taroify/core";
import _ from "lodash";
import styled from "styled-components";

const FillTabs = styled(Tabs)`
  height: 100%;
  --tabs-line-height: 100%;
`;

const FillSideBar = styled(Sidebar)`
  --sidebar-width: 100%;
`;

export interface ListComponentProps {
  list: any[];
  nameKey: string;
  selectedIndex: number;
  layout: "v" | "h";
  onTabSelected: (index: number) => void;
}

const ListComponent = (props: ListComponentProps) => {
  const { list, nameKey, selectedIndex, layout, onTabSelected } = props;

  const listRender = list.map((item, index) => {
    const name = item?.[nameKey];
    return layout === "h" ? (
      <Tabs.TabPane title={name} key={index} />
    ) : (
      <Sidebar.Tab key={index}>{name}</Sidebar.Tab>
    );
  });

  if (layout === "h") {
    return (
      <FillTabs value={selectedIndex} onChange={onTabSelected}>
        {listRender}
      </FillTabs>
    );
  }

  return (
    <ScrollView style={{ height: "100%" }} scrollY>
      <FillSideBar value={selectedIndex} onChange={onTabSelected}>
        {listRender}
      </FillSideBar>
    </ScrollView>
  );
};

export default ListComponent;
