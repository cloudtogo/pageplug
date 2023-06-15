import React from "react";
import { Icon } from "@blueprintjs/core";
import {
  TableHeaderContentWrapper,
  PaginationWrapper,
  PaginationItemWrapper,
} from "../../TableStyledWrappers";
import { ReactTableColumnProps, TableSizes } from "../../Constants";
import { Colors } from "constants/Colors";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { PageNumberInput } from "./PageNumberInput";

export interface bottomActionsPropsType {
  updatePageNo: (pageNo: number, event?: EventType) => void;
  nextPageClick: () => void;
  prevPageClick: () => void;
  pageNo: number;
  totalRecordsCount?: number;
  tableData: Array<Record<string, unknown>>;
  tableColumns: ReactTableColumnProps[];
  pageCount: number;
  currentPageIndex: number;
  pageOptions: number[];
  columns: ReactTableColumnProps[];
  hiddenColumns?: string[];
  widgetName: string;
  widgetId: string;
  serverSidePaginationEnabled: boolean;
  tableSizes: TableSizes;
  isVisiblePagination?: boolean;
  delimiter: string;
  borderRadius: string;
  boxShadow: string;
  accentColor: string;
  allowAddNewRow: boolean;
  onAddNewRow: () => void;
  disableAddNewRow: boolean;
}

function BottomActions(props: bottomActionsPropsType) {
  return (
    <>
      {props.isVisiblePagination && props.serverSidePaginationEnabled && (
        <PaginationWrapper>
          {props.totalRecordsCount ? (
            <TableHeaderContentWrapper className="show-page-items">
              {props.totalRecordsCount} 条记录
            </TableHeaderContentWrapper>
          ) : null}
          <PaginationItemWrapper
            accentColor={props.accentColor}
            borderRadius={props.borderRadius}
            className="t--table-widget-prev-page"
            disabled={props.pageNo === 0}
            onClick={() => {
              props.prevPageClick();
            }}
          >
            <Icon color={Colors.HIT_GRAY} icon="chevron-left" iconSize={16} />
          </PaginationItemWrapper>
          {props.totalRecordsCount ? (
            <TableHeaderContentWrapper>
              第&nbsp;
              <PaginationItemWrapper
                accentColor={props.accentColor}
                borderRadius={props.borderRadius}
                className="page-item"
                selected
              >
                {props.pageNo + 1}
              </PaginationItemWrapper>
              &nbsp;
              <span
                data-pagecount={props.pageCount}
              >{`页，共${props.pageCount}页`}</span>
            </TableHeaderContentWrapper>
          ) : (
            <PaginationItemWrapper
              accentColor={props.accentColor}
              borderRadius={props.borderRadius}
              className="page-item"
              selected
            >
              {props.pageNo + 1}
            </PaginationItemWrapper>
          )}
          <PaginationItemWrapper
            accentColor={props.accentColor}
            borderRadius={props.borderRadius}
            className="t--table-widget-next-page"
            disabled={
              !!props.totalRecordsCount && props.pageNo === props.pageCount - 1
            }
            onClick={() => {
              props.nextPageClick();
            }}
          >
            <Icon color={Colors.HIT_GRAY} icon="chevron-right" iconSize={16} />
          </PaginationItemWrapper>
        </PaginationWrapper>
      )}
      {props.isVisiblePagination && !props.serverSidePaginationEnabled && (
        <PaginationWrapper>
          <TableHeaderContentWrapper className="show-page-items">
            {props.tableData?.length} 条记录
          </TableHeaderContentWrapper>
          <PaginationItemWrapper
            accentColor={props.accentColor}
            borderRadius={props.borderRadius}
            className="t--table-widget-prev-page"
            disabled={props.currentPageIndex === 0}
            onClick={() => {
              const pageNo =
                props.currentPageIndex > 0 ? props.currentPageIndex - 1 : 0;
              !(props.currentPageIndex === 0) &&
                props.updatePageNo(pageNo + 1, EventType.ON_PREV_PAGE);
            }}
          >
            <Icon color={Colors.GRAY} icon="chevron-left" iconSize={16} />
          </PaginationItemWrapper>
          <TableHeaderContentWrapper>
            第{" "}
            <PageNumberInput
              accentColor={props.accentColor}
              borderRadius={props.borderRadius}
              disabled={props.pageCount === 1}
              pageCount={props.pageCount}
              pageNo={props.pageNo + 1}
              updatePageNo={props.updatePageNo}
            />{" "}
            页，共{props.pageCount}页
          </TableHeaderContentWrapper>
          <PaginationItemWrapper
            accentColor={props.accentColor}
            borderRadius={props.borderRadius}
            className="t--table-widget-next-page"
            disabled={props.currentPageIndex === props.pageCount - 1}
            onClick={() => {
              const pageNo =
                props.currentPageIndex < props.pageCount - 1
                  ? props.currentPageIndex + 1
                  : 0;
              !(props.currentPageIndex === props.pageCount - 1) &&
                props.updatePageNo(pageNo + 1, EventType.ON_NEXT_PAGE);
            }}
          >
            <Icon color={Colors.GRAY} icon="chevron-right" iconSize={16} />
          </PaginationItemWrapper>
        </PaginationWrapper>
      )}
    </>
  );
}

export default BottomActions;
