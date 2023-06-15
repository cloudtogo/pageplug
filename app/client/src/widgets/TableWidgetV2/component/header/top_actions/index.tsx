import React from "react";
import styled from "styled-components";
import { Classes } from "@blueprintjs/core";
import { CommonFunctionsMenuWrapper } from "../../TableStyledWrappers";
import { SearchComponent } from "design-system-old";
import {
  ReactTableColumnProps,
  ReactTableFilter,
  TableSizes,
} from "../../Constants";
import { lightenColor } from "widgets/WidgetUtils";
import ActionItem from "./ActionItem";
import TableFilters from "../actions/filter";
import TableDataDownload from "./Download";

const SearchComponentWrapper = styled.div<{
  borderRadius: string;
  boxShadow?: string;
  accentColor: string;
}>`
  margin: 6px 8px;
  padding: 0 8px;
  flex: 0 0 200px;
  border: 1px solid var(--wds-color-border);
  border-radius: ${({ borderRadius }) => borderRadius} !important;
  overflow: hidden;

  &:hover {
    border-color: var(--wds-color-border-hover);
  }

  &:focus-within {
    border-color: ${({ accentColor }) => accentColor} !important;
    box-shadow: 0 0 0 2px ${({ accentColor }) => lightenColor(accentColor)} !important;
  }

  & .${Classes.INPUT} {
    height: 100%;
    padding-left: 20px !important;
  }

  & > div {
    height: 100%;
  }

  // search component
  & > div > div {
    height: 100%;

    svg {
      height: 12px;
      width: 12px;

      path {
        fill: var(--wds-color-icon) !important;
      }
    }
  }

  // cross icon component
  & > div > div + div {
    top: 0;
    right: -4px;
    height: 100%;
    align-items: center;
    display: flex;

    svg {
      top: initial !important;
    }
  }

  & .${Classes.ICON} {
    margin: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  & .${Classes.INPUT}:active, & .${Classes.INPUT}:focus {
    border-radius: ${({ borderRadius }) => borderRadius};
    border: 0px solid !important;
    border-color: ${({ accentColor }) => accentColor} !important;
    box-shadow: none !important;
  }
`;
export interface topActionsPropsType {
  widgetName: string;
  widgetId: string;
  searchKey: string;
  searchTableData: (searchKey: any) => void;
  filters?: ReactTableFilter[];
  applyFilter: (filters: ReactTableFilter[]) => void;
  columns: ReactTableColumnProps[];
  tableData: Array<Record<string, unknown>>;
  tableColumns: ReactTableColumnProps[];
  tableSizes: TableSizes;
  isVisibleDownload?: boolean;
  isVisibleFilters?: boolean;
  isVisibleSearch?: boolean;
  borderRadius: string;
  boxShadow: string;
  accentColor: string;
  allowAddNewRow: boolean;
  delimiter: string;
  onAddNewRow: () => void;
  disableAddNewRow: boolean;
}

function TopActions(props: topActionsPropsType) {
  return (
    <>
      {props.isVisibleSearch && (
        <SearchComponentWrapper
          accentColor={props.accentColor}
          borderRadius={props.borderRadius}
          boxShadow={props.boxShadow}
        >
          <SearchComponent
            onSearch={props.searchTableData}
            placeholder="搜索..."
            value={props.searchKey}
          />
        </SearchComponentWrapper>
      )}
      {(props.isVisibleFilters ||
        props.isVisibleDownload ||
        props.allowAddNewRow) && (
        <CommonFunctionsMenuWrapper tableSizes={props.tableSizes}>
          {props.isVisibleFilters && (
            <TableFilters
              accentColor={props.accentColor}
              applyFilter={props.applyFilter}
              borderRadius={props.borderRadius}
              columns={props.columns}
              filters={props.filters}
              widgetId={props.widgetId}
            />
          )}

          {props.isVisibleDownload && (
            <TableDataDownload
              borderRadius={props.borderRadius}
              columns={props.tableColumns}
              data={props.tableData}
              delimiter={props.delimiter}
              widgetName={props.widgetName}
            />
          )}

          {props.allowAddNewRow && (
            <ActionItem
              borderRadius={props.borderRadius}
              className="t--add-new-row"
              disabled={props.disableAddNewRow}
              disabledMessage="新增行之前请保存或丢弃未保存的行"
              icon="add"
              selectMenu={props.onAddNewRow}
              selected={false}
              title="新增一行"
              width={12}
            />
          )}
        </CommonFunctionsMenuWrapper>
      )}
    </>
  );
}

export default TopActions;
