import CodeMirror from "codemirror";
import TernServer from "utils/autocomplete/TernServer";
import KeyboardShortcuts from "constants/KeyboardShortcuts";
import { HintHelper } from "components/editorComponents/CodeEditor/EditorConfig";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { customTreeTypeDefCreator } from "utils/autocomplete/customTreeTypeDefCreator";
import { checkIfCursorInsideBinding } from "components/editorComponents/CodeEditor/codeEditorUtils";

export const bindingHint: HintHelper = (editor, dataTree, customDataTree) => {
  if (customDataTree) {
    const customTreeDef = customTreeTypeDefCreator(customDataTree);
    TernServer.updateDef("customDataTree", customTreeDef);
  }

  editor.setOption("extraKeys", {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: No types available
    ...editor.options.extraKeys,
    [KeyboardShortcuts.CodeEditor.OpenAutocomplete]: (cm: CodeMirror.Editor) =>
      TernServer.complete(cm),
    [KeyboardShortcuts.CodeEditor.ShowTypeAndInfo]: (cm: CodeMirror.Editor) => {
      TernServer.showType(cm);
    },
    [KeyboardShortcuts.CodeEditor.OpenDocsLink]: (cm: CodeMirror.Editor) => {
      TernServer.showDocs(cm);
    },
  });
  return {
    showHint: (editor: CodeMirror.Editor, entityInformation): boolean => {
      TernServer.setEntityInformation(entityInformation);
      const shouldShow = checkIfCursorInsideBinding(editor);
      if (shouldShow) {
        AnalyticsUtil.logEvent("AUTO_COMPLETE_SHOW", {});
        TernServer.complete(editor);
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: No types available
      editor.closeHint();
      return false;
    },
  };
};
