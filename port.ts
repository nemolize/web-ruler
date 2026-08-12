const DEFAULT_PORT = 3000;

export const readPort = (
  raw: string | undefined,
  envVarName: string,
): number => {
  if (raw === undefined || raw === "") {
    return DEFAULT_PORT;
  }

  const parsed = /^\d+$/.test(raw) ? Number(raw) : Number.NaN;
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(
      `${envVarName} must be an integer from 1 to 65535, got ${JSON.stringify(raw)}`,
    );
  }

  return parsed;
};

// `package.json`'s `dev` script carries the only other copy of this default,
// because an npm script cannot import from here — move the two together.
export const localServerPort = readPort(
  process.env["PLAYWRIGHT_PORT"],
  "PLAYWRIGHT_PORT",
);
export const localServerURL = `http://localhost:${String(localServerPort)}`;
