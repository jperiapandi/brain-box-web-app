export type ApiLoader<T> = {
  progress: boolean;
  success: boolean;
  failure: boolean;
  error?: Error;
  data: T | undefined;
};
