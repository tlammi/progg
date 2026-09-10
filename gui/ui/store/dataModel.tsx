import { create } from "zustand";

// How many extra sets or reps does "+" at the end mean
const PLUS_EXTRA = 3;

export class Range {
  min: number;
  max: number;
  constructor(min: number, max: number | null = null) {
    this.min = min;
    this.max = max ?? min;
  }

  add(other: Range): Range {
    return new Range(this.min + other.min, this.max + other.max);
  }
  multiply(other: Range | number): Range {
    if (typeof other === "number")
      return new Range(this.min * other, this.max * other);
    return new Range(this.min * other.min, this.max * other.max);
  }

  toString(): string {
    if (this.min == this.max) return this.min.toString();
    return `${this.min}-${this.max}`;
  }

};


export function parseRange(s: string): Range | null {
  const n = Number(s);
  if (!isNaN(n)) return new Range(n);
  if (s.endsWith('+')) {
    s = s.slice(0, s.length - 1);
    const n = Number(s);
    if (isNaN(n)) return null;
    return new Range(n, n + PLUS_EXTRA);
  }
  const idx = s.indexOf('-');
  if (idx > 0) {
    const min = Number(s.slice(0, idx));
    const max = Number(s.slice(idx + 1));
    if (isNaN(min) || isNaN(max)) return null;
    return new Range(min, max);
  }
  return null;
}

export class Unit {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  base(): string | null {
    if (!this.value) return null;
    if (this.value[0] !== '%') return null;
    return this.value.slice(1).trim();
  }

};

export class Load {
  value: string;
  unit: Unit;

  constructor(value: string, unit: string) {
    this.value = value;
    this.unit = new Unit(unit);
  }
}

export type SetGroup = {
  // Number of sets.
  sets: Range,

  // Number of reps per set
  reps: Range,

  // Load
  load: Range,

  // Unit, kg, s, % or "%<param>".
  unit: string,

  // Extra hint to add to the program
  hint: string,
}

export type Exercise = {
  // Exercise ID
  id: number,
  // Exercise name
  name: string,
  // Sets for this exercise
  sets: SetGroup[],
}

export type Session = {
  id: number,
  name: string,
  exercises: Exercise[],
}

export type Cycle = {
  name: string,
  sessions: Session[],
}

export type Program = {
  id: number,
  name: string,
  cycles: Cycle[],
}

export type Athlete = {
  id: number,
  name: string,
};

type DataModel = {
  athleteId: number
  athletes: Athlete[];
};

export const useDataModel = create<DataModel>((set, get) => ({
  athleteId: 0,
  athletes: [],

  athleteById: (id: number) => (get().athletes.find((obj) => (obj.id === id))),

  newAthleteId: () => {
    const id = get().athleteId;
    set(st => ({ athleteId: id + 1 }));
    return id;
  },

  addAthlete: (a: Athlete) => set(state => ({
    athletes: [...state.athletes, a],
  })),

  updateAthlete: (a: Athlete) => set(st => {
    const idx = st.athletes.findIndex(obj => obj.id === a.id);
    return {
      athletes: st.athletes.with(idx, a)
    };
  }),

  rmAthleteByName: (name: string) => set(state => {
    console.warn("rmAthleteByName is deprecated (waiting for ID to be implemented)");
    return {
      athletes: state.athletes.filter((obj) => { return obj.name !== name; }),
    }
  }),

  rmAthleteById: (id: number) => set(state => ({
    athletes: state.athletes.filter((obj) => { return obj.id !== id; }),
  })),
}));
