import type Dashboard from "@uppy/dashboard";
import type { Uppy } from "@uppy/core";
import type { UppyFile } from "@uppy/utils";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { Colors } from "constants/Colors";
import zh_CN from "./zh_CN";
import type { WidgetType } from "constants/WidgetConstants";
import { FILE_SIZE_LIMIT_FOR_BLOBS } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { klona } from "klona";
import _, { findIndex } from "lodash";
import log from "loglevel";

import React from "react";
import shallowequal from "shallowequal";
import { createBlobUrl, isBlobUrl } from "utils/AppsmithUtils";
import type { DerivedPropertiesMap } from "utils/WidgetFactory";
import { importUppy, isUppyLoaded } from "utils/importUppy";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import FilePickerComponent from "../component";
import FileDataTypes from "../constants";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "widgets/constants";
import parseFileData from "./FileParser";
import { FilePickerGlobalStyles } from "./index.styled";

const CSV_ARRAY_LABEL = "Array of Objects (CSV, XLS(X), JSON, TSV)";

const ARRAY_CSV_HELPER_TEXT = `注意：非 csv 类型文件数据都是空值，组件中使用大文件可能会让应用变得卡顿`;

class FilePickerWidget extends BaseWidget<
  FilePickerWidgetProps,
  FilePickerWidgetState
> {
  private isWidgetUnmounting: boolean;

  constructor(props: FilePickerWidgetProps) {
    super(props);
    this.isWidgetUnmounting = false;
    this.state = {
      areFilesLoading: false,
      isWaitingForUppyToLoad: false,
      isUppyModalOpen: false,
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Filepicker widget is used to allow users to upload files from their local machines to any cloud storage via API. Cloudinary and Amazon S3 have simple APIs for cloud storage uploads",
      "!url": "https://docs.appsmith.com/widget-reference/filepicker",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      files: "[$__file__$]",
      isDisabled: "bool",
      isValid: "bool",
      isDirty: "bool",
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "allowedFileTypes",
            helpText: "限制那些类型的文件可以上传",
            label: "支持文件类型",
            controlType: "DROP_DOWN",
            isMultiSelect: true,
            placeholderText: "选择文件类型",
            options: [
              {
                label: "任意文件类型",
                value: "*",
              },
              {
                label: "图片",
                value: "image/*",
              },
              {
                label: "视频",
                value: "video/*",
              },
              {
                label: "音频",
                value: "audio/*",
              },
              {
                label: "文本",
                value: "text/*",
              },
              {
                label: "Word文档",
                value: ".doc",
              },
              {
                label: "JPEG",
                value: "image/jpeg",
              },
              {
                label: "PNG",
                value: ".png",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: true,
                children: {
                  type: ValidationTypes.TEXT,
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "设置文件读取数据格式",
            propertyName: "fileDataType",
            label: "数据格式",
            controlType: "DROP_DOWN",
            helperText: (props: FilePickerWidgetProps) => {
              return props.fileDataType === FileDataTypes.Array
                ? ARRAY_CSV_HELPER_TEXT
                : "";
            },
            options: [
              {
                label: FileDataTypes.Base64,
                value: FileDataTypes.Base64,
              },
              {
                label: FileDataTypes.Binary,
                value: FileDataTypes.Binary,
              },
              {
                label: FileDataTypes.Text,
                value: FileDataTypes.Text,
              },
              {
                label: CSV_ARRAY_LABEL,
                value: FileDataTypes.Array,
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "dynamicTyping",
            label: "解析 CSV 中的数据类型",
            helpText: "根据 csv 文件中的数据值自动推断数据类型",
            controlType: "SWITCH",
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: false,
            hidden: (props: FilePickerWidgetProps) => {
              return props.fileDataType !== FileDataTypes.Array;
            },
            dependencies: ["fileDataType"],
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "maxNumFiles",
            label: "最大上传数量",
            helpText: "设置一次最多上传多少个文件",
            controlType: "INPUT_TEXT",
            placeholderText: "1",
            inputType: "INTEGER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            propertyName: "label",
            label: "文本",
            controlType: "INPUT_TEXT",
            helpText: "设置按钮标签",
            placeholderText: "选择文件",
            inputType: "TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "校验",
        children: [
          {
            propertyName: "isRequired",
            label: "必填",
            helpText: "强制用户填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "maxFileSize",
            helpText: "设置每个上传文件大小的上限",
            label: "最大上传大小 (Mb)",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            inputType: "INTEGER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                min: 1,
                max: 100,
                default: 5,
                passThroughOnZero: false,
              },
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isVisible",
            label: "是否显示",
            helpText: "控制组件的显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            helpText: "让组件不可交互",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },

      {
        sectionName: "事件",
        children: [
          {
            helpText: "用户选中文件后触发，文件 URL 存储在 filepicker.files 中",
            propertyName: "onFilesSelected",
            label: "onFilesSelected",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "buttonColor",
            helpText: "修改按钮颜色",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",

            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      isValid: `{{ this.isRequired ? this.files.length > 0 : true }}`,
      files: `{{this.selectedFiles}}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedFiles: [],
      uploadedFileData: {},
      isDirty: false,
    };
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      buttonColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  /**
   * Import and initialize the Uppy instance. We use memoize() to ensure that
   * once we initialize the instance, we keep returning the initialized one.
   */
  loadAndInitUppyOnce = _.memoize(async () => {
    const { Uppy } = await importUppy();

    const uppyState = {
      id: this.props.widgetId,
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: this.props.maxFileSize
          ? this.props.maxFileSize * 1024 * 1024
          : null,
        maxNumberOfFiles: this.props.maxNumFiles,
        minNumberOfFiles: null,
        allowedFileTypes:
          this.props.allowedFileTypes &&
          (this.props.allowedFileTypes.includes("*") ||
            _.isEmpty(this.props.allowedFileTypes))
            ? null
            : this.props.allowedFileTypes,
      },
    };

    const uppy = Uppy(uppyState);

    await this.initializeUppyEventListeners(uppy);
    await this.initializeSelectedFiles(uppy);

    return uppy;
  });

  /**
   * set states on the uppy instance with new values
   */
  reinitializeUppy = async (props: FilePickerWidgetProps) => {
    const uppyState = {
      id: props.widgetId,
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: props.maxFileSize ? props.maxFileSize * 1024 * 1024 : null,
        maxNumberOfFiles: props.maxNumFiles,
        minNumberOfFiles: null,
        allowedFileTypes:
          props.allowedFileTypes &&
          (this.props.allowedFileTypes.includes("*") ||
            _.isEmpty(props.allowedFileTypes))
            ? null
            : props.allowedFileTypes,
      },
    };

    const uppy = await this.loadAndInitUppyOnce();
    uppy.setOptions(uppyState);
  };

  /**
   * add all uppy events listeners needed
   */
  initializeUppyEventListeners = async (uppy: Uppy) => {
    const { Dashboard, GoogleDrive, OneDrive, Url, Webcam } =
      await importUppy();

    uppy
      .use(Dashboard, {
        target: "body",
        metaFields: [],
        inline: false,
        width: 750,
        height: 550,
        thumbnailWidth: 280,
        showLinkToFileUploadResult: true,
        showProgressDetails: false,
        hideUploadButton: false,
        hideProgressAfterFinish: false,
        note: null,
        closeAfterFinish: true,
        closeModalOnClickOutside: true,
        disableStatusBar: false,
        disableInformer: false,
        disableThumbnailGenerator: false,
        disablePageScrollWhenModalOpen: true,
        proudlyDisplayPoweredByUppy: false,
        onRequestCloseModal: () => {
          const plugin = uppy.getPlugin("Dashboard") as Dashboard;

          if (plugin) {
            plugin.closeModal();
          }

          this.setState({
            isUppyModalOpen: false,
          });
        },
        locale: zh_CN,
      })
      .use(GoogleDrive, { companionUrl: "https://companion.uppy.io" })
      .use(Url, { companionUrl: "https://companion.uppy.io" })
      .use(OneDrive, {
        companionUrl: "https://companion.uppy.io/",
      });

    if (location.protocol === "https:") {
      uppy.use(Webcam, {
        onBeforeSnapshot: () => Promise.resolve(),
        countdown: false,
        mirror: true,
        facingMode: "user",
        locale: {},
      });
    }

    uppy.on("file-removed", (file: UppyFile, reason: any) => {
      /**
       * The below line will not update the selectedFiles meta prop when cancel-all event is triggered.
       * cancel-all event occurs when close or reset function of uppy is executed.
       * Uppy provides an argument called reason. It helps us to distinguish on which event the file-removed event was called.
       * Refer to the following issue to know about reason prop: https://github.com/transloadit/uppy/pull/2323
       */
      if (reason === "removed-by-user") {
        const fileCount = this.props.selectedFiles?.length || 0;

        /**
         * Once the file is removed we update the selectedFiles
         * with the current files present in the uppy's internal state
         */
        const updatedFiles = uppy
          .getFiles()
          .map((currentFile: UppyFile, index: number) => ({
            type: currentFile.type,
            id: currentFile.id,
            data: currentFile.data,
            name: currentFile.meta
              ? currentFile.meta.name
              : `File-${index + fileCount}`,
            size: currentFile.size,
            dataFormat: this.props.fileDataType,
          }));
        this.props.updateWidgetMetaProperty(
          "selectedFiles",
          updatedFiles ?? [],
        );
      }

      if (reason === "cancel-all" && !this.isWidgetUnmounting) {
        this.props.updateWidgetMetaProperty("selectedFiles", []);
      }
    });

    uppy.on("files-added", (files: UppyFile[]) => {
      // Deep cloning the selectedFiles
      const selectedFiles = this.props.selectedFiles
        ? klona(this.props.selectedFiles)
        : [];

      const fileCount = this.props.selectedFiles?.length || 0;
      const fileReaderPromises = files.map(async (file, index) => {
        return new Promise((resolve) => {
          (async () => {
            let data: unknown;
            if (file.size < FILE_SIZE_LIMIT_FOR_BLOBS) {
              data = await parseFileData(
                file.data,
                this.props.fileDataType,
                file.type || "",
                file.extension,
                this.props.dynamicTyping,
              );
            } else {
              data = createBlobUrl(file.data, this.props.fileDataType);
            }

            const newFile = {
              type: file.type,
              id: file.id,
              data: data,
              meta: file.meta,
              name: file.meta ? file.meta.name : `File-${index + fileCount}`,
              size: file.size,
              dataFormat: this.props.fileDataType,
            };
            resolve(newFile);
          })();
        });
      });

      Promise.all(fileReaderPromises).then((files) => {
        if (!this.props.isDirty) {
          this.props.updateWidgetMetaProperty("isDirty", true);
        }

        if (selectedFiles.length !== 0) {
          files.forEach((fileItem: any) => {
            if (!fileItem?.meta?.isInitializing) {
              selectedFiles.push(fileItem);
            }
          });
          this.props.updateWidgetMetaProperty("selectedFiles", selectedFiles);
        } else {
          // update with newly added files when the selectedFiles is empty.
          this.props.updateWidgetMetaProperty("selectedFiles", [...files]);
        }
      });
    });

    uppy.on("upload", () => {
      this.onFilesSelected();
    });
  };

  /**
   * this function is called when user selects the files and it do two things:
   * 1. calls the action if any
   * 2. set isLoading prop to true when calling the action
   */
  onFilesSelected = () => {
    if (this.props.onFilesSelected) {
      this.executeAction({
        triggerPropertyName: "onFilesSelected",
        dynamicString: this.props.onFilesSelected,
        event: {
          type: EventType.ON_FILES_SELECTED,
          callback: this.handleActionComplete,
        },
      });

      this.setState({ areFilesLoading: true });
    }
  };

  handleActionComplete = () => {
    this.setState({ areFilesLoading: false });
  };

  async componentDidUpdate(prevProps: FilePickerWidgetProps) {
    super.componentDidUpdate(prevProps);

    const { selectedFiles: previousSelectedFiles = [] } = prevProps;
    const { selectedFiles = [] } = this.props;
    if (previousSelectedFiles.length && selectedFiles.length === 0) {
      (await this.loadAndInitUppyOnce()).reset();
    } else if (
      !shallowequal(prevProps.allowedFileTypes, this.props.allowedFileTypes) ||
      prevProps.maxNumFiles !== this.props.maxNumFiles ||
      prevProps.maxFileSize !== this.props.maxFileSize
    ) {
      await this.reinitializeUppy(this.props);
    }
    this.clearFilesFromMemory(prevProps.selectedFiles);
  }

  // Reclaim the memory used by blobs.
  clearFilesFromMemory(previousFiles: any[] = []) {
    const { selectedFiles: newFiles = [] } = this.props;
    previousFiles.forEach((file: any) => {
      let { data: blobUrl } = file;
      if (isBlobUrl(blobUrl)) {
        if (findIndex(newFiles, (f) => f.data === blobUrl) === -1) {
          blobUrl = blobUrl.split("?")[0];
          URL.revokeObjectURL(blobUrl);
        }
      }
    });
  }

  async initializeSelectedFiles(uppy: Uppy) {
    /**
     * Since on unMount the uppy instance closes and it's internal state is lost along with the files present in it.
     * Below we add the files again to the uppy instance so that the files are retained.
     */
    this.props.selectedFiles?.forEach((fileItem: any) => {
      uppy.addFile({
        name: fileItem.name,
        type: fileItem.type,
        data: new Blob([fileItem.data]),
        meta: {
          // Adding this flag to distinguish a file in the files-added event
          isInitializing: true,
        },
      });
    });
  }

  async componentDidMount() {
    super.componentDidMount();

    try {
      await this.loadAndInitUppyOnce();
    } catch (e) {
      log.debug("Error in initializing uppy");
    }
  }

  componentWillUnmount() {
    this.isWidgetUnmounting = true;
    this.loadAndInitUppyOnce().then((uppy) => {
      uppy.close();
    });
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setDisabled: {
          path: "isDisabled",
          type: "boolean",
        },
      },
    };
  }

  getPageView() {
    return (
      <>
        <FilePickerComponent
          borderRadius={this.props.borderRadius}
          boxShadow={this.props.boxShadow}
          buttonColor={this.props.buttonColor}
          files={this.props.selectedFiles || []}
          isDisabled={this.props.isDisabled}
          isLoading={
            this.props.isLoading ||
            this.state.areFilesLoading ||
            this.state.isWaitingForUppyToLoad
          }
          key={this.props.widgetId}
          label={this.props.label}
          maxWidth={this.props.maxWidth}
          minHeight={this.props.minHeight}
          minWidth={this.props.minWidth}
          openModal={async () => {
            // If Uppy is still loading, show a spinner to indicate that handling the click
            // will take some time.
            //
            // Copying the `isUppyLoaded` value because `isUppyLoaded` *will* always be true
            // by the time `await this.initUppyInstanceOnce()` resolves.
            const isUppyLoadedByThisPoint = isUppyLoaded;

            if (!isUppyLoadedByThisPoint)
              this.setState({ isWaitingForUppyToLoad: true });
            const uppy = await this.loadAndInitUppyOnce();
            if (!isUppyLoadedByThisPoint)
              this.setState({ isWaitingForUppyToLoad: false });

            const dashboardPlugin = uppy.getPlugin("Dashboard") as Dashboard;
            dashboardPlugin.openModal();
            this.setState({ isUppyModalOpen: true });
          }}
          shouldFitContent={this.isAutoLayoutMode}
          widgetId={this.props.widgetId}
        />

        {this.state.isUppyModalOpen && (
          <FilePickerGlobalStyles borderRadius={this.props.borderRadius} />
        )}
      </>
    );
  }

  static getWidgetType(): WidgetType {
    return "FILE_PICKER_WIDGET_V2";
  }
}

interface FilePickerWidgetState extends WidgetState {
  areFilesLoading: boolean;
  isWaitingForUppyToLoad: boolean;
  isUppyModalOpen: boolean;
}

interface FilePickerWidgetProps extends WidgetProps {
  label: string;
  maxNumFiles?: number;
  maxFileSize?: number;
  selectedFiles?: any[];
  allowedFileTypes: string[];
  onFilesSelected?: string;
  fileDataType: FileDataTypes;
  isRequired?: boolean;
  backgroundColor: string;
  borderRadius: string;
  boxShadow?: string;
  dynamicTyping?: boolean;
}

export type FilePickerWidgetV2Props = FilePickerWidgetProps;
export type FilePickerWidgetV2State = FilePickerWidgetState;

export default FilePickerWidget;
