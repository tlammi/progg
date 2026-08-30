"use client";


function NavigationButton({name, clicked}){

  const wrap = ()=>{
    clicked(name);
  };

  return <button className="m-1 p-1 rounded-md border-2" onClick={wrap}>{name}</button>
}

export default function Navigation({options, onPageSelect}){

  return <>
    {options.map((x)=>{
      return <NavigationButton key={x} name={x} clicked={onPageSelect}/>
    })}
  </>
}
