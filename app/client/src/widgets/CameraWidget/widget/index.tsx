import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { ValidationTypes } from "constants/WidgetValidation";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { base64ToBlob, createBlobUrl } from "utils/AppsmithUtils";
import { FileDataTypes } from "widgets/constants";

import CameraComponent from "../component";
import {
  CameraMode,
  CameraModeTypes,
  MediaCaptureStatusTypes,
} from "../constants";

class CameraWidget extends BaseWidget<CameraWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "mode",
            label: "模式",
            controlType: "DROP_DOWN",
            helpText: "选择拍照模式还是录像模式",
            options: [
              {
                label: "拍照",
                value: "CAMERA",
              },
              {
                label: "录像",
                value: "VIDEO",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["CAMERA", "VIDEO"],
              },
            },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            controlType: "SWITCH",
            helpText: "让组件不可交互",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
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
            propertyName: "isMirrored",
            label: "显示镜像",
            helpText: "是否显示镜像效果",
            controlType: "SWITCH",
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "拍照时触发",
            propertyName: "onImageCapture",
            label: "OnImageCapture",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "图片保存时触发",
            propertyName: "onImageSave",
            label: "OnImageSave",
            controlType: "ACTION_SELECTOR",
            hidden: (props: CameraWidgetProps) =>
              props.mode === CameraModeTypes.VIDEO,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像开始时触发",
            propertyName: "onRecordingStart",
            label: "OnRecordingStart",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像结束时触发",
            propertyName: "onRecordingStop",
            label: "OnRecordingStop",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像保存时触发",
            propertyName: "onVideoSave",
            label: "OnVideoSave",
            controlType: "ACTION_SELECTOR",
            hidden: (props: CameraWidgetProps) =>
              props.mode === CameraModeTypes.CAMERA,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "样式",
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

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "mode",
            label: "模式",
            controlType: "DROP_DOWN",
            helpText: "选择拍照模式还是录像模式",
            options: [
              {
                label: "拍照",
                value: "CAMERA",
              },
              {
                label: "录像",
                value: "VIDEO",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["CAMERA", "VIDEO"],
              },
            },
          },
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
            controlType: "SWITCH",
            helpText: "让组件不可交互",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isMirrored",
            label: "显示镜像",
            helpText: "是否显示镜像效果",
            controlType: "SWITCH",
            dependencies: ["mode"],
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
            helpText: "拍照时触发",
            propertyName: "onImageCapture",
            label: "OnImageCapture",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "图片保存时触发",
            propertyName: "onImageSave",
            label: "onImageCapture",
            controlType: "ACTION_SELECTOR",
            hidden: (props: CameraWidgetProps) =>
              props.mode === CameraModeTypes.VIDEO,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像开始时触发",
            propertyName: "onRecordingStart",
            label: "OnRecordingStart",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像结束时触发",
            propertyName: "onRecordingStop",
            label: "OnRecordingStop",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像保存时触发",
            propertyName: "onVideoSave",
            label: "onVideoSave",
            controlType: "ACTION_SELECTOR",
            hidden: (props: CameraWidgetProps) =>
              props.mode === CameraModeTypes.CAMERA,
            dependencies: ["mode"],
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

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      image: null,
      imageBlobURL: undefined,
      imageDataURL: undefined,
      imageRawBinary: undefined,
      mediaCaptureStatus: MediaCaptureStatusTypes.IMAGE_DEFAULT,
      videoBlobURL: undefined,
      videoDataURL: undefined,
      videoRawBinary: undefined,
      isDirty: false,
    };
  }

  static getWidgetType(): string {
    return "CAMERA_WIDGET";
  }

  getPageView() {
    const {
      bottomRow,
      isDisabled,
      isMirrored,
      leftColumn,
      mode,
      parentColumnSpace,
      parentRowSpace,
      rightColumn,
      topRow,
      videoBlobURL,
    } = this.props;

    const height = (bottomRow - topRow) * parentRowSpace - WIDGET_PADDING * 2;
    const width =
      (rightColumn - leftColumn) * parentColumnSpace - WIDGET_PADDING * 2;

    return (
      <CameraComponent
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        disabled={isDisabled}
        height={height}
        mirrored={isMirrored}
        mode={mode}
        onImageCapture={this.handleImageCapture}
        onImageSave={this.handleImageSave}
        onRecordingStart={this.handleRecordingStart}
        onRecordingStop={this.handleRecordingStop}
        onVideoSave={this.handleVideoSave}
        videoBlobURL={videoBlobURL}
        width={width}
      />
    );
  }

  handleImageCapture = (image?: string | null) => {
    if (!image) {
      URL.revokeObjectURL(this.props.imageBlobURL);

      this.props.updateWidgetMetaProperty("imageBlobURL", undefined);
      this.props.updateWidgetMetaProperty("imageDataURL", undefined);
      this.props.updateWidgetMetaProperty("imageRawBinary", undefined);
      return;
    }
    // Set isDirty to true when an image is captured
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    const base64Data = image.split(",")[1];
    const imageBlob = base64ToBlob(base64Data, "image/webp");
    const blobURL = URL.createObjectURL(imageBlob);
    const blobIdForBase64 = createBlobUrl(imageBlob, FileDataTypes.Base64);
    const blobIdForRaw = createBlobUrl(imageBlob, FileDataTypes.Binary);

    this.props.updateWidgetMetaProperty("imageBlobURL", blobURL);
    this.props.updateWidgetMetaProperty("imageDataURL", blobIdForBase64, {
      triggerPropertyName: "onImageCapture",
      dynamicString: this.props.onImageCapture,
      event: {
        type: EventType.ON_CAMERA_IMAGE_CAPTURE,
      },
    });
    this.props.updateWidgetMetaProperty("imageRawBinary", blobIdForRaw, {
      triggerPropertyName: "onImageCapture",
      dynamicString: this.props.onImageCapture,
      event: {
        type: EventType.ON_CAMERA_IMAGE_CAPTURE,
      },
    });
  };

  handleImageSave = () => {
    if (this.props.onImageSave) {
      super.executeAction({
        triggerPropertyName: "onImageSave",
        dynamicString: this.props.onImageSave,
        event: {
          type: EventType.ON_CAMERA_IMAGE_SAVE,
        },
      });
    }
  };

  handleRecordingStart = () => {
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    if (this.props.onRecordingStart) {
      super.executeAction({
        triggerPropertyName: "onRecordingStart",
        dynamicString: this.props.onRecordingStart,
        event: {
          type: EventType.ON_CAMERA_VIDEO_RECORDING_START,
        },
      });
    }
  };

  handleRecordingStop = (video?: Blob | null) => {
    if (!video) {
      if (this.props.videoBlobURL) {
        URL.revokeObjectURL(this.props.videoBlobURL);
      }

      this.props.updateWidgetMetaProperty("videoBlobURL", undefined);
      this.props.updateWidgetMetaProperty("videoDataURL", undefined);
      this.props.updateWidgetMetaProperty("videoRawBinary", undefined);
      return;
    }

    const blobURL = URL.createObjectURL(video);
    const blobIdForBase64 = createBlobUrl(video, FileDataTypes.Base64);
    const blobIdForRaw = createBlobUrl(video, FileDataTypes.Binary);

    this.props.updateWidgetMetaProperty("videoBlobURL", blobURL);
    this.props.updateWidgetMetaProperty("videoDataURL", blobIdForBase64, {
      triggerPropertyName: "onRecordingStop",
      dynamicString: this.props.onRecordingStop,
      event: {
        type: EventType.ON_CAMERA_VIDEO_RECORDING_STOP,
      },
    });
    this.props.updateWidgetMetaProperty("videoRawBinary", blobIdForRaw, {
      triggerPropertyName: "onRecordingStop",
      dynamicString: this.props.onRecordingStop,
      event: {
        type: EventType.ON_CAMERA_VIDEO_RECORDING_STOP,
      },
    });
  };

  handleVideoSave = () => {
    if (this.props.onVideoSave) {
      super.executeAction({
        triggerPropertyName: "onVideoSave",
        dynamicString: this.props.onVideoSave,
        event: {
          type: EventType.ON_CAMERA_VIDEO_RECORDING_SAVE,
        },
      });
    }
  };
}

export interface CameraWidgetProps extends WidgetProps {
  isDisabled: boolean;
  isMirrored: boolean;
  isVisible: boolean;
  mode: CameraMode;
  onImageCapture?: string;
  onImageSave?: string;
  onRecordingStart?: string;
  onRecordingStop?: string;
  onVideoSave?: string;
  videoBlobURL?: string;
  borderRadius: string;
  boxShadow: string;
  isDirty: boolean;
}

export default CameraWidget;
