/** @type {import('tailwindcss').Config} */
// Every token below was read from the Figma file (OAukLJFpgJhJfkSBkAYVzy) via
// get_variable_defs / get_design_context / a read-only node scan. Do not guess new ones.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#306FDC',
        'primary-tint': '#E8F1FF',
        page: '#F4F8FF',
        ink: '#333333',
        'ink-strong': '#1A1A1A',
        'ink-title': '#202020',
        'ink-body': '#4E4E4E',
        'ink-tab': '#5C5D5F',
        navy: '#1B3252', // Instiapp Dark/dark Secondary
        muted: '#707070',
        'muted-2': '#87919D',
        'muted-3': '#898989',
        placeholder: '#CECECE',
        silver: '#C4C4C4',
        'form-grey': '#DADEE3',
        success: '#4CAF50',
        'success-bg': '#E9FFEA',
        danger: '#F44336',
        'danger-bg': '#FFE4E2',
        warning: '#FFC107',
        'warning-bg': '#FBF4DD',
        badge: '#FF373A',
        footer: '#333333',
        'footer-text': '#CECECE',
        'footer-link': '#E5E5E5',
        'footer-rule': '#595959',
        'tip-title': '#EBEBEB',
        'tip-body': '#D8D8D8',
        'tip-placeholder': '#A3A3A3',
        'login-link': '#438DFF',
      },
      fontFamily: {
        hn: ['"Helvetica Neue Web"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        nm: ['"Neue Montreal Web"', '"Neue Montreal"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        dm: ['"DM Sans"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // Figma "Drop shadow" style and its variants
        hero: '0px 12px 50px 0px rgba(192,217,255,0.6)',
        poster: '0px 12px 50px 0px rgba(192,217,255,0.5)',
        club: '0px 12px 50px 0px rgba(192,217,255,0.25)',
        nav: '0px 12px 50px 0px rgba(156,171,195,0.3)',
        heroimg: '0px 4px 50px 0px rgba(0,0,0,0.05)',
        filter: '0px 12px 50px 0px rgba(51,51,51,0.1)',
        tile: '0px 4px 10px 0px rgba(0,0,0,0.08)',
        login: '0px 12px 50px 0px #BAD5FF',
      },
      dropShadow: {
        card: '0px 12px 22.5px rgba(192,217,255,0.6)',
      },
    },
  },
  plugins: [],
}
