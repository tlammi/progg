
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { type Exercise } from "./dataModel";

type ExerciseMap = {
  [id: number]: Exercise,
}

export type ExerciseStore = {
  exercises: ExerciseMap,
  newExercise: () => Exercise,
  updateExercise: (e: Exercise) => void,
  deleteExercise: (e: Exercise) => void,
}

export const exerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: {},

  newExercise: () => {
    const self = get();
    const id = Object.keys(self.exercises).length;
    const ex: Exercise = {
      id: id,
      name: "New Exercise",
      sets: [],
    };
    set(st => ({
      exercises: {
        ...st.exercises,
        [id]: ex,
      }
    }));
    return ex;
  },
  updateExercise: (ex: Exercise) => {
    let obj = get().exercises;
    obj[ex.id] = ex;
    set(_ => ({
      exercises: obj
    }));
  },

  deleteExercise: (ex: Exercise) => {
    let obj = get().exercises;
    delete obj[ex.id];
    set(_ => ({
      exercises: obj
    }));
  },
}));

export function useExercises() {
  return {
    exercises: exerciseStore(useShallow(st => Object.values(st.exercises))),
    newExercise: exerciseStore(st => st.newExercise),
    updateExercise: exerciseStore(st => st.updateExercise),
    deleteExercise: exerciseStore(st => st.deleteExercise),
  }
};
