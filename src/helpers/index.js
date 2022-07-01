import { randomUUID } from "crypto";
import bcryptjs from "bcryptjs";

export const genId = () => randomUUID();

export const genHash = (salt = 10, string) => {
  return bcryptjs.hashSync(salt, string);
};

export const compareHash = (string, hash) => {
  return bcryptjs.compareSync(string, hash);
};
