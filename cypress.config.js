import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import codeCoverageTask from "@cypress/code-coverage/task.js";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      on("file:preprocessor", vitePreprocessor());
      return config;
    },
  },
});
