export interface OutputDTO {
  id: number;
  msg_output: string;
}

export interface InputDTO {
  id: number;
  date: string;
  msg_input: string;
  output: OutputDTO;
}
