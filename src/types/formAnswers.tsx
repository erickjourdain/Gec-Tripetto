import { TSerializeTypes } from "@tripetto/runner";

export type Answer = {
  dataType: string;
  name: string;
  string: string;
  value: TSerializeTypes
}

export type FormAnswers = {
  id: string;
  question: string;
  reponses: Answer[];
};
