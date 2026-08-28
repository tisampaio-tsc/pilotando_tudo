import { clearSessionCookie, jsonResponse } from "../../_shared/auth";

export const onRequestPost: PagesFunction = async () => {
  return jsonResponse({ ok: true }, 200, {
    "Set-Cookie": clearSessionCookie(),
  });
};
