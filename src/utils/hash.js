import bcryptjs from "bcryptjs";

export function genId() {
  return randomUUID();
}

export function genHash(salt = 10, pwd) {
  return bcryptjs.hashSync(pwd, salt);
}

export function compareHash(hash, pwd) {
  return bcryptjs.compareSync(pwd, hash);
}
