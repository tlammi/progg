"use client"

import {useState} from "react";
import {useDataModel} from "@/store/dataModel.tsx";


function Header({onAddAthlete}){
  return <div className="flex flex-fill border-1 text-lg">
    <div className="flex-none m-1">Athletes</div>
    <div className="flex-1"/>
    <button onClick={onAddAthlete}><b>+</b></button>
  </div>
}

function ListEntry({athlete}){

  const rmAthleteById = useDataModel(st => st.rmAthleteById);

  const onDelete = ()=>{
    if(!window.confirm("Are you sure you want to delete athlete '" + athlete.name + "'?")) return;
    rmAthleteById(athlete.id);
  };
  return <div className="flex">
    <p>{athlete.name}</p>
    <div className="flex-1"></div>
    <button onClick={onDelete}>Delete</button>
    <button>Edit</button>
  </div>
}

function List({athletes}){
  return <div className="border-1">{
    athletes.map((a) => <ListEntry key={a.id} athlete={a}/>)
  }</div>
}

function AthletesContainer({activeAthlete, setActiveAthlete}){
  const athletes = useDataModel(st => st.athletes);
  const addAthlete = useDataModel(st => st.addAthlete);
  const newAthleteId = useDataModel(st => st.newAthleteId);

  return <div className="w-sm">
    <Header onAddAthlete={()=> {
      const id = newAthleteId();
      addAthlete({
        id: id,
        name: "Unnamed",
      })
    }}/>
    <List athletes={athletes}/>
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

function AthleteDetailView({activeAthlete, setActiveAthlete}){

  const addAthlete = useDataModel(st => st.addAthlete);

  const [st, setSt] = useState({
    "Name": "",
    "Snatch": "",
    "C&J": "",
    "Squat": "",
    "Front squat": "",
    "Strict press": "",
    "Push press": "",
  });

  const onSave = () =>{
    addAthlete({
      name: st["Name"],
    });
  };

  const onClose = () => {
    setActiveAthlete(null);
  };

  return <div hidden={activeAthlete !== null} className="w-sm border-1">
    {
      Object.keys(st).map((x)=>{
        return <NamedInput key={x} name={x} st={st} setSt={setSt}/>
      })
    }
    <div className="flex">
      <div className="flex-1"></div>
      <button onClick={onClose}>Close</button>
      <button onClick={onSave}>Save</button>
    </div>
  </div>
}

export default function AthletesView(){
  const [activeAthlete, setActiveAthlete] = useState();
  return <div className="flex">
    <AthletesContainer activeAthlete={activeAthlete} setActiveAthlete={setActiveAthlete}/>
    <AthleteDetailView activeAthlete={activeAthlete} setActiveAthlete={setActiveAthlete}/>
  </div>
}


