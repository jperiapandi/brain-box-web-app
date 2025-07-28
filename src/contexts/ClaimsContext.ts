import { createContext } from "react";

export type Claims = {
  superAdmin: boolean;
  admin: boolean;
};
export const ClaimsContext = createContext<Claims | null>(null);
