import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Program, type Session, type Cycle } from "./dataModel";

type ProgramMap = {
  [id: number]: Program,
}

export type ExerciseStore = {
  programs: ProgramMap,
  newProgram: () => Program,
  updateProgram: (p: Program) => void,
  deleteProgram: (p: Program) => void,
  newCycle: (p: Program) => Cycle,
}

export const exerciseStore = create<ExerciseStore>((set, get) => ({
  programs: {},

  newProgram: () => {
    const self = get();
    const empty = Object.keys(self.programs).length === 0;
    const id = empty ? 0 : Math.max(...(Object.keys(self.programs) as unknown as number[])) + 1;
    console.log(id);
    const ex: Program = {
      id: id,
      name: "New Program",
      cycles: [],
    };
    set(st => ({
      programs: {
        ...st.programs,
        [id]: ex,
      }
    }));
    return ex;
  },
  updateProgram: (p: Program) => {
    let obj = get().programs;
    obj[p.id] = p;
    set(_ => ({
      programs: obj
    }));
  },

  deleteProgram: (p: Program) => {
    let obj = get().programs;
    delete obj[p.id];
    set(_ => ({
      programs: obj
    }));
  },
  newCycle: (p: Program) => {
    let programs = get().programs;
    let cycles = programs[p.id].cycles;
    const id = cycles.length === 0 ? 0 : cycles[cycles.length - 1].id + 1;
    cycles.concat({ id: id, name: "", sessions: [] });
    set({ programs: programs });
    return cycles[cycles.length - 1];
  }
}));

export default function useExercises() {
  return {
    programs: exerciseStore(useShallow(st => Object.values(st.programs))),
    newProgram: exerciseStore(st => st.newProgram),
    updateProgram: exerciseStore(st => st.updateProgram),
    deleteProgram: exerciseStore(st => st.deleteProgram),
  }
};
