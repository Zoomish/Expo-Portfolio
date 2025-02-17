const tintColorLight = '#3B82F6';
const tintColorDark = '#60A5FA';

const languageColors = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#B07219',
  Ruby: '#CC342D',
  Go: '#00ADD8',
  Rust: '#DEA584',
  CSS: '#563D7C',
  HTML: '#E34F26',
  Shell: '#89E051',
  Vue: '#41B883',
  React: '#61DAFB',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
};

export default {
  light: {
    text: '#1F2937',
    background: '#F8F7FF',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#6366F1',
    codeBackground: '#1F2937',
    gradient: ['#3B82F6', '#6366F1', '#2563EB'],
    languageColors,
  },
  dark: {
    text: '#F3F4F6',
    background: '#0F172A',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#818CF8',
    codeBackground: '#1E293B',
    gradient: ['#3B82F6', '#6366F1', '#2563EB'],
    languageColors,
  },
};