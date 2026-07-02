/** Mask email for display in federated preview (PII-safe UI). */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

/** Mask phone for display in federated preview (PII-safe UI). */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***-***-${digits.slice(-4)}`;
}

/** Mask a person's name to initials for display in federated preview (PII-safe UI). */
export function maskName(first?: string | null, last?: string | null): string {
  const f = (first ?? "").trim();
  const l = (last ?? "").trim();
  if (!f && !l) return "***";
  return `${f ? f[0] + "." : ""}${f && l ? " " : ""}${l ? l[0] + "." : ""}`;
}