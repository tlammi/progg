import { useState } from "react";


type Args = {
  text: string,
  children?: React.ReactNode,
};

export default function DropdownButton(props: Args) {
  const [dropdown, setDropdown] = useState<any>();
  const [hidden, setHidden] = useState<any>(true);

  const onClick = () => {
    setDropdown(props.children);
    setHidden(!hidden);
  };
  return <div className="relative inline-block">
    <button onClick={onClick}>{props.text}</button>
    <div hidden={hidden} className="border bg-white absolute inline-block z-1 shadow-lg rounded-sm left-0 top-full">
      {dropdown}
    </div>
  </div>;
}
