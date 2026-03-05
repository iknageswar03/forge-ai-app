//legible-reindeer-7.clerk.accounts.dev

import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://legible-reindeer-7.clerk.accounts.dev"!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;