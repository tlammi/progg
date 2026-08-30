"use client"

import {useId, useState} from "react";
import {useDraggable, DragDropProvider} from "@dnd-kit/react";
import {useSortable} from "@dnd-kit/react/sortable";
import DragHandle from "./DragHandle.tsx";


function Exercise({name, id}){
  const {ref, handleRef} = useSortable({id: id});
  //const {ref, handleRef, isDragging} = useDraggable({id: id});
  return <div ref={ref} className="grid">
    <div>
      <input type="text" placeholder={name} ref={ref}></input>
      <DragHandle ref={handleRef}/>
    </div>
    <div>
    <button className="ml-2">+</button>
    </div>
  </div>
}

function AddNewExercise({onAdd}) {
      return <button onClick={onAdd}>+</button>
}

export default function Session(){
  const id = useId();
  const {ref, handleRef, isDragging} = useDraggable({id});
  const [exid, setExid] = useState(0);
  const [exs, setExs] = useState<Exercise[]>([]);
  const cb = ()=>{ 
      setExs([...exs, <Exercise name={"foo"} id={exid}/>]); 
      setExid(exid+1);
    };
  return <div ref={ref} className="border-solid border-2 border-black session ml-1 mr-1" >
    <DragHandle ref={handleRef}/>
    <div className="flex flex-row">
      <input type="text" placeholder="Session"></input>
      <button>...</button>
    </div>
    <DragDropProvider>
        {...exs}
    </DragDropProvider>
    <AddNewExercise onAdd={cb}/>
  </div>
}

