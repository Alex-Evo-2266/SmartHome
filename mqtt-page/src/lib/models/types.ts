export type Obj1 = {
  _value: string;
  [key: string]: Obj1 | string;
};

export type TreeProps = {
  data: Obj1;
  label?: string;
};