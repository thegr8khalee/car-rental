import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  theme: {
    extend: {
      fontFamily: {
        hero: ['Microgramma D Extended', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
