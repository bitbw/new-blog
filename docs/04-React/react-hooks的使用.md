---
title: react-hooks的使
date: 2021-12-21T12:20:03.000Z
tags:
  - hooks
  - React
categories: React
---


## 组件通信的方式

In React Hooks, there are several ways to achieve component communication:

1. Using Props: You can pass data from a parent component to a child component using props. The child component can then access and use the data passed through props.

```bash
// Parent component
import React from "react";
import ChildComponent from "./ChildComponent";

const ParentComponent = () => {
  const data = "Hello from parent";

  return <ChildComponent data={data} />;
};

// Child component
import React from "react";

const ChildComponent = ({ data }) => {
  return <div>{data}</div>;
};

export default ChildComponent;
```

1. Using Context: Context allows you to share data across multiple components without having to pass props manually at every level. It is useful for sharing data that is considered global or shared.

```bash
// Create a context object
import React from "react";

const MyContext = React.createContext();

// Parent component
const ParentComponent = () => {
  const data = "Hello from parent";

  return (
    <MyContext.Provider value={data}>
      <ChildComponent />
    </MyContext.Provider>
  );
};

// Child component
const ChildComponent = () => {
  const data = React.useContext(MyContext);

  return <div>{data}</div>;
};
```

1. Using custom hooks: You can create custom hooks to encapsulate logic and share it among multiple components. Custom hooks can be used to create reusable logic for component communication.

```bash
// Custom hook
import React from "react";

const useData = () => {
  const [data, setData] = React.useState("");

  // Function to update data
  const updateData = (newData) => {
    setData(newData);
  };

  return { data, updateData };
};

// Parent component
const ParentComponent = () => {
  const { updateData } = useData();

  const handleButtonClick = () => {
    updateData("Hello from parent");
  };

  return <button onClick={handleButtonClick}>Click me</button>;
};

// Child component
const ChildComponent = () => {
  const { data } = useData();

  return <div>{data}</div>;
};
```