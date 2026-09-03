"use client"

import {useState} from "react";
import SessionContainer from "./SessionContainer.tsx";
import Navigation from "./Navigation.tsx";
import ExercisesView from "./ExercisesView.tsx";
import ProgramsView from "./ProgramsView.tsx";
import AthletesView from "./AthletesView.tsx";

export default function Root(){

  const views = {
    "Program Skeletons": <ProgramsView/>,
    "Exercises": <ExercisesView/>,
    "Athletes": <AthletesView/>,
  };

  const [c, setC] = useState("Programs");

  const onclick = (msg: string)=>{
    setC(msg);
  };
  return <div>
    <Navigation options={Object.keys(views)} onPageSelect={onclick}></Navigation>
    <div>{views[c]}</div>
  </div>

}

