import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Verdana, sans-serif',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
  },
  components: {
    Button: {
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.md,
        },
      }),
    },
  },
});
