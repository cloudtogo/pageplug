import { combineReducers } from "redux";
import editorReducer from "./editorReducer";
import errorReducer from "./errorReducer";
import appViewReducer from "./appViewReducer";
import applicationsReducer from "./applicationsReducer";
import themeReducer from "./themeReducer";
import pageCanvasStructureReducer from "reducers/uiReducers/pageCanvasStructureReducer";
import pageWidgetsReducer from "./pageWidgetsReducer";
// import debuggerReducer from "./debuggerReducer";

const uiReducer = combineReducers({
  editor: editorReducer,
  errors: errorReducer,
  appView: appViewReducer,
  applications: applicationsReducer,
  pageCanvasStructure: pageCanvasStructureReducer,
  pageWidgets: pageWidgetsReducer,
  theme: themeReducer,
  // debugger: debuggerReducer,
});

export default uiReducer;
