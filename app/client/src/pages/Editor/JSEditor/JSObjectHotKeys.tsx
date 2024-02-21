import React from "react";
import { HotkeysTarget2 } from "@blueprintjs/core";
import { JS_OBJECT_HOTKEYS_CLASSNAME } from "./constants";

interface Props {
  runActiveJSFunction: (e: KeyboardEvent) => void;
  children: React.ReactNode;
}

class JSObjectHotKeys extends React.Component<Props> {
  private hotkeys = [
    {
      combo: "return",
      onKeyDown: this.props.runActiveJSFunction,
      allowInInput: true,
      global: true,
      group: "JSObject",
      label: "Run JS Function",
    },
  ];

  public render() {
    return (
      <HotkeysTarget2 hotkeys={this.hotkeys}>
        {({ handleKeyDown, handleKeyUp }) => (
          <div
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{ height: "100%" }}
            tabIndex={0}
          >
            <div className={JS_OBJECT_HOTKEYS_CLASSNAME}>
              {this.props.children}
            </div>
          </div>
        )}
      </HotkeysTarget2>
    );
  }
}

export default JSObjectHotKeys;
