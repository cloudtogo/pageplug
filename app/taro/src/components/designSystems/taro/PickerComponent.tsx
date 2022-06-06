import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  Uploader,
  Cell,
  Button,
  Image,
  Toast,
  Checkbox,
  Field,
  NoticeBar,
  Flex,
  Dialog,
} from "@taroify/core";
import { Arrow } from "@taroify/icons";

interface PickerComponentProps {
  title?: string;
  onButtonClick?: (e: any) => void;
}

function buildData(offset = 0) {
  return Array(100)
    .fill(0)
    .map((_, i) => i + offset);
}

const Row = React.memo(({ id, index, style, data }: any) => {
  return (
    <View
      id={id}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      Row {index} : {data[index]}
    </View>
  );
});
Row.displayName = "Row";

const PickerComponent = (props: PickerComponentProps) => {
  const { title, onButtonClick } = props;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(buildData(0));
  const listReachBottom = () => {
    // 如果 loading 与视图相关，那它就应该放在 `this.state` 里
    // 我们这里使用的是一个同步的 API 调用 loading，所以不需要
    setLoading(true);
    setTimeout(() => {
      setData(data.concat(buildData(data.length)));
      setLoading(false);
    }, 1000);
  };
  const dataLen = data.length;
  const itemSize = 100;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>();
  const [text, setText] = useState("");
  const [idcard, setIdcard] = useState("");
  const [number, setNumber] = useState("");
  const [digit, setDigit] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState<Uploader.File>();

  const onUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then(({ tempFiles }) => {
      setFile({
        url: tempFiles[0].path,
        type: tempFiles[0].type,
        name: tempFiles[0].originalFileObj?.name,
      });
    });
  };

  const show = () => {
    Taro.showToast({
      title: "生活愉快！",
      icon: "success",
      duration: 2000,
    });
  };

  return (
    <View>
      <View>
        <Button color="primary" onClick={onButtonClick}>
          {title}
        </Button>
        <Button variant="text" color="info">
          信息按钮
        </Button>
        <Button variant="outlined" color="warning">
          警告按钮
        </Button>
      </View>
      <View>
        <Cell.Group title="分组 1">
          <Cell
            title="打开弹窗"
            rightIcon={<Arrow />}
            clickable
            onClick={() => setOpen(true)}
          >
            内容
          </Cell>
        </Cell.Group>
        <Cell.Group title="分组 2">
          <Cell title="单元格" brief="描述信息" rightIcon={<Arrow />} clickable>
            内容
          </Cell>
        </Cell.Group>
      </View>
      <View>
        <Flex justify="center" align="center">
          <Image
            shape="circle"
            mode="aspectFill"
            style={{ width: "10rem", height: "10rem" }}
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
        </Flex>
      </View>
      <View>
        <Checkbox.Group
          direction="horizontal"
          value={value}
          onChange={setValue}
        >
          <Checkbox name="a">复选框 a</Checkbox>
          <Checkbox name="b">复选框 b</Checkbox>
        </Checkbox.Group>
      </View>
      <div>
        <Uploader value={file} onUpload={onUpload} onChange={setFile} />
      </div>
      <View>
        <Cell.Group inset>
          <Field
            value={text}
            label="文本"
            placeholder="请输入文本"
            onChange={(e) => setText(e.detail.value)}
          />
          <Field
            value={idcard}
            label="身份证号"
            type="idcard"
            placeholder="请输入手机号"
            onChange={(e) => setIdcard(e.detail.value)}
          />
          <Field
            value={number}
            label="整数"
            type="number"
            placeholder="请输入整数"
            onChange={(e) => setNumber(e.detail.value)}
          />
          <Field
            value={digit}
            label="数字"
            type="digit"
            placeholder="请输入数字（支持小数）"
            onChange={(e) => setDigit(e.detail.value)}
          />
          <Field
            value={password}
            label="密码"
            type="password"
            placeholder="请输入密码"
            onChange={(e) => setPassword(e.detail.value)}
          />
        </Cell.Group>
      </View>
      <View>
        <NoticeBar scrollable>{title}</NoticeBar>
      </View>
      <View>
        <Dialog open={open} onClose={setOpen}>
          <Dialog.Header>{title}</Dialog.Header>
          <Dialog.Content>
            代码是写出来给人看的，附带能在机器上运行
          </Dialog.Content>
          <Dialog.Actions theme="round">
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={() => setOpen(false)}>确认</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </View>
  );
};

export default PickerComponent;
