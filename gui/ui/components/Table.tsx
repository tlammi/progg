
import { useId } from "react";


type IdAndValue<T> = {
  id: any,
  value: T,
}

type OptionalId<T> = IdAndValue<T> | T;

type Items = {
  id: any,
  values: any[],
}

type Args = {
  header: OptionalId<string>[],
  items: any[][],
}

export default function Table({ header, items }: Args) {

  const mapHdr = (x: OptionalId<string>) => <th key={typeof x === "string" ? x : x.id}>{typeof x === "string" ? x : x.value}</th>;
  const mapBodyLine = (x: any) => <th>{x}</th>;
  const mapBody = (x: any[]) => <tr>{x.map(mapBodyLine)}</tr>;

  return <table>
    <thead><tr>{header.map(mapHdr)}</tr></thead>
    <tbody></tbody>
  </table>

  return <table>
    <thead><tr>{header.map(mapHdr)}</tr></thead>
    <tbody>{items.map(mapBody)}</tbody>
  </table>;
}
