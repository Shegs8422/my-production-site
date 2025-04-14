// postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Use the dedicated PostCSS plugin
    autoprefixer: {},
    // NOTE: 'tailwindcss': {} might not be needed here when using @tailwindcss/postcss explicitly,
    // but including it sometimes helps other tools. Try with and without if needed.
  },
};

export default config;
