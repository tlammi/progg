import { useState, useEffect, SetStateAction, type Dispatch } from "react";


type Args = {
  hidden: boolean,
  setHidden: Dispatch<SetStateAction<boolean>>,
  text: string,
  children?: React.ReactNode,
};

export default function DropdownButton(props: Args) {
  const [dropdown, setDropdown] = useState<any>();

  const onClick = () => {
    setDropdown(props.children);
    props.setHidden(!props.hidden);
  };
  return <>
    <button onClick={onClick}>{props.text}</button>
    <div hidden={props.hidden} className="popup">
      {dropdown}
    </div>
  </>;
}
