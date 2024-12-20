import { WhereFilterOp } from "firebase/firestore";

export interface ICondition<T> {
  key: keyof T;
  opStr: WhereFilterOp;
  value: unknown;
}
