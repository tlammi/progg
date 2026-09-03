"use client"

import { useState } from "react";
import { type Exercise } from "@/store/dataModel";

function SetGroupEditor() {
  return <div className="grid grid-flow-col mb-2">
    <input className="w-20" placeholder="Sets"></input>
    <input className="w-20" placeholder="Reps"></input>
    <input className="w-20" placeholder="Load"></input>
    <input className="w-20" placeholder="Unit"></input>
    <input className="w-20" placeholder="Hint"></input>
    <button>Delete</button>
  </div>
}

function ExerciseDetailedView({ ex, close }: { ex: Exercise, close: () => void }) {
  return <div className="border bg-white absolute z-1 w-lg m-5 shadow-lg rounded-sm">
    <h2>{ex.name}</h2>
    <SetGroupEditor />
    <SetGroupEditor />
    <SetGroupEditor />
    <button>Add</button>
    <div className="flex">
      <div className="flex-grow"></div>
      <button>Delete</button>
      <button onClick={close}>Close</button>
      <button>Save</button>
    </div>
  </div>;
}

function ExerciseSimpleView({ ex, hidden, onClick }: { ex: Exercise, hidden: boolean, onClick: (e: Exercise) => void }) {

  const wrap = () => { onClick(ex); };
  return <div hidden={hidden} className="border m-1" onClick={wrap}>
    <p><b>{ex.name}</b></p>
  </div>
}

export default function ExercisesView() {

  const [exercises, setExercises] = useState<Object[]>([
    { name: "Tempaus", sets: [], hidden: false },
    { name: "Työntö", sets: [], hidden: false },
    { name: "Kyykky", sets: [], hidden: false },
    { name: "Etukyykky", sets: [], hidden: false },
    { name: "Bulgarialainen kyykky", sets: [], hidden: false },
  ]);

  const [detailedView, setDetailedView] = useState<any>();

  const onClick = (e: Exercise) => {
    setDetailedView(<ExerciseDetailedView ex={e} close={() => { setDetailedView(null); }} />);
  };

  const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value.toLowerCase();
    setExercises(exercises.map(e => ({ ...e, hidden: e.name.toLowerCase().indexOf(str) < 0 })));
  };

  return <div className="flex flex-col h-screen">
    <input placeholder="Filter" onChange={onEdit}></input>
    <div className="bg-green-300 flex-grow flex flex-wrap items-start">
      {detailedView}
      {exercises.map(e => <ExerciseSimpleView hidden={e.hidden} key={e.name} ex={e} onClick={onClick} />)}
    </div>
  </div>;
}

