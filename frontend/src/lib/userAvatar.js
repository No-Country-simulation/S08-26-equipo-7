const AVATAR_HUE_BUCKETS = 360;

function normalizeName(name = "") {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function getUserInitials(name = "") {
  const parts = normalizeName(name).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return Array.from(parts[0]).slice(0, 2).join("").toUpperCase();
  return `${Array.from(parts[0])[0]}${Array.from(parts.at(-1))[0]}`.toUpperCase();
}

export function getUserAvatarStyle(name = "") {
  const normalized = normalizeName(name).toLocaleLowerCase();
  let hash = 0;

  for (const character of normalized) {
    hash = (Math.imul(hash, 31) + character.codePointAt(0)) | 0;
  }

  const hue = (hash >>> 0) % AVATAR_HUE_BUCKETS;
  return { "--user-avatar-hue": hue };
}
