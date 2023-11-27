import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: "index.html" }),
  }
};

config.paths = { base: process.argv.includes("dev") ? "" : "runbacks" };

export default config;
