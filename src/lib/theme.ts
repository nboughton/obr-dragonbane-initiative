import OBR, { type Theme } from '@owlbear-rodeo/sdk';
import { ref } from 'vue';
import { setCssVar } from './util';

export const colours = ref<Theme>({
  mode: 'DARK',
  primary: {
    main: '#bb99ff',
    light: 'rgb(200, 173, 255)',
    dark: 'rgb(130, 107, 178)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#ee99ff',
    light: 'rgb(241, 173, 255)',
    dark: 'rgb(166, 107, 178)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    paper: '#222639',
    default: '#1e2231',
  },
  text: {
    disabled: 'rgba(255, 255, 255, 0.5)',
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
});

export const setupTheme = async () => {
  const setTheme = (theme: Theme) => {
    setCssVar('--primary', theme.primary.main);
    setCssVar('--primary-dark', theme.primary.dark);
    setCssVar('--primary-light', theme.primary.light);
    setCssVar('--primary-contrast', theme.primary.contrastText);

    setCssVar('--secondary', theme.secondary.main);
    setCssVar('--secondary-dark', theme.secondary.dark);
    setCssVar('--secondary-light', theme.secondary.dark);

    setCssVar('--background', theme.background.default);
    setCssVar('--background-paper', theme.background.paper);

    setCssVar('--text', theme.text.primary);
    setCssVar('--text-disabled', theme.text.disabled);

    colours.value = theme;
  };

  setTheme(await OBR.theme.getTheme());

  OBR.theme.onChange(setTheme);
};
