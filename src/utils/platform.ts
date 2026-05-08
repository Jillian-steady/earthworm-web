export function isWindows() {
  return typeof navigator !== "undefined" && navigator.userAgent.includes("Windows");
}
