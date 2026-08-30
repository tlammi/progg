"use client"

import Session from "./Session.tsx";

import {DragDropProvider} from "@dnd-kit/react";

export default function SessionContainer(){
  return <div>
    <div>...</div>
    <DragDropProvider>
    <div className="flex justify-center">
      <Session></Session>
      <Session></Session>
      <Session></Session>
      <Session></Session>
      <Session></Session>
      <Session></Session>
      <Session></Session>
    </div>
  </DragDropProvider>
  </div>
}
