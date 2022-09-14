import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { ControlIcons } from "icons/ControlIcons";
import { getCurrentApplication } from "selectors/applicationSelectors";
import {
  getCurrentApplicationId,
  getCurrentPageId,
  getPageList,
} from "selectors/editorSelectors";
import { builderURL } from "RouteBuilder";
import {
  SortableTreeWithoutDndContext as SortableTree,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  getNodeAtPath,
  walk,
} from "react-sortable-tree-patch-react-17/dist/index.cjs.js";
import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";
import IconSelect from "./IconSelect";
import { Button, Input, Form, message } from "antd";
import ColorPickerComponent from "components/ads/ColorPickerComponent";
import { updateApplication } from "actions/applicationActions";
import { Colors } from "constants/Colors";
import { DEFAULT_VIEWER_LOGO } from "constants/AppConstants";

const Wrapper = styled.div`
  padding: 20px;
  height: 100%;
  overflow: auto;
`;
const Header = styled.div`
  display: flex;
  padding-bottom: 20px;
  button {
    margin-left: auto;
  }
  & > div {
    display: flex;
    align-items: center;
    h1 {
      margin: 0;
      font-size: 18px;
      color: ${(props) => props.theme.colors.text.heading};
      margin-left: 10px;
    }
  }
`;
const MenuContainer = styled.div`
  display: flex;

  & > div {
    flex: 1;
    border: 1px solid ${(props) => props.theme.colors.primary};
    margin: 10px;
    border-radius: 4px;

    h2 {
      font-size: 16px;
      padding: 12px 20px;

      button {
        float: right;
      }
    }
  }
`;
const TreeContainer = styled.div`
  height: 400px;
`;

const NameInput = styled.input`
  border: none;
  background: ${(props) => props.theme.colors.primary}23;
  border-radius: 4px;
  padding: 4px 6px;
`;

const ConfigContainer = styled.div`
  padding: 20px;
  display: flex;

  & > .ant-form {
    width: 600px;
  }
`;
const NavPreview = styled.div<{
  color?: string;
}>`
  flex: 1;
  background: ${(props) => props.color || Colors.MINT_GREEN};
  height: 48px;
  border-radius: 4px;
  padding: 8px 16px;

  img {
    display: inline-block;
    width: 32px;
    height: 32px;
  }

  h2 {
    color: #fff;
    font-size: 16px;
    display: inline-block;
    height: 32px;
    margin: 0 0 0 12px;
    line-height: 32px;
    vertical-align: middle;
  }
`;
const ColorPicker = styled(ColorPickerComponent)`
  border: 1px solid #999;
`;

const CloseIcon = ControlIcons.CLOSE_CONTROL;
const DeleteIcon = ControlIcons.DELETE_CONTROL;
const AddIcon = ControlIcons.INCREASE_CONTROL;

const MAX_DEPTH = 3;
const EXTERNAL_NODE_TYPE = "MENU_DATA_NODE";

const getPagesInTree = (all: any[]) => (node: any) => {
  if (node.isPage) {
    all.push(node);
    return;
  }
  if (node.children) {
    node.children.forEach(getPagesInTree(all));
  }
};

const updateMenuTree = (pagesMap: any, newTree: any[]) => (node: any) => {
  let item: any;
  if (node.isPage) {
    if (pagesMap[node.pageId]) {
      item = {
        ...node,
        title: pagesMap[node.pageId].pageName,
      };
      pagesMap[node.pageId].visited = true;
    }
  } else if (node.children) {
    const children: any = [];
    node.children.forEach(updateMenuTree(pagesMap, children));
    item = {
      ...node,
      children,
    };
  } else {
    item = { ...node };
  }
  if (item) {
    newTree.push(item);
  }
};

const updateJsonPageId: any = (pagesMap: any, list: any[]) => {
  return list.map((item: any) => {
    if (item.children) {
      return {
        ...item,
        children: updateJsonPageId(pagesMap, item.children),
      };
    }
    return {
      ...item,
      pageId: pagesMap[item.title],
    };
  });
};

function PagesEditor() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const applicationId = useSelector(getCurrentApplicationId) as string;
  const pageId = useSelector(getCurrentPageId);
  const appName = useSelector(getCurrentApplication)?.name;
  const currentLayout = useSelector(getCurrentApplication)?.viewerLayout;
  const pages = useSelector(getPageList);

  const initState = useMemo(() => {
    let init = {
      logoUrl: "",
      name: "",
      color: Colors.MINT_GREEN,
      treeData: pages.map((p) => ({
        title: p.pageName,
        pageId: p.pageId,
        isPage: true,
      })),
      outsiderTree: [],
    };
    if (currentLayout) {
      try {
        const pagesMap = pages.reduce((a: any, p: any) => {
          a[p.pageName] = p.pageId;
          return a;
        }, {});
        const current = JSON.parse(currentLayout);
        init = {
          ...current,
          name: appName?.startsWith(current.name) ? appName : current.name,
          treeData: updateJsonPageId(pagesMap, current.treeData),
          outsiderTree: updateJsonPageId(pagesMap, current.outsiderTree),
        };
      } catch (e) {
        console.log(e);
      }
    }
    return init;
  }, [currentLayout]);

  const [logoUrl, setLogoUrl] = useState(initState.logoUrl);
  const [name, setName] = useState(initState.name || appName);
  const [color, setColor] = useState(initState.color);
  const [treeData, setTreeData] = useState<any>(initState.treeData);
  const [outsiderTree, setOutsiderTree] = useState<any>(initState.outsiderTree);

  useEffect(() => {
    const pagesMap = pages.reduce((a: any, c: any) => {
      a[c.pageId] = { ...c };
      return a;
    }, {});
    // update menu tree
    const newMenuTree: any = [];
    const newOuterTree: any = [];
    treeData.forEach(updateMenuTree(pagesMap, newMenuTree));
    outsiderTree.forEach(updateMenuTree(pagesMap, newOuterTree));
    const newPages = Object.values(pagesMap)
      .filter((p: any) => !p.visited)
      .map((p: any) => ({
        title: p.pageName,
        pageId: p.pageId,
        isPage: true,
      }));
    setTreeData(newMenuTree.concat(newPages));
    // update outsider pages
    setOutsiderTree(newOuterTree);
  }, [pages]);

  const onClose = useCallback(() => {
    history.push(builderURL({ pageId }));
  }, [pageId]);

  const getNodeKey = ({ treeIndex }: any) => treeIndex;

  const removeNode = (path: any) => () => {
    moveToOutsider(path);
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey,
      }),
    );
  };

  const moveToOutsider = (path: any) => {
    const targetNode = getNodeAtPath({
      treeData,
      path,
      getNodeKey,
      ignoreCollapsed: false,
    });
    const removedPages: any[] = [];
    walk({
      treeData: [targetNode.node],
      getNodeKey,
      ignoreCollapsed: false,
      callback: (nodeInfo: any) => {
        if (nodeInfo.node.isPage) {
          removedPages.push(nodeInfo);
        }
      },
    });
    const outer = removedPages.map((p) => p.node).concat(outsiderTree);
    setOutsiderTree(outer);
  };

  const onOutsiderTreeChanged = (tree: any[]) => {
    const menus: any[] = [];
    const pages: any[] = [];
    tree.forEach((t: any) => {
      if (t.isPage) {
        pages.push(t);
      } else {
        menus.push(t);
      }
    });
    if (menus.length) {
      menus.forEach((menu: any) => getPagesInTree(pages)(menu));
    }
    setOutsiderTree(pages);
  };

  const addNodeAt = (node: any, path: any) => () => {
    setTreeData(
      addNodeUnderParent({
        treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: {
          title: "二级菜单",
        },
      }).treeData,
    );
  };

  const addRootNode = () => {
    setTreeData(
      treeData.concat({
        title: "一级菜单",
      }),
    );
  };

  const editNodeTitle = (node: any, path: any) => (event: any) => {
    const title = event.target.value;
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: { ...node, title },
      }),
    );
  };

  const onIconSelected = (node: any, path: any) => (icon?: string) => {
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: { ...node, icon },
      }),
    );
  };

  const saveConfig = async () => {
    const data = {
      name: name,
      viewerLayout: JSON.stringify({
        color,
        logoUrl,
        name,
        treeData,
        outsiderTree,
      }),
    };
    dispatch(updateApplication(applicationId, data));
    message.success("保存成功");
  };

  const renderTitle = (node: any, path: any) => {
    const iconContent =
      path.length === 1 ? (
        <IconSelect
          iconName={node.icon || ""}
          onIconSelected={onIconSelected(node, path)}
        />
      ) : null;
    const titleContent = node.isPage ? (
      node.title
    ) : (
      <NameInput value={node.title} onChange={editNodeTitle(node, path)} />
    );
    return (
      <>
        {iconContent}
        {titleContent}
      </>
    );
  };

  return (
    <Wrapper>
      <Header>
        <div>
          <CloseIcon
            color={get(theme, "colors.text.heading")}
            width={20}
            height={20}
            onClick={onClose}
          />
          <h1>应用菜单编辑</h1>
        </div>
      </Header>

      <ConfigContainer>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
          <Form.Item label="应用名称">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Logo地址">
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="导航栏颜色">
            <ColorPicker
              changeColor={(c: string) => setColor(c)}
              color={color}
            />
          </Form.Item>
        </Form>
        <NavPreview color={color}>
          <img src={logoUrl.trim() || DEFAULT_VIEWER_LOGO} />
          <h2>{name}</h2>
        </NavPreview>
      </ConfigContainer>

      <div data-no-touch-simulate>
        <MenuContainer className="pageplug-rst">
          <div>
            <h2>
              菜单导航
              <Button onClick={addRootNode} type="primary">
                新增一级菜单
              </Button>
            </h2>
            <TreeContainer>
              <SortableTree
                treeData={treeData}
                theme={FileExplorerTheme}
                rowHeight={64}
                maxDepth={MAX_DEPTH}
                shouldCopyOnOutsideDrop={false}
                dndType={EXTERNAL_NODE_TYPE}
                onChange={(treeData: any) => setTreeData(treeData)}
                canNodeHaveChildren={(node: any) => !node.isPage}
                generateNodeProps={({ node, path }: any) => ({
                  title: renderTitle(node, path),
                  buttons: [
                    node.isPage || path.length >= MAX_DEPTH - 1 ? null : (
                      <AddIcon
                        key="add"
                        width={16}
                        height={16}
                        color="#999"
                        style={{ marginTop: 6, marginRight: 5 }}
                        onClick={addNodeAt(node, path)}
                      />
                    ),
                    <DeleteIcon
                      key="remove"
                      width={16}
                      height={16}
                      color="#999"
                      style={{ marginTop: 6 }}
                      onClick={removeNode(path)}
                    />,
                  ],
                  listIndex: 0,
                  lowerSiblingCounts: [],
                })}
              />
            </TreeContainer>
          </div>
          <div>
            <h2>菜单隐藏页面</h2>
            <TreeContainer>
              <SortableTree
                treeData={outsiderTree}
                onChange={onOutsiderTreeChanged}
                canNodeHaveChildren={(node: any) => !node.isPage}
                shouldCopyOnOutsideDrop={false}
                dndType={EXTERNAL_NODE_TYPE}
                theme={FileExplorerTheme}
                rowHeight={64}
                maxDepth={1}
              />
            </TreeContainer>
          </div>
        </MenuContainer>
      </div>

      <Button
        type="primary"
        size="large"
        onClick={saveConfig}
        style={{ margin: "20px 36px" }}
      >
        保存配置
      </Button>
    </Wrapper>
  );
}

export default PagesEditor;
