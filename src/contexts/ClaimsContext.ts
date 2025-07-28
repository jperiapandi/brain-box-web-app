import { createContext } from "react";

export type Claims = {
  admin: boolean;
};
export const ClaimsContext = createContext<Claims | null>(null);
