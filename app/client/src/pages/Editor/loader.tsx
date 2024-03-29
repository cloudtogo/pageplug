import React from "react";
import PageLoadingBar from "pages/common/PageLoadingBar";
import { retryPromise } from "utils/AppsmithUtils";
import { connect } from "react-redux";
import type { InitializeEditorPayload } from "actions/initActions";
import { initEditor } from "actions/initActions";
import { getSearchQuery } from "../../utils/helpers";
import { GIT_BRANCH_QUERY_KEY } from "../../constants/routes";
import { APP_MODE } from "../../entities/App";
import type { RouteComponentProps } from "react-router";

type Props = {
  initEditor: (payload: InitializeEditorPayload) => void;
} & RouteComponentProps<{ pageId: string }>;

class EditorLoader extends React.PureComponent<Props, { Page: any }> {
  constructor(props: any) {
    super(props);

    this.state = {
      Page: null,
    };
  }

  initialise() {
    const {
      initEditor,
      location: { search },
      match: { params },
    } = this.props;
    const branch = getSearchQuery(search, GIT_BRANCH_QUERY_KEY);

    const { pageId } = params;
    if (pageId) {
      initEditor({
        pageId,
        branch,
        mode: APP_MODE.EDIT,
      });
    }
  }

  componentDidMount() {
    this.initialise();
    retryPromise(() => import(/* webpackChunkName: "editor" */ "./index")).then(
      (module) => {
        this.setState({ Page: module.default });
      },
    );
  }
  render() {
    const { Page } = this.state;
    return Page ? <Page {...this.props} /> : <PageLoadingBar />;
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    initEditor: (payload: InitializeEditorPayload) =>
      dispatch(initEditor(payload)),
  };
};

export default connect(null, mapDispatchToProps)(EditorLoader);
