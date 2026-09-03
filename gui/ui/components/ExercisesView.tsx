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
    <div className="flex">
      <div className="flex-grow"></div>
      <button>Delete</button>
      <button onClick={close}>Close</button>
      <button>Save</button>
    </div>
  </div>;
}

function ExerciseSimpleView({ ex, onClick }: { ex: Exercise, onClick: (e: Exercise) => void }) {

  const wrap = () => { onClick(ex); };
  return <div className="border m-1" onClick={wrap}>
    <p><b>{ex.name}</b></p>
  </div>
}

export default function ExercisesView() {

  const [st, setSt] = useState<any>();

  const onClick = (e: Exercise) => {
    setSt(<ExerciseDetailedView ex={e} close={() => { setSt(null); }} />);
  };

  const mkEx = (nm: string) => {
    return { name: nm, sets: [] };
  };

  return <div className="flex flex-col h-screen">
    <input placeholder="Filter"></input>
    <div className="bg-green-300 flex-grow flex flex-wrap items-start">
      {st}
      <ExerciseSimpleView ex={mkEx("Tempaus")} onClick={onClick}></ExerciseSimpleView>
      <ExerciseSimpleView ex={mkEx("Työntö")} onClick={onClick}></ExerciseSimpleView>
      <ExerciseSimpleView ex={mkEx("Kyykky")} onClick={onClick}></ExerciseSimpleView>
      <ExerciseSimpleView ex={mkEx("Etukyykky")} onClick={onClick}></ExerciseSimpleView>
      <ExerciseSimpleView ex={mkEx("Bulgarialainen kyykky")} onClick={onClick}></ExerciseSimpleView>
    </div>
  </div>;
}

