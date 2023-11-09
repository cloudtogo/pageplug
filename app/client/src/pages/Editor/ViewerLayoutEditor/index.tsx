import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { get, size, map, flatMapDeep, cloneDeep } from "lodash";
import { ControlIcons } from "icons/ControlIcons";
import { getCurrentApplication } from "selectors/applicationSelectors";
import {
  getCurrentApplicationId,
  getCurrentPageId,
  getVisiblePageList,
} from "selectors/editorSelectors";
import { getSelectedAppThemeProperties } from "selectors/appThemingSelectors";
import { builderURL } from "RouteBuilder";
// import {
//   SortableTreeWithoutDndContext as SortableTree,
//   addNodeUnderParent,
//   removeNodeAtPath,
//   changeNodeAtPath,
//   getNodeAtPath,
//   walk,
// } from "react-sortable-tree-patch-react-17/dist/index.cjs.js";
// import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";
import IconSelect from "./IconSelect";
import { Button, Input, Form, message, Tree, Divider, Typography } from "antd";
import ColorPickerComponent from "components/propertyControls/ColorPickerComponentV2";
import { updateApplication } from "actions/applicationActions";
import { Colors } from "constants/Colors";
import { Icon } from "@blueprintjs/core";
import { DEFAULT_VIEWER_LOGO } from "constants/AppConstants";
import type { DataNode, TreeProps } from "antd/es/tree";
// import { menutree, navdata, mockpages } from "./mock";
import {
  processTreeData,
  generateUuid,
  mapTree,
  // traverseTree,
  removeNodeByKey,
} from "utils/treeUtils";
const { Paragraph } = Typography;

const x = 3;
const y = 2;
const z = 1;
const defaultData: (DataNode & { iconName: string })[] = [];

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
  & > div {
    // border: 1px solid ${(props) => props.theme.colors.primary};
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
  min-height: 200px;
  width: 65%;
  padding: 4rem 4rem;
  && .ant-tree .ant-tree-treenode {
    align-items: center;
  }
  && .ant-tree .ant-tree-switcher {
    // align-self: center;
  }
  // transform: scale(1.2);
  // transform-origin: top left;
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
  const pages = useSelector(getVisiblePageList);
  const appPrimaryColor = useSelector(getSelectedAppThemeProperties)?.colors
    .primaryColor;

  const initState = useMemo(() => {
    let init = {
      logoUrl: "",
      name: "",
      color: appPrimaryColor,
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
  const [gData, setGData] = useState(defaultData);
  const [hideNodes, setHideNodes] = useState<any>([]);
  const [, setSymbol] = useState<any>();

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
    const _tree = newMenuTree.concat(newPages);
    setTreeData(_tree);
    setOutsiderTree(newOuterTree);
    setHideNodes(newOuterTree.map((o: any) => o.pageId));
    initNewTree(_tree);
  }, [pages]);

  const initNewTree = (tree: any) => {
    const _formatTree = processTreeData(tree);
    setGData(_formatTree);
  };

  const onDragEnter: TreeProps["onDragEnter"] = (info) => {
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };

  const onClose = useCallback(() => {
    history.push(builderURL({ pageId }));
  }, [pageId]);

  const saveConfig = async () => {
    const _outsiderTree: any = [];
    gData.forEach((gItem: any) => {
      mapTree(gItem, (tn: any) => {
        if (hideNodes.includes(tn.key)) {
          _outsiderTree.push({
            title: tn.title,
            pageId: tn.pageId,
            isPage: true,
          });
        }
      });
    });
    setOutsiderTree(_outsiderTree);
    const data = {
      name: name,
      viewerLayout: JSON.stringify({
        color,
        logoUrl,
        name,
        treeData: gData,
        outsiderTree: _outsiderTree,
      }),
    };
    dispatch(updateApplication(applicationId, data));
    message.success("保存成功");
  };

  const addRootNode = () => {
    setGData(
      gData.concat({
        title: "一级目录",
        key: generateUuid(),
        iconName: "",
      }),
    );
  };

  // deleteMenu
  const onDeleteMenu = (node: any) => {
    if (size(node.children) > 0) {
      message.warning("子级页面或目录移除后再删除目录");
    } else {
      const _gdata = cloneDeep(gData);
      removeNodeByKey(_gdata, node.key);
      setGData(_gdata);
      setSymbol(Symbol("deletemenu"));
      message.info("删除目录");
    }
  };

  const toggleHidePage = (node: any) => {
    if (hideNodes.includes(node.key)) {
      // 打开
      setHideNodes(hideNodes.filter((p: any) => p !== node.key));
    } else {
      setHideNodes([...hideNodes, node.key]); // 隐藏
    }
  };

  const nodeNameChange = (name: string, node: any) => {
    gData.map((gnode: any) => {
      return mapTree(gnode, (gn: any) => {
        if (gn.key === node.key) {
          gn.title = name;
        }
      });
    });
    setGData(gData);
  };
  interface SelectedIcons {
    [key: string]: string | undefined;
  }
  const [selectedIcons, setSelectedIcons] = useState<SelectedIcons>({});
  const handleIconSelected = (key: string, icon: any) => {
    setSelectedIcons((prevSelectedIcons) => ({
      ...prevSelectedIcons,
      [key]: icon,
    }));
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
      <div className="px-[10%] mt-2 ">
        <div>
          <div className="text-xl mb-4 bold">顶部导航</div>
          <NavPreview color={color}>
            <img src={logoUrl.trim() || DEFAULT_VIEWER_LOGO} />
            <h2>{name}</h2>
          </NavPreview>
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
                  showApplicationColors
                  showThemeColors
                />
              </Form.Item>
            </Form>
          </ConfigContainer>
        </div>
        <Divider type="horizontal"></Divider>
        <div data-no-touch-simulate>
          <div className="text-xl mb-4 bold flex justify-between">
            菜单导航
            <Button onClick={addRootNode} type="default">
              + 新增目录
            </Button>
          </div>
          <TreeContainer>
            <Tree
              defaultExpandAll
              className="draggable-tree"
              // defaultExpandedKeys={expandedKeys}
              draggable={{
                icon: false,
              }}
              allowDrop={({ dropNode }) => !dropNode.isPage}
              blockNode
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              treeData={gData}
              showLine={true}
              showIcon={false}
              titleRender={(node: any) => {
                return (
                  <div
                    className={`px-4 py-2 border border-teal-500 ${
                      !hideNodes.includes(node.key)
                        ? "bg-neutral-50"
                        : "bg-gray-200"
                    } rounded flex gap-2 justify-between items-center`}
                  >
                    <div className="flex">
                      <div className="flex items-center mr-4">
                        {node.isPage ? (
                          <Icon
                            className="icon"
                            color="#4B4848"
                            data-testid="pages-collapse-icon"
                            icon="document"
                            size={14}
                          />
                        ) : (
                          // <Icon
                          //   className="icon"
                          //   color="#4B4848"
                          //   data-testid="fold-collapse-icon"
                          //   icon="folder-close"
                          //   size={12}
                          // />
                          <IconSelect
                            iconName={selectedIcons[node.key]}
                            onIconSelected={(icon) => {
                              node.iconName = icon;
                              handleIconSelected(node.key, icon);
                            }}
                          />
                        )}
                      </div>

                      <div className="flex justify-center items-center">
                        {node.isPage ? (
                          node.title
                        ) : (
                          <Paragraph
                            editable={{
                              onChange: (value: string) =>
                                nodeNameChange(value, node),
                            }}
                            style={{ marginBottom: 0 }}
                          >
                            {node.title}
                          </Paragraph>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {!node.isPage && !size(node.children) ? (
                        <Icon
                          className="icon"
                          color="#4B4848"
                          data-testid="fold-collapse-icon"
                          icon="trash"
                          size={12}
                          onClick={() => onDeleteMenu(node)}
                        />
                      ) : null}
                      <Icon
                        className="icon"
                        color={hideNodes.includes(node.key) ? "red" : "#4B4848"}
                        data-testid="fold-collapse-icon"
                        icon={
                          hideNodes.includes(node.key) ? "eye-off" : "eye-open"
                        }
                        size={12}
                        onClick={() => toggleHidePage(node)}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </TreeContainer>
        </div>
        <Divider type="horizontal"></Divider>
        <div className="flex flex-row-reverse p-1">
          <Button type="primary" size="large" onClick={saveConfig}>
            保存配置
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}

export default PagesEditor;
