import { useMemo } from "react";
import { createHttpFetcher, createAnthropicBrowserFetcher } from "ai-quiz";
import { auth } from "../../lib/firebase";

/**
 * Supplies the transport `ai-quiz` uses to generate questions.
 *
 * Two modes, chosen by whether the Cloud Function endpoint is configured:
 *
 *   PRODUCTION — REACT_APP_QUIZ_ENDPOINT set
 *     Requests go to our own Firebase Function, which holds the Anthropic key
 *     in Secret Manager. The key never reaches the browser, and students never
 *     need one of their own. This is the only mode that works for student
 *     accounts.
 *
 *   INTERIM — no endpoint configured
 *     Falls back to calling Anthropic directly with a key the user pastes in,
 *     kept in sessionStorage. Usable for admin-side testing before the
 *     function is deployed. NOT suitable for students: it asks each person for
 *     their own API key, and the key is readable by any script on the page.
 *
 * The `init` callback matters. Firebase ID tokens expire after an hour, so a
 * header captured once at creation goes stale mid-session and every later
 * request 401s. Resolving it per call mints a fresh one.
 */
const ENDPOINT = process.env.REACT_APP_QUIZ_ENDPOINT;

export function useQuizFetcher() {
  return useMemo(() => {
    if (!ENDPOINT) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[quiz] REACT_APP_QUIZ_ENDPOINT is not set — falling back to a " +
            "browser-side key. Deploy the generateQuiz function before " +
            "exposing quizzes to students."
        );
      }
      return createAnthropicBrowserFetcher();
    }

    return createHttpFetcher(ENDPOINT, async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in to generate a quiz.");
      return {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      };
    });
  }, []);
}

/** True when quizzes are served by our own backend rather than a pasted key. */
export const usesQuizProxy = Boolean(ENDPOINT);
