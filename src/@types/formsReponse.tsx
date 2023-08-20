import { FormResponse } from "./formResponse";

export type FormsResponse = {
  data: FormResponse[];
  hasPrevious: boolean;
  hasNext: boolean;
}