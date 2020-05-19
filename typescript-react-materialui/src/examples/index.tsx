import Counter from "./Counter";

export interface ExampleValue {
  title: string;
  element: () => JSX.Element;
}

const list: ExampleValue[] = [{ title: "Counter", element: Counter }];

export default list;
