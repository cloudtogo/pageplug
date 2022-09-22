import { put } from "redux-saga/effects";
import { setActionResponseDisplayFormat } from "actions/pluginActionActions";
import { ActionResponse } from "api/ActionAPI";
import { Plugin } from "api/PluginApi";
import { generate } from "utils/generators";

export function* setDefaultActionDisplayFormat(
  actionId: string,
  plugin: Plugin | undefined,
  payload: ActionResponse,
) {
  if (!!plugin && payload?.dataTypes?.length > 0) {
    const responseType = payload?.dataTypes.find(
      (type) => plugin?.responseType && type.dataType === plugin?.responseType,
    );
    yield put(
      setActionResponseDisplayFormat({
        id: actionId,
        field: "responseDisplayFormat",
        value: responseType
          ? responseType?.dataType
          : payload?.dataTypes[0]?.dataType,
      }),
    );
  }
}

// FormData polyfill
function utf8CodeAt(str, i) {
  var out: any = [], p = 0;
  var c = str.charCodeAt(i);
  if (c < 128) {
    out[p++] = c;
  } else if (c < 2048) {
    out[p++] = (c >> 6) | 192;
    out[p++] = (c & 63) | 128;
  } else if (
      ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
      ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
    // Surrogate Pair
    c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
    out[p++] = (c >> 18) | 240;
    out[p++] = ((c >> 12) & 63) | 128;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  } else {
    out[p++] = (c >> 12) | 224;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  }
  return out;
};

function toUtf8Bytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    bytes.push(...(utf8CodeAt(str, i) as []));
    if (str.codePointAt(i) > 0xffff) {
      i++;
    }
  }
  return bytes;
}

function convert(data, files) {
  let boundaryKey = 'wxmpFormBoundary' + generate(17); // 数据分割符，一般是随机的字符串
  let boundary = '--' + boundaryKey;
  let endBoundary = boundary + '--';

  let postArray = [];
  //拼接参数
  if(data && Object.prototype.toString.call(data) == "[object Object]"){
    for(let key in data){
      postArray = postArray.concat(formDataArray(boundary, key, data[key]));
    }
  }
  //拼接文件
  if(files && Object.prototype.toString.call(files) == "[object Array]"){
    for(let i in files){
      let file = files[i];
      postArray = postArray.concat(formDataArray(boundary, file.name, file.buffer, file.fileMime));
    }
  }
  //结尾
  let endBoundaryArray = [];
  endBoundaryArray.push(...toUtf8Bytes(endBoundary));
  postArray = postArray.concat(endBoundaryArray);
  return {
    contentType: 'multipart/form-data; boundary=' + boundaryKey,
    buffer: new Uint8Array(postArray).buffer
  }
}

function formDataArray(boundary, name, value, fileMime = '') {
  let dataString = '';
  let isFile = !!fileMime;

  dataString += boundary + '\r\n';
  dataString += 'Content-Disposition: form-data; name="' + name + '"';
  if (isFile) {
    dataString += '; filename="blob"' + '\r\n';
    dataString += 'Content-Type: ' + fileMime + '\r\n\r\n';
  } else {
    dataString += '\r\n\r\n';
    dataString += value;
  }

  var dataArray = [];
  dataArray.push(...toUtf8Bytes(dataString));
  if (isFile) {
    let fileArray = new Uint8Array(value);
    dataArray = dataArray.concat(Array.prototype.slice.call(fileArray));
  }
  dataArray.push(...toUtf8Bytes("\r"));
  dataArray.push(...toUtf8Bytes("\n"));

  return dataArray;
}

function FormData() {
  let data = {};
  let files: any = [];
  this.append = (name, value)=>{
    data[name] = value;
    return true;
  }
  this.appendFile = (name, buffer, fileMime)=>{
    files.push({
      name,
      buffer,
      fileMime,
    });
    return true;
  }
  this.getData = ()=>convert(data, files)
}

type FormDataProps = {
  append: (a: string, b: any) => boolean;
  appendFile: (name: string, buffer: any, fileMime: string) => boolean;
  getData: () => {
    contentType: string;
    buffer: any;
  };
}

export { FormData, FormDataProps }
