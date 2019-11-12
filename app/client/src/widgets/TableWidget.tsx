import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "../constants/WidgetConstants";
import { ActionPayload } from "../constants/ActionConstants";
import { AutoResizer } from "react-base-table";
import "react-base-table/styles.css";
import { forIn } from "lodash";
import SelectableTable, {
  Column,
} from "../components/designSystems/appsmith/TableComponent";

function constructColumns(data: object[]): Column[] {
  const cols: Column[] = [];
  const listItemWithAllProperties = {};
  data.forEach(dataItem => {
    Object.assign(listItemWithAllProperties, dataItem);
  });
  forIn(listItemWithAllProperties, (value, key) => {
    cols.push({
      key: key,
      dataKey: key,
      width: 200,
      title: key,
    });
  });
  return cols;
}

function parseTableArray(parsable: string): object[] {
  let data: object[] = [];
  try {
    const parsedData = JSON.parse(parsable);
    if (!Array.isArray(parsedData)) {
      throw new Error("Parsed Data is an object");
    }
    data = parsedData;
  } catch (ex) {
    console.log(ex);
  }
  return data;
}

class TableWidget extends BaseWidget<TableWidgetProps, WidgetState> {
  getPageView() {
    const tableData = parseTableArray(
      this.props.tableData ? ((this.props.tableData as any) as string) : "",
    );

    const columns = constructColumns(tableData);
    return (
      <AutoResizer>
        {({ width, height }: { width: number; height: number }) => (
          <SelectableTable
            width={width}
            height={height}
            columns={columns}
            data={tableData}
            maxHeight={height}
            selectedRowIndex={
              this.props.selectedRow && this.props.selectedRow.rowIndex
            }
            onRowClick={(rowData: object, index: number) => {
              const { widgetId, onRowSelected } = this.props;
              super.updateWidgetProperty(widgetId, "selectedRow", {
                ...rowData,
                rowIndex: index,
              });
              super.executeAction(onRowSelected);
            }}
          />
        )}
      </AutoResizer>
    );
  }

  getWidgetType(): WidgetType {
    return "TABLE_WIDGET";
  }
}

export type PaginationType = "PAGES" | "INFINITE_SCROLL";

export interface TableAction extends ActionPayload {
  actionName: string;
}

interface RowData {
  rowIndex: number;
}

export interface TableWidgetProps extends WidgetProps {
  nextPageKey?: string;
  prevPageKey?: string;
  label: string;
  tableData?: object[];
  recordActions?: TableAction[];
  onPageChange?: ActionPayload[];
  onRowSelected?: ActionPayload[];
  selectedRow?: object & RowData;
}

export default TableWidget;
