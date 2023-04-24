export type ReturnedJsonType = {
  data?: any;
  msg?: string;
  type:
    | "SUCCESS"
    | "ALREADY"
    | "NOTFOUND"
    | "UNAUTHORIZED"
    | "SERVER_ERROR"
    | "INVALID";
};
