import bcrypt from "bcrypt";

export class Password {
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  static async comparePassword(plainPass: string, hashPass: string) {
    return bcrypt.compare(plainPass, hashPass);
  }
}
