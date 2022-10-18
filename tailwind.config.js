/** @type {import('tailwindcss').Config} */

const convertToPx = (n) => `${n}px`;
const createSpacing = (spacingsConfig) => {
  const userSpacings = {};
  spacingsConfig.forEach((spacing) => {
    userSpacings[spacing] = convertToPx(spacing);
  });
  return userSpacings;
};

// 設定するSpacingを書き足していく
const spacingsConfig = [
  1,
  2,
  4,
  8,
  12,
  16,
  20,
  24,
  28,
  32,
  36,
  40,
  44,
  48,
  52,
  56,
  60,
  64,
  68,
  72,
  76,
  80,
  84,
  88,
  92,
  96,
  100,
  120,
];
const customSpacing = createSpacing(spacingsConfig);

module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    spacing: {
      ...customSpacing,
      '0': '0',
    },
    extend: {},
  },
  plugins: [],
}
