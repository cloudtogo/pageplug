import {
  DataTreeEntity,
  ENTITY_TYPE,
  DataTreeJSAction,
} from "entities/DataTree/dataTreeFactory";
import { PluginType } from "entities/Action";

export function isJSAction(entity: DataTreeEntity): entity is DataTreeJSAction {
  return (
    typeof entity === "object" &&
    "ENTITY_TYPE" in entity &&
    entity.ENTITY_TYPE === ENTITY_TYPE.JSACTION
  );
}

export const isTrueObject = (
  item: unknown
): item is Record<string, unknown> => {
  return Object.prototype.toString.call(item) === "[object Object]";
};

export function getEntityNameAndPropertyPath(fullPath: string): {
  entityName: string;
  propertyPath: string;
} {
  const indexOfFirstDot = fullPath.indexOf(".");
  if (indexOfFirstDot === -1) {
    // No dot was found so path is the entity name itself
    return {
      entityName: fullPath,
      propertyPath: "",
    };
  }
  const entityName = fullPath.substring(0, indexOfFirstDot);
  const propertyPath = fullPath.substring(indexOfFirstDot + 1);
  return { entityName, propertyPath };
}

export function isJSObject(entity: DataTreeEntity): entity is DataTreeJSAction {
  return (
    typeof entity === "object" &&
    "ENTITY_TYPE" in entity &&
    entity.ENTITY_TYPE === ENTITY_TYPE.JSACTION &&
    "pluginType" in entity &&
    entity.pluginType === PluginType.JS
  );
}
