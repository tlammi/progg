"use client"

import {useState} from "react";



function Header({onAddAthlete}){
  return <div className="flex flex-fill border-1 text-lg">
    <div className="flex-none m-1">Athletes</div>
    <div className="flex-1"/>
    <button onClick={onAddAthlete}><b>+</b></button>
  </div>
}

function List(){
  return <div className="border-1"></div>
}

function AthletesContainer(){
  return <div className="w-sm">
    <Header onAddAthlete={()=> {alert("asdf");}}/>
    <List/>
  </div>
}

function NamedInput({name, st, setSt}){

  const onChange = (evt)=>{
    if(setSt) setSt(prev => ({
      ...prev,
      [name]: evt.target.value,
    }));
  };

  return <div className="flex m-1">
    <p className="m-1">{name}:</p>
    <div className="flex-1"></div>
    <input placeholder={name} defaultValue={st[name]} onChange={onChange} className="border-1 m-1"/>
  </div>
}

function AthleteDetailView(){

  const checkDelete = ()=>{
    if(!window.confirm("Are you sure you want to delete <athlete>?")) return;
  };

  const [st, setSt] = useState({
    "Name": "",
    "Snatch": "",
    "C&J": "",
    "Squat": "",
    "Front squat": "",
    "Strict press": "",
    "Push press": "",
  });
  return <div hidden={false} className="w-sm border-1">
    {
      Object.keys(st).map((x)=>{
        return <NamedInput key={x} name={x} st={st} setSt={setSt}/>
      })
    }
    <div className="flex">
      <div className="flex-1"></div>
      <button onClick={checkDelete}>Delete</button>
      <button>Close</button>
      <button>Save</button>
    </div>
  </div>
}

export default function AthletesView(){
  return <div className="flex">
    <AthletesContainer/>
    <AthleteDetailView/>
  </div>
}


