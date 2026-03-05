export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;
export const APP_NAME =
  (process.env.NEXT_PUBLIC_APP_NAME as string) || "Undangon";
export const APP_DESCRIPTION = process.env
  .NEXT_PUBLIC_APP_DESCRIPTION as string;

export const ROLE_OPTIONS = [
  { label: "SysAdmin", value: "system-admin" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Designer", value: "designer" },
];

export default { SERVER_URL, APP_NAME, ROLE_OPTIONS };
