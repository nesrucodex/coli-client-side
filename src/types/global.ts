export enum TaskStatus {
  CREATED,
  TODO,
  PROGRESS,
  DONE,
  APPROVED,
  DISAPPROVED,
}

export enum ASYNC_STATE {
  IDEL,
  LOADING,
  SUCCESS,
  ERROR,
  REDIRECT,
}

export interface ITodoComment {
  id: string;
  todo: ITodo;
  user: IUser;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodo {
  id: string;
  content: string;
  createdAt: Date;
  deadLine: Date;
  status: TaskStatus;
  comments: ITodoComment[];
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  profile: string;
}

export interface ITeam {
  _id: string;
  creator: IUser;
  name: string;
  description?: string;
  bio?: string;
  profile?: string;
  members: IUser[];
  possibleMembers?: string[];
}
