"use client"

import {useState, useEffect} from "react";
import {useDataModel} from "@/store/dataModel.tsx";


function Header({onAddAthlete}){
  return <div className="flex flex-fill border-1 text-lg">
    <div className="flex-none m-1">Athletes</div>
    <div className="flex-1"/>
    <button onClick={onAddAthlete}><b>+</b></button>
  </div>
}

function ListEntry({athlete, activeAthlete, setActiveAthlete}){

  const rmAthleteById = useDataModel(st => st.rmAthleteById);

  const onDelete = ()=>{
    if(!window.confirm("Are you sure you want to delete athlete '" + athlete.name + "'?")) return;
    rmAthleteById(athlete.id);
  };
  const onEdit = ()=>{
    setActiveAthlete(athlete.id);
  };

  return <div className="flex">
    <p>{athlete.name}</p>
    <div className="flex-1"></div>
    <button onClick={onDelete}>Delete</button>
    <button onClick={onEdit}>Edit</button>
  </div>
}

function List({athletes, activeAthlete, setActiveAthlete}){
  return <div className="border-1">{
    athletes.map((a) => <ListEntry key={a.id} athlete={a} activeAthlete={activeAthlete} setActiveAthlete={setActiveAthlete}/>)
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
    <List athletes={athletes} activeAthlete={activeAthlete} setActiveAthlete={setActiveAthlete}/>
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

  const athletes = useDataModel(st=>st.athletes);
  const updateAthlete = useDataModel(st => st.updateAthlete);
  const athleteById = useDataModel(st => st.athleteById);

  const [st, setSt] = useState({
      "Name": "",
      "Snatch": "",
      "C&J": "",
      "Squat": "",
      "Front squat": "",
      "Strict press": "",
      "Push press": "",
  });

  // This needs revisiting, probably need to only create this component when it is needed
  useEffect(() => {
    const ath = athletes[activeAthlete];
    setSt({...st, Name: ath?.name ?? ""});
  }, [athletes, activeAthlete]);

  const onSave = () =>{
    const old = athletes[activeAthlete];
    const ath = {...old, name: st["Name"]};
    updateAthlete(ath);
  };

  const onClose = () => {
    setActiveAthlete(null);
  };

  return <div hidden={activeAthlete === null} className="w-sm border-1">
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
  const [activeAthlete, setActiveAthlete] = useState(null);
  return <div className="flex">
    <AthletesContainer activeAthlete={activeAthlete} setActiveAthlete={setActiveAthlete}/>
    <AthleteDetailView activeAthlete={activeAthlete} setActiveAthlete={setActiveAthlete}/>
  </div>
}


