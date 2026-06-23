export type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
  TaskDetails: { taskId: string };
};

export type MainTabParamList = {
  All: undefined;
  Pending: undefined;
  Completed: undefined;
};
