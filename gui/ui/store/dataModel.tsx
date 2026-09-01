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

  athleteById: (id: int) => (get().athletes.find((obj) => (obj.id === id))),

  newAthleteId: () =>  {
    const id = get().athleteId;
    set(st => ({athleteId: id+1}));
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
      athletes: state.athletes.filter((obj)=>{ return obj.name !== name; }),
    }
  }),

  rmAthleteById: (id: int) => set(state => ({
      athletes: state.athletes.filter((obj)=>{ return obj.id !== id; }),
  })),
}));
