"use client"

import { useState } from "react";
import { type Exercise } from "@/store/dataModel";
import { useExercises } from "@/store/exercises";

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

  const onName = (e: React.ChangeEvent<HTMLInputElement>) => {
    ex.name = e.target.value;
  };

  const updateExercise = useExercises().updateExercise;
  const deleteExercise = useExercises().deleteExercise;

  const onSave = () => {
    updateExercise(ex);
    close();
  };

  const onDelete = () => {
    deleteExercise(ex);
    close();
  };

  return <div className="popup">
    <input className="m-2" defaultValue={ex.name} onChange={onName}></input>
    <SetGroupEditor />
    <SetGroupEditor />
    <SetGroupEditor />
    <button>Add</button>
    <div className="flex">
      <div className="flex-grow"></div>
      <button onClick={onDelete}>Delete</button>
      <button onClick={close}>Close</button>
      <button onClick={onSave}>Save</button>
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
  const ex = useExercises();

  const [detailedView, setDetailedView] = useState<any>();
  const [filterContent, setFilterContent] = useState<string>("");

  const onClick = (e: Exercise) => {
    setDetailedView(<ExerciseDetailedView ex={e} close={() => { setDetailedView(null); }} />);
  };

  const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterContent(e.target.value.toLowerCase());
  };

  const onNew = () => {
    const e = ex.newExercise();
    setDetailedView(<ExerciseDetailedView ex={e} close={() => { setDetailedView(null); }} />);
  };

  const simpleViews =
    ex.exercises.map(e => <ExerciseSimpleView hidden={e.name.toLowerCase().indexOf(filterContent) < 0} key={e.id} ex={e} onClick={onClick} />);

  return <div className="flex flex-col h-screen">
    <button onClick={onNew}>New</button>
    <input placeholder="Filter" onChange={onEdit}></input>
    <div className="bg-green-300 flex-grow flex flex-wrap items-start">
      {detailedView}
      {simpleViews}
    </div>
  </div>;
}

