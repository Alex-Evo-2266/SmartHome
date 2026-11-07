const PATH_SOURCES = [
  "device",
  "room",
  "variable",
  "system",
] as const;

export type PathSource = (typeof PATH_SOURCES)[number];

export function getPathSource(path: string): PathSource {
  const source = path.split(".").filter(Boolean)[0];

  if (
    PATH_SOURCES.includes(source as PathSource)
  ) {
    return source as PathSource;
  }

  return "device";
}