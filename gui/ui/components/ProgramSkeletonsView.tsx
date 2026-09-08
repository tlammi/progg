"use client"

import { useState, useRef, useEffect, useId } from "react";
import { useDraggable } from "@dnd-kit/react";
import usePrograms from "@/store/programs";
import { Program } from "@/store/dataModel";
import DragHandle from "./DragHandle";
import { type Exercise, parseRange, type Range } from "@/store/dataModel";


function NewProgramDialog({ onClose }: { onClose: () => void }) {
  const newProgram = usePrograms().newProgram;
  const updateProgram = usePrograms().updateProgram;

  const nmRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nmRef.current?.focus(); });

  const [nm, setNm] = useState<string>("");

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNm(e.target.value);
  };

  const onCreate = () => {
    const e = newProgram();
    e.name = nm;
    updateProgram(e);
    onClose();
  };

  return <div className="popup">
    <h2>Create a new program</h2>
    <div>
      <div className="grid m-2 grid-cols-2 gap-x-2 gap-y-2">
        <p>Program name:</p>
        <input placeholder="Name" onChange={onNameChange} ref={nmRef} />
        <p>Sessions per cycle (not implemented):</p>
        <input defaultValue={7} />
        <p>Cycle count (not implemented):</p>
        <input />
      </div>
    </div>
    <div className="flex">
      <div className="flex-1"></div>
      <button onClick={onCreate}>Create</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>;
}


function ProgramTable({ onEdit }: { onEdit: (p: Program) => void }) {
  const [newProgDialog, setNewProgDialog] = useState<any>(null);
  const closeNewDialog = () => {
    setNewProgDialog(null);
  };

  const programs = usePrograms().programs;
  const deleteProgram = usePrograms().deleteProgram;

  const onDelete = (p: Program) => {
    deleteProgram(p)
  };
  const onNew = () => {
    setNewProgDialog(<NewProgramDialog onClose={closeNewDialog} />);
  };

  const mkRow = (p: Program) => {
    return <tr key={p.id}>
      <td>{p.name}</td>
      <td>
        <button onClick={() => onEdit(p)}>Edit</button>
        <button onClick={() => onDelete(p)}>Delete</button>
      </td>
    </tr>;
  };

  return <>
    <button onClick={onNew}>New</button>
    {newProgDialog}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {programs.map(mkRow)}
      </tbody>
    </table>
  </>;
}

function ExerciseView({ ex }: { ex: Exercise }) {

  /*
  const ex: Exercise = {
    id: 1,
    name: "Tempaus",
    sets: [
      { sets: parseRange("1-3") as Range, reps: parseRange("3") as Range, load: parseRange("100") as Range, unit: "%", hint: "" },
    ],
  };
  */

  const id = useId();
  const { ref, handleRef, isDragging } = useDraggable({ id });
  return <div ref={ref} className="border m-1">
    <div className="flex">
      <h2>{ex.name}</h2>
      <div className="flex-1"></div>
      <button>...</button>
      <DragHandle ref={handleRef} />
    </div>
    <div>
      <div className="grid grid-cols-4">
        <input defaultValue={ex.sets[0].sets.toString()} />
        <input defaultValue={ex.sets[0].reps.toString()} />
        <input defaultValue={ex.sets[0].load.toString()} />
        <input defaultValue={ex.sets[0].unit.toString()} />
      </div>
    </div>
  </div>
}

function SessionView() {
  const ex: Exercise = {
    id: 1,
    name: "Tempaus",
    sets: [
      { sets: parseRange("1-3") as Range, reps: parseRange("3") as Range, load: parseRange("100") as Range, unit: "%", hint: "" },
    ],
  };

  const id = useId();
  const { ref, handleRef, isDragging } = useDraggable({ id });
  return <div ref={ref} className="border-solid border-2 border-black session ml-1 mr-1">
    <input placeholder="Session Name"></input>
    <button>...</button>
    <DragHandle ref={handleRef} />
    <ExerciseView ex={ex} />
  </div>
}


function ProgramEditor({ active, onClose }: { active: Program, onClose: () => void }) {
  return <div>
    <div className="flex">
      <button onClick={onClose}>Close</button>
      <div className="flex">
        <p>Name:</p>
        <input defaultValue={active.name} />
      </div>
      <div className="flex">
        <p>Cycle:</p>
        <button>&lt;</button>
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button>&gt;</button>
      </div>
    </div>
    <div className="flex justify-center">
      <SessionView />
      <SessionView />
      <SessionView />
      <SessionView />
      <SessionView />
      <SessionView />
      <SessionView />
    </div>
  </div>;
};


export default function ProgramSkeletonsView() {
  const [view, setView] = useState<"table" | "edit">("table");

  const [activeProg, setActiveProg] = useState<Program | null>(null);


  return <>
    {view === "table" && <ProgramTable onEdit={(p: Program) => { setActiveProg(p); setView("edit"); }} />}
    {view === "edit" && <ProgramEditor active={activeProg as Program} onClose={() => { setView("table"); }} />}
  </>;
}


