import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ params, parent }) => {
  const { runbacks } = await parent();
  const runback = runbacks.find((runback) => runback.episode === Number(params.episode));
  if (!runback) throw error(404, "Runback not found");
  return { runback };
}) satisfies PageLoad;
