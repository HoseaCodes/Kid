const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    purgecss({
      content: [
        "./src/**/*.js",
        "./src/**/*.jsx",
        "./public/index.html",
        // ai-quiz ships a prebuilt stylesheet, but its class names live in the
        // package's own JS — outside ./src. Without this glob PurgeCSS treats
        // every rule in ai-quiz/dist/styles.css as unused and strips it, and
        // the quiz renders unstyled.
        "./node_modules/ai-quiz/dist/*.{js,mjs}",
      ],
    }),
  ],
};
