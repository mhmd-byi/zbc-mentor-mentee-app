// Creates an admin account. Run with: npm run create-admin
import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { MongoClient } from "mongodb";
import { hashPassword } from "../lib/password.ts";
import { loginSchema } from "../lib/schemas.ts";

const MIN_PASSWORD_LENGTH = 12;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  fail("MONGODB_URI is empty. Add it to .env.local first.");
}

let hideInput = false;
const output = new Writable({
  write(chunk, _encoding, done) {
    if (!hideInput) process.stdout.write(chunk);
    done();
  },
});
const readline = createInterface({
  input: process.stdin,
  output,
  terminal: Boolean(process.stdin.isTTY),
});
const lines = readline[Symbol.asyncIterator]();

async function ask(label, { secret = false } = {}) {
  readline.setPrompt(`${label}: `);
  readline.prompt();
  hideInput = secret;
  const { value = "" } = await lines.next();
  if (secret) {
    hideInput = false;
    process.stdout.write("\n");
  }
  return value;
}

const name = (await ask("Name")).trim();
const email = (await ask("Email")).trim().toLowerCase();
const password = await ask(
  `Password (at least ${MIN_PASSWORD_LENGTH} characters)`,
  { secret: true },
);
const confirmation = await ask("Confirm password", { secret: true });
readline.close();

if (!name) fail("Name is required.");
if (!loginSchema.shape.email.safeParse(email).success) {
  fail("Enter a valid email address.");
}
if (password.length < MIN_PASSWORD_LENGTH) {
  fail(`The password needs at least ${MIN_PASSWORD_LENGTH} characters.`);
}
if (password !== confirmation) fail("The passwords don't match.");

const client = new MongoClient(process.env.MONGODB_URI);
try {
  const users = client.db().collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  await users.insertOne({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    status: "active",
    createdAt: new Date(),
  });
  console.log(`Admin account created for ${email}.`);
} catch (error) {
  // 11000 is MongoDB's duplicate key error.
  if (error?.code !== 11000) throw error;
  console.error(`An account with ${email} already exists.`);
  process.exitCode = 1;
} finally {
  await client.close();
}
