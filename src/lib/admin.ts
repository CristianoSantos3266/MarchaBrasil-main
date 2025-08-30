export function isAdminEmail(email?: string | null): boolean {
  const admin = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  return !!email && !!admin && email.toLowerCase().trim() === admin;
}
