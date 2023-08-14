type Tree = {
  children?: Tree[];
  [key: string]: any;
};

export const traverseTree = (tree: Tree, callback: (tree: Tree) => void) => {
  callback(tree);
  if (tree.children) {
    tree.children.forEach((b) => traverseTree(b, callback));
  }
};

export const mapTree = (tree: Tree, callback: (tree: Tree) => Tree) => {
  const mapped = callback(tree);
  if (tree.children && tree.children.length) {
    const children: Tree[] = tree.children.map((branch) =>
      mapTree(branch, callback),
    );
    return { ...mapped, children };
  }
  return { ...mapped };
};

/**
 * This function sorts the object's value which is array of string.
 *
 * @param {Record<string, Array<string>>} data
 * @return {*}
 */
export const sortObjectWithArray = (data: Record<string, Array<string>>) => {
  Object.entries(data).map(([key, value]) => {
    data[key] = value.sort();
  });
  return data;
};

export function generateUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function processTreeData(treeArray: any) {
  function processChildren(children: Tree) {
    return children.map((child: any) => {
      return {
        ...child,
        key: child.pageId || child.key || generateUuid(),
        children: processChildren(child.children || []),
      };
    });
  }

  return processChildren(treeArray);
}

export function removeNodeByKey(data: any, key?: string) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.key === key) {
      data.splice(i, 1);
      return true;
    }
    if (node.children && node.children.length > 0) {
      if (removeNodeByKey(node.children, key)) {
        return true;
      }
    }
  }
  return false;
}
