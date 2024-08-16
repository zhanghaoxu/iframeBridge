import { Handler } from './bridge';

export interface Command {
  type: string;
  data?: any;
}

export interface CMD extends Command {
  type: string;
  target?: string;
  cb?: string;
  callback?: Handler;
  code?: string;
}
