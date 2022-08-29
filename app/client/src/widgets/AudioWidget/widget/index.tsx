import React, { Suspense, lazy } from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../../BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import Skeleton from "components/utils/Skeleton";
import { retryPromise } from "utils/AppsmithUtils";
import ReactPlayer from "react-player";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

const AudioComponent = lazy(() => retryPromise(() => import("../component")));

export enum PlayState {
  NOT_STARTED = "NOT_STARTED",
  PAUSED = "PAUSED",
  ENDED = "ENDED",
  PLAYING = "PLAYING",
}

class AudioWidget extends BaseWidget<AudioWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "url",
            label: "URL",
            controlType: "INPUT_TEXT",
            placeholderText: "请填写 url",
            inputType: "TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
                expected: {
                  type: "Audio URL",
                  example:
                    "https://assets.appsmith.com/widgets/birds_chirping.mp3",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
          {
            propertyName: "autoPlay",
            label: "自动播放",
            helpText: "在组件初始化完成后自动播放音频",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
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
            helpText: "开始播放时触发",
            propertyName: "onPlay",
            label: "onPlay",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "暂停播放时触发",
            propertyName: "onPause",
            label: "onPause",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "播放结束时触发",
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

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "url",
            label: "URL",
            controlType: "INPUT_TEXT",
            placeholderText: "请填写 url",
            inputType: "TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
                expected: {
                  type: "Audio URL",
                  example:
                    "https://assets.appsmith.com/widgets/birds_chirping.mp3",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "autoPlay",
            label: "自动播放",
            helpText: "在组件初始化完成后自动播放音频",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
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
            helpText: "开始播放时触发",
            propertyName: "onPlay",
            label: "onPlay",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "暂停播放时触发",
            propertyName: "onPause",
            label: "onPause",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "播放结束时触发",
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
        <AudioComponent
          autoplay={autoPlay}
          controls
          onEnded={() => {
            this.props.updateWidgetMetaProperty("playState", PlayState.ENDED, {
              triggerPropertyName: "onEnd",
              dynamicString: onEnd,
              event: {
                type: EventType.ON_AUDIO_END,
              },
            });
          }}
          onPause={() => {
            //TODO: We do not want the pause event for onSeek.
            // Don't set playState to paused on onEnd
            if (
              this._player.current &&
              this._player.current.getDuration() ===
                this._player.current.getCurrentTime()
            ) {
              return;
            }

            this.props.updateWidgetMetaProperty("playState", PlayState.PAUSED, {
              triggerPropertyName: "onPause",
              dynamicString: onPause,
              event: {
                type: EventType.ON_AUDIO_PAUSE,
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
                  type: EventType.ON_AUDIO_PLAY,
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

  static getWidgetType(): WidgetType {
    return "AUDIO_WIDGET";
  }
}

export interface AudioWidgetProps extends WidgetProps {
  url: string;
  autoPlay: boolean;
  onPause?: string;
  onPlay?: string;
  onEnd?: string;
}

export default AudioWidget;
