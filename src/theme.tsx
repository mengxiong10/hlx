import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import { deepOrange } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    study: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    study?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    study: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}

  interface Palette {
    primaryDark: PaletteColor;
  }
}

const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
      whiteSpace: 'nowrap'
    },
  },
  palette: {
    primary: {
      ...deepOrange,
      // light: will be calculated from palette.primary.main,
      main: '#ff630f',
      dark: '#ff870f',
      contrastText: '#fff',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    // background: {
    //   default: '#006a60',
    // },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          study: 'div',
        },
      },
    },
  },
});

theme.typography.study = {
  fontSize: '1rem',
  whiteSpace: 'pre-wrap',
  userSelect: 'none',
  // [theme.breakpoints.up('sm')]: {
  //   fontSize: '1.5rem',
  // },
  // [theme.breakpoints.up('lg')]: {
  //   fontSize: '1.5rem',
  // },
};

export function Theme({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
