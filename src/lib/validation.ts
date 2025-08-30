export const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
export function isStrongPassword(pw: string): boolean {
  return PASSWORD_RULE.test(pw ?? "");
}
export const PASSWORD_HELP_PT =
  "A senha deve ter no mínimo 6 caracteres, com pelo menos: 1 letra maiúscula, 1 número e 1 símbolo.";
