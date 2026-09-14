import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Program, type Session, type Cycle, type Exercise } from "./dataModel";


type ExerciseMap = {
  [id: number]: Exercise,
}

type SessionMap = {
  [id: number]: Session,
};

type CycleMap = {
  [id: number]: Cycle,
};

type ProgramMap = {
  [id: number]: Program,
}

export type Store = {
  id: number,
  sessions: SessionMap,
  cycles: CycleMap,
  programs: ProgramMap,
  newProgram: () => Program,
  updateProgram: (p: Program) => void,
  deleteProgram: (p: Program) => void,
  newCycle: (p: Program) => Cycle,
  newSession: (c: Cycle) => Session,
}

const store = create<Store>((set, get) => ({
  id: 0,
  sessions: {},
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
  newSession: (c: Cycle) => {
    const self = get();
    let session_ids = self.cycles[c.id].sessions;
    const id = self.id;
    session_ids.push(id);
    self.sessions[id] = { id: id, name: "New Session", exercises: [] };
    set({
      id: id + 1,
      sessions: self.sessions,
      cycles: self.cycles,
    });
    return self.sessions[id];
  }

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

export function useSessions(c: Cycle | undefined) {
  if (c === undefined) {
    return {
      sessions: [],
      newSession: (_: Cycle) => {
        console.log("skipping session creation");
      }
    };
  }
  return {
    sessions: store(useShallow(st => st.cycles[c.id].sessions.map(id => st.sessions[id]))),
    newSession: store(st => st.newSession),
  };
}
