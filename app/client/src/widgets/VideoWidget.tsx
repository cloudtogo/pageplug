import React, { Suspense, lazy } from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import Skeleton from "components/utils/Skeleton";
import * as Sentry from "@sentry/react";
import { retryPromise } from "utils/AppsmithUtils";
import ReactPlayer from "react-player";
import withMeta, { WithMeta } from "./MetaHOC";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

const VideoComponent = lazy(() =>
  retryPromise(() =>
    import("components/designSystems/appsmith/VideoComponent"),
  ),
);

export enum PlayState {
  NOT_STARTED = "NOT_STARTED",
  PAUSED = "PAUSED",
  ENDED = "ENDED",
  PLAYING = "PLAYING",
}

class VideoWidget extends BaseWidget<VideoWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "url",
            label: "URL地址",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入视频地址",
            inputType: "TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
                expected: {
                  type: "Video URL",
                  example: "https://www.youtube.com/watch?v=wyRNg7cXvmA",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
          {
            propertyName: "autoPlay",
            label: "自动播放",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
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
            helpText: "视频开始播放后触发",
            propertyName: "onPlay",
            label: "onPlay",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "视频暂停后触发",
            propertyName: "onPause",
            label: "onPause",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "视频播放结束后触发",
            propertyName: "onEnd",
            label: "onEnd",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }
  private _player = React.createRef<ReactPlayer>();

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      playState: PlayState.NOT_STARTED,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  getPageView() {
    const { autoPlay, onEnd, onPause, onPlay, url } = this.props;
    return (
      <Suspense fallback={<Skeleton />}>
        <VideoComponent
          autoplay={autoPlay}
          controls
          onEnded={() => {
            this.props.updateWidgetMetaProperty("playState", PlayState.ENDED, {
              triggerPropertyName: "onEnd",
              dynamicString: onEnd,
              event: {
                type: EventType.ON_VIDEO_END,
              },
            });
          }}
          onPause={() => {
            //TODO: We do not want the pause event for onSeek or onEnd.
            this.props.updateWidgetMetaProperty("playState", PlayState.PAUSED, {
              triggerPropertyName: "onPause",
              dynamicString: onPause,
              event: {
                type: EventType.ON_VIDEO_PAUSE,
              },
            });
          }}
          onPlay={() => {
            this.props.updateWidgetMetaProperty(
              "playState",
              PlayState.PLAYING,
              {
                triggerPropertyName: "onPlay",
                dynamicString: onPlay,
                event: {
                  type: EventType.ON_VIDEO_PLAY,
                },
              },
            );
          }}
          player={this._player}
          url={url}
        />
      </Suspense>
    );
  }

  getWidgetType(): WidgetType {
    return "VIDEO_WIDGET";
  }
}

export interface VideoWidgetProps extends WidgetProps, WithMeta {
  url: string;
  autoPlay: boolean;
  onPause?: string;
  onPlay?: string;
  onEnd?: string;
}

export default VideoWidget;
export const ProfiledVideoWidget = Sentry.withProfiler(withMeta(VideoWidget));
