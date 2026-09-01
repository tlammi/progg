import {create} from "zustand";


export type Athlete = {
  id: int,
  name: string,
};

type DataModel = {
  athleteId: int
  athletes: Athlete[];
};

export const useDataModel = create<DataModel>((set, get) => ({
  athleteId: 0,
  athletes: [],

  newAthleteId: () =>  {
    const id = get().athleteId;
    set(st => ({athleteId: id+1}));
    return id;
  },
  addAthlete: (a: Athlete) => set(state => ({
      athletes: [...state.athletes, a],
  })),

  rmAthleteByName: (name: string) => set(state => {
    console.warn("rmAthleteByName is deprecated (waiting for ID to be implemented)");
    return {
      athletes: state.athletes.filter((obj)=>{ return obj.name !== name; }),
    }
  }),

  rmAthleteById: (id: int) => set(state => ({
      athletes: state.athletes.filter((obj)=>{ return obj.id !== id; }),
  })),
}));
