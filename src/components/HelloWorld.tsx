import React, { FC } from "react";

import { Button } from "@material-ui/core";

const HelloWorld: RetoolComponent<{
  name?: string;
  counter?: number;
}> = ({ triggerQuery, model, modelUpdate }) => {
  const increment = () => {
    modelUpdate({
      counter: (model.counter || 0) + 1,
    });
  };
  return (
    <div>
      <div>Hello {model.name || "world"}"!"</div>
      <Button color="primary" variant="outlined" onClick={increment}>
        Increment counter
      </Button>
      <div>Counter : {model.counter}</div>
    </div>
  );
};

type RetoolComponent<T extends Object = {}> = FC<{
  triggerQuery: (query: string) => void;
  model: T;
  modelUpdate: (model: Partial<T>) => void;
}>;

export default HelloWorld;
