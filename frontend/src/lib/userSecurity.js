const PASSWORD_LENGTH = 10;
const CHARACTER_GROUPS = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "!@#$%&*?_-+=",
];
const ALL_CHARACTERS = CHARACTER_GROUPS.join("");

function randomIndex(max) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Este navegador no permite generar contraseñas seguras.");
  }

  const range = 0x1_0000_0000;
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);
  let value;

  do {
    globalThis.crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);

  return value % max;
}

function shuffleSecurely(characters) {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [characters[index], characters[swapIndex]] = [
      characters[swapIndex],
      characters[index],
    ];
  }
  return characters;
}

export function generateTemporaryPassword() {
  const password = CHARACTER_GROUPS.map(
    (group) => group[randomIndex(group.length)],
  );

  while (password.length < PASSWORD_LENGTH) {
    password.push(ALL_CHARACTERS[randomIndex(ALL_CHARACTERS.length)]);
  }

  return shuffleSecurely(password).join("");
}
