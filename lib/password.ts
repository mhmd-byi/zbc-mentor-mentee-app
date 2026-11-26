// Also imported by scripts/create-admin.mjs, so keep it free of Next.js imports.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// One of the scrypt settings recommended by OWASP.
const SCRYPT_OPTIONS = { N: 2 ** 14, r: 8, p: 5 };
const KEY_LENGTH = 64;

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${salt.toString("base64")}:${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored?: string) {
  // Hash even when there is no account, so response time doesn't reveal which emails exist.
  const [salt, key] = (stored ?? ":").split(":");
  const actual = await deriveKey(password, Buffer.from(salt, "base64"));
  return (
    stored !== undefined && timingSafeEqual(actual, Buffer.from(key, "base64"))
  );
}
