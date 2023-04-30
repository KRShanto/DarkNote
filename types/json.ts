export type ReturnedJsonType = {
  data?: any;
  msg?: string;
  type:
    | "SUCCESS"
    | "ALREADY"
    | "NOTFOUND"
    | "USER_NOTFOUND"
    | "UNAUTHORIZED"
    | "SERVER_ERROR"
    | "INVALID"
    | "LOCKED";
};
