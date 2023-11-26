import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ parent }) => {
  const { isLive } = await parent();
  if (!isLive) throw redirect(302, "/");
}) satisfies PageLoad;
