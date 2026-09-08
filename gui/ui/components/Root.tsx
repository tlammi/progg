"use client"

import { useState } from "react";
import SessionContainer from "./SessionContainer";
import Navigation from "./Navigation";
import ExercisesView from "./ExercisesView";
import ProgramSkeletonsView from "./ProgramSkeletonsView";
import AthletesView from "./AthletesView";

export default function Root() {

  const views = {
    "Program Skeletons": <ProgramSkeletonsView />,
    "Exercises": <ExercisesView />,
    "Athletes": <AthletesView />,
  };

  const [c, setC] = useState("Programs");

  const onclick = (msg: string) => {
    setC(msg);
  };
  return <div>
    <Navigation options={Object.keys(views)} onPageSelect={onclick}></Navigation>
    <div>{views[c]}</div>
  </div>

}

