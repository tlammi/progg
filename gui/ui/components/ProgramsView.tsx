"use client"

import { useState } from "react";


function NewProgramDialog({ onClose }: { onClose: () => void }) {
  return <div className="popup">
    <h2>Create a new program</h2>
    <div>
      <div className="grid m-2 grid-cols-2 gap-x-2 gap-y-2">
        <p>Program name:</p>
        <input placeholder="Name" />
        <p>Sessions per cycle:</p>
        <input defaultValue={7} />
        <p>Cycle count:</p>
        <input />
      </div>
    </div>
    <div className="flex">
      <div className="flex-1"></div>
      <button>Create</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>;
}

function ActiveProgram() {
  return <div>Hello</div>;
}

export default function ExercisesView() {
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [newProgDialog, setNewProgDialog] = useState<any>(null);

  const closeNewDialog = () => {
    setNewProgDialog(null);
  };

  const onNew = () => {
    setNewProgDialog(<NewProgramDialog onClose={closeNewDialog} />);
  };

  return <>
    <button onClick={onNew}>New</button>
    <button>Open</button>
    {newProgDialog}
  </>;
}


