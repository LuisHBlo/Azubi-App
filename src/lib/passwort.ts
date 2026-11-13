import { randomInt } from "node:crypto";
// Ohne leicht verwechselbare Zeichen (0/O, 1/l/I)
const ZEICHEN = "abcdefghjkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ23456789";
export const zufallsPasswort = (n = 10) => Array.from({ length: n }, () => ZEICHEN[randomInt(ZEICHEN.length)]).join("");
