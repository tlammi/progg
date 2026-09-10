import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Program, type Session, type Cycle } from "./dataModel";


type Exercise = {
  [id: number]: Exercise,
}

type CycleMap = {
  [id: number]: Cycle,
};

type ProgramMap = {
  [id: number]: Program,
}

export type Store = {
  id: number,
  cycles: CycleMap,
  programs: ProgramMap,
  newProgram: () => Program,
  updateProgram: (p: Program) => void,
  deleteProgram: (p: Program) => void,
  newCycle: (p: Program) => Cycle,
}

const store = create<Store>((set, get) => ({
  id: 0,
  cycles: {},
  programs: {},

  newProgram: () => {
    const self = get();
    const id = self.id;
    set({ id: id + 1 });
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
    const self = get();
    let programs = self.programs;
    console.log(programs);
    let cycles = programs[p.id].cycles;
    const id = self.id;
    set({ id: id + 1 });
    cycles.push(id);
    self.cycles[id] = { id: id, name: "", sessions: [] };
    set({
      id: id + 1,
      cycles: self.cycles,
      programs: programs,
    });
    console.log(self);
    return self.cycles[id];
  },

}));

export function usePrograms() {
  return {
    programs: store(useShallow(st => Object.values(st.programs))),
    newProgram: store(st => st.newProgram),
    updateProgram: store(st => st.updateProgram),
    deleteProgram: store(st => st.deleteProgram),
  };
}

export function useCycles(p: Program) {
  return {
    cycles: store(useShallow(st => st.programs[p.id].cycles.map(id => st.cycles[id]))),
    newCycle: store(st => st.newCycle),
  };
}

export function useExercises(c: Cycle) {
}
