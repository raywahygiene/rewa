import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://raywahygiene.github.io",
  base: "/rewa",
  integrations: [tailwind()],
});
