export function genRandomOtp(): number {
  return Math.floor(1000 + Math.random() * 9000);
}
