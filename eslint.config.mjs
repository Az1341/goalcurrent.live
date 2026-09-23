import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // jsx-a11y is registered by eslint-config-next/core-web-vitals.
    // Re-registering the plugin causes flat-config "Cannot redefine plugin".
    // Applying jsx-a11y/* rules from an object without the plugin caused the
    // Sprint 001 crash ("could not find plugin jsx-a11y"). Accessibility rules
    // therefore remain those provided by next/core-web-vitals — not disabled.
    plugins: {
      security,
    },
    rules: {
      ...security.configs.recommended.rules,
      "security/detect-object-injection": "off",
      // GC-CLEANUP-20260806: the cn helper was removed on purpose (see
      // .gitignore history). Ban re-introducing it via imports instead of
      // the old gitignore file-level ban, which only hid the problem.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/cn",
              message: "Use the project's existing class helpers instead of recreating src/lib/cn.ts.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-application artefacts (audit evidence, one-off local scripts)
    "reports/**",
    "scripts/_*.py",
    "scripts/_fix_closure.py",
    "GC-SOT-*.md",
  ]),
]);

export default eslintConfig;