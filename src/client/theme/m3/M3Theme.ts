import { alpha, darken, lighten, Theme } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";

interface M3Tone {
  0: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  95: string;
  99: string;
  100: string;
}
export interface M3ThemeTones {
  primary: M3Tone;
  secondary: M3Tone;
  tertiary: M3Tone;
  neutral: M3Tone;
  neutralVariant: M3Tone;
  error: M3Tone;
}

export interface M3ThemeFonts {
  heading: string;
  body: string;
}

export interface M3ColorTokens {
  primary: string;
  onPrimary: string;

  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;

  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;

  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;

  errorContainer: string;
  onErrorContainer: string;

  background: string;
  onBackground: string;

  surface: string;
  onSurface: string;

  surfaceVariant: string;
  onSurfaceVariant: string;

  inverseSurface: string;
  inverseOnSurface: string;

  inversePrimary: string;
  surfaceTint?: string;

  outline: string;
  shadow: string;
}

export type M3ThemeMode = "dark" | "light";

export interface M3ThemeScheme {
  light: M3ColorTokens;
  dark: M3ColorTokens;
  tones?: M3ThemeTones;
}

export const DEFAULT_M3_THEME_SCHEME: M3ThemeScheme = {
  light: {
    primary: "#6750A4",
    onPrimary: "#FFFFFF",

    primaryContainer: "#EADDFF",
    onPrimaryContainer: "#21005E",

    secondary: "#9c27b0",
    onSecondary: "#FFFFFF",

    secondaryContainer: "#E8DEF8",
    onSecondaryContainer: "#1E192B",

    tertiary: "#7D5260",
    onTertiary: "#FFFFFF",

    tertiaryContainer: "#FFD8E4",
    onTertiaryContainer: "#370B1E",

    error: "#B3261E",
    onError: "#ffffff",

    errorContainer: "#F9DEDC",
    onErrorContainer: "#370B1E",

    background: "#FFFBFE",
    onBackground: "#1C1B1F",

    surface: "#FFFBFE",
    onSurface: "#1C1B1F",

    surfaceVariant: "#E7E0EC",
    onSurfaceVariant: "#49454E",

    inverseSurface: "#313033",
    inverseOnSurface: "#F4EFF4",

    inversePrimary: "#D0BCFF",

    outline: "#79747E",
    shadow: "#000000",
  },
  dark: {
    primary: "#D0BCFF",
    onPrimary: "#371E73",

    primaryContainer: "#4F378B",
    onPrimaryContainer: "#EADDFF",

    secondary: "#CCC2DC",
    onSecondary: "#332D41",

    secondaryContainer: "#4A4458",
    onSecondaryContainer: "#E8DEF8",

    tertiary: "#EFB8C8",
    onTertiary: "#492532",

    tertiaryContainer: "#633B48",
    onTertiaryContainer: "#FFD8E4",

    error: "#F2B8B5",
    onError: "#601410",

    errorContainer: "#8C1D18",
    onErrorContainer: "#F9DEDC",

    background: "#1C1B1F",
    onBackground: "#E6E1E5",

    surface: "#1C1B1F",
    onSurface: "#E6E1E5",

    surfaceVariant: "#49454F",
    onSurfaceVariant: "#CAC4D0",

    inverseSurface: "#E6E1E5",
    inverseOnSurface: "#313033",

    inversePrimary: "#6750A4",

    outline: "#938F99",
    shadow: "#000000",
  },
};

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    // primary: string,
    onPrimary: PaletteColor;

    primaryContainer: PaletteColor;
    onPrimaryContainer: PaletteColor;

    // secondary: string,
    onSecondary: PaletteColor;

    secondaryContainer: PaletteColor;
    onSecondaryContainer: PaletteColor;

    tertiary: PaletteColor;
    onTertiary: PaletteColor;

    tertiaryContainer: PaletteColor;
    onTertiaryContainer: PaletteColor;

    // error: string,
    onError: PaletteColor;

    errorContainer: PaletteColor;
    onErrorContainer: PaletteColor;

    background2: PaletteColor;
    onBackground: PaletteColor;

    surface: PaletteColor;
    onSurface: PaletteColor;

    surfaceVariant: PaletteColor;
    onSurfaceVariant: PaletteColor;

    inverseSurface: PaletteColor;
    inverseOnSurface: PaletteColor;
    inversePrimary: PaletteColor;

    surfaceTint: string;

    outline: string;
    shadow: string;
  }
}
declare module "@mui/material/styles/createTheme" {
  interface ThemeOptions {
    tones?: M3ThemeTones;
  }
  interface Theme {
    tones?: M3ThemeTones;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    elevated: true;
    filled: true;
    tonal: true;
  }
  interface ButtonPropsColorOverrides {
    tertiary: true;
    surface: true;
  }
}

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    elevated: true;
    filled: true;
    tonal: true;
  }
  interface ButtonGroupColorOverrides {
    tertiary: true;
    surface: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    filled: true;
  }
}

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    primary: true;
    secondary: true;
    tertiary: true;
    surface: true;
  }
  interface FabPropsColorOverrides {
    tertiary: true;
    surface: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    outlined: true;
    elevated: true;
    tonal: true;
  }
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}

export const getDesignTokens = (
  mode: M3ThemeMode,
  scheme: M3ColorTokens,
  tones?: M3ThemeTones,
  typography?: M3ThemeFonts
) => {
  return {
    typography: {
      fontFamily: typography?.body,
      body1: { fontFamily: typography?.body },
      body2: { fontFamily: typography?.body },
      h1: { fontFamily: typography?.heading },
      h2: { fontFamily: typography?.heading },
      h3: { fontFamily: typography?.heading },
      h4: { fontFamily: typography?.heading },
      h5: { fontFamily: typography?.heading },
    },
    palette: {
      mode,
      primary: {
        main: scheme.primary,
        contrastText: scheme.onPrimary,
      },
      onPrimary: {
        main: scheme.onPrimary,
        contrastText: scheme.primary,
      },
      primaryContainer: {
        main: scheme.primaryContainer,
        contrastText: scheme.onPrimaryContainer,
      },
      onPrimaryContainer: {
        main: scheme.onPrimaryContainer,
        contrastText: scheme.primaryContainer,
      },
      secondary: {
        main: scheme.secondary,
        contrastText: scheme.onSecondary,
      },
      onSecondary: {
        main: scheme.onSecondary,
        contrastText: scheme.secondary,
      },
      secondaryContainer: {
        main: scheme.secondaryContainer,
        contrastText: scheme.onSecondaryContainer,
      },
      onSecondaryContainer: {
        main: scheme.onSecondaryContainer,
        contrastText: scheme.secondaryContainer,
      },
      tertiary: {
        main: scheme.tertiary,
        contrastText: scheme.onTertiary,
      },
      onTertiary: {
        main: scheme.onTertiary,
        contrastText: scheme.tertiary,
      },
      tertiaryContainer: {
        main: scheme.tertiaryContainer,
        contrastText: scheme.onTertiaryContainer,
      },
      onTertiaryContainer: {
        main: scheme.onTertiaryContainer,
        contrastText: scheme.tertiary,
      },
      error: {
        main: scheme.error,
        contrastText: scheme.onError,
      },
      onError: {
        main: scheme.onError,
        contrastText: scheme.error,
      },
      errorContainer: {
        main: scheme.errorContainer,
        contrastText: scheme.onErrorContainer,
      },
      onErrorContainer: {
        main: scheme.onErrorContainer,
        contrastText: scheme.errorContainer,
      },
      background2: {
        main: scheme.background,
        contrastText: scheme.onBackground,
      },
      onBackground: {
        main: scheme.onBackground,
        contrastText: scheme.background,
      },
      surface: {
        main: scheme.surface,
        contrastText: scheme.onSurface,
      },
      onSurface: {
        main: scheme.onSurface,
        contrastText: scheme.surface,
      },
      surfaceVariant: {
        main: scheme.surfaceVariant,
        contrastText: scheme.onSurfaceVariant,
      },
      onSurfaceVariant: {
        main: scheme.onSurfaceVariant,
        contrastText: scheme.surfaceVariant,
      },
      inverseSurface: {
        main:
          scheme.inverseSurface ||
          (mode === "light" ? tones?.neutral[20] : tones?.neutral[90]),
        contrastText:
          scheme.inverseOnSurface ||
          (mode === "light" ? tones?.neutral[95] : tones?.neutral[20]),
      },
      inverseOnSurface: {
        main:
          scheme.inverseOnSurface ||
          (mode === "light" ? tones?.neutral[95] : tones?.neutral[20]),
        contrastText:
          scheme.inverseSurface ||
          (mode === "light" ? tones?.neutral[20] : tones?.neutral[90]),
      },
      inversePrimary: {
        main:
          scheme.inversePrimary ||
          (mode === "light" ? tones?.neutral[80] : tones?.neutral[40]),
        contrastText: scheme.primary,
      },

      surfaceTint: scheme.primary,
      outline: scheme.outline,
      shadow: scheme.shadow,

      background: {
        default: scheme.background,
        paper: scheme.surface,
      },
      common: {
        white: scheme.background,
        black: scheme.onBackground,
      },
      text: {
        primary: scheme.onSurface,
        secondary: scheme.onSecondaryContainer,
      },
      divider: scheme.outline,
    },
    tones,
  } as ThemeOptions;
};

export const getThemedComponents = (
  theme: Theme
): { components: Theme["components"] } => {
  return {
    components: {
      MuiCssBaseline: {
        defaultProps: {
          enableColorScheme: true,
        },
      },
      MuiSkeleton: {
        defaultProps: {
          animation: "wave",
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.outline,
            backgroundColor: theme.palette.outline,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            margin: "0 16px",
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up("md")]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: theme.palette.surface.main,
            color: theme.palette.onSurface.main,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            boxShadow: "none",
          },
          colorDefault: {
            background: theme.palette.surface.main,
            color: theme.palette.onSurface.main,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
          },
          colorPrimary: {
            background:
              theme.palette.mode === "light"
                ? lighten(theme.palette.primary.main, 0.85)
                : darken(theme.palette.primary.main, 0.8),
            color: theme.palette.surface.contrastText,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: "40px",
            textTransform: "none",
            borderColor: theme.palette.outline,
            color: theme.palette.onSurface.main,
            paddingX: "12px",
            "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
              marginLeft: 0,
              borderLeft: 0,
            },
            "&::before": {
              content: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.onSecondaryContainer.main
              )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
              width: "0px",
              marginRight: "0px",
              transform: "scale(0) translate(-12px, 3px)",
              transition: theme.transitions.create([
                "width",
                "transform",
                "margin-right",
              ]),
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondaryContainer.main,
              color: theme.palette.secondaryContainer.contrastText,
              "&::before": {
                width: "24px",
                marginRight: "12px",
                transform: "scale(1) translate(0px, 3px)",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "50px",
            textTransform: "none",
          },
          outlined: {
            borderColor: theme.palette.outline,
            // background: theme.palette.surface.main,
          },
        },
        variants: [
          {
            props: { variant: "elevated" },
            style: {
              boxShadow: theme.shadows[1],
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.15),
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.primary.main, 0.12),
                color: alpha(theme.palette.primary.main, 0.38),
              },
            },
          },
          {
            props: { variant: "filled" },
            style: {
              background: theme.palette.primary.main,
              color: theme.palette.onPrimary.main,
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.primary.main, 0.85),
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.primary.main, 0.12),
                color: alpha(theme.palette.primary.main, 0.38),
              },
            },
          },
          {
            props: { variant: "tonal" },
            style: {
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.secondaryContainer.main, 0.8),
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.secondaryContainer.main, 0.12),
                color: alpha(theme.palette.secondaryContainer.main, 0.38),
              },
            },
          },
        ],
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: "18px",
            textTransform: "unset",
            fontWeight: "unset",
            height: "58px",
          },
        },
        variants: [
          {
            props: { variant: "primary" },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.primaryContainer.main,
              color: theme.palette.onPrimaryContainer.main,
              "&:hover": {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.primaryContainer.main, 0.08)
                    : darken(theme.palette.primaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: "extended", color: "primary" },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.primaryContainer.main,
              color: theme.palette.onPrimaryContainer.main,
              fontWeight: "bold",
              "&:hover": {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.primaryContainer.main, 0.08)
                    : darken(theme.palette.primaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: "secondary" },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              "&:hover": {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.secondaryContainer.main, 0.08)
                    : darken(theme.palette.secondaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: "extended", color: "secondary" },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              fontWeight: "bold",
              "&:hover": {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.secondaryContainer.main, 0.08)
                    : darken(theme.palette.secondaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: "tertiary" },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.tertiaryContainer.main,
              color: theme.palette.onTertiaryContainer.main,
              "&:hover": {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.tertiaryContainer.main, 0.08)
                    : darken(theme.palette.tertiaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: "extended", color: "tertiary" },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.tertiaryContainer.main,
              color: theme.palette.onTertiaryContainer.main,
              fontWeight: "bold",
              "&:hover": {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.tertiaryContainer.main, 0.08)
                    : darken(theme.palette.tertiaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: "surface" },
            style: {
              boxShadow: theme.shadows[3],
              // background: theme.palette.surface.main,
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              "&:hover": {
                boxShadow: theme.shadows[4],
                background: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
          {
            props: { variant: "extended", color: "surface" },
            style: {
              boxShadow: theme.shadows[3],
              // background: theme.palette.surface.main,
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              fontWeight: "bold",
              "&:hover": {
                boxShadow: theme.shadows[4],
                background: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
        ],
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            // padding: "10px 8px",
          },
        },
        variants: [
          {
            props: { variant: "elevation" },
            style: {
              boxShadow: theme.shadows[1],
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              /* transition: theme.transitions.create(
                ["background-color", "box-shadow", "border-color", "color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.primary.main, 0.08),
              }, */
            },
          },
          {
            props: { variant: "filled" },
            style: {
              backgroundColor: theme.palette.surfaceVariant.main,
              /* transition: theme.transitions.create(
                ["background-color", "box-shadow", "border-color", "color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.surfaceVariant.main, 0.8),
              }, */
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              backgroundColor: theme.palette.surface.main,
              borderColor: theme.palette.outline,
              /* transition: theme.transitions.create(
                ["background-color", "box-shadow", "border-color", "color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.onSurface.main, 0.05),
              }, */
            },
          },
        ],
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background:
              theme.palette.mode === "dark"
                ? darken(theme.palette.primary.main, 0.8)
                : lighten(theme.palette.primary.main, 0.9),
            color: theme.palette.onSurface.main,
          },
          outlined: {
            borderColor: theme.palette.outline,
            background: theme.palette.surface.main,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          root: {
            "& .MuiListItemButton-root": {
              borderRadius: 50,
            },
          },
          paperAnchorLeft: {
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          },
          paperAnchorRight: {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
          paperAnchorTop: {
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
          },
          paperAnchorBottom: {
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          },
          paper: {
            border: "0px",
            background:
              theme.palette.mode === "light"
                ? lighten(theme.palette.primary.main, 0.85)
                : darken(theme.palette.primary.main, 0.8),
            color: theme.palette.surface.contrastText,
          },
          docked: {
            "& .MuiPaper-root": {
              background: theme.palette.surface.main,
              color: theme.palette.onSurface.main,
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: 1,
            paddingBottom: 1,
            "& .MuiListItemButton-root": {
              paddingTop: 8,
              paddingBottom: 8,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            // border radius moved to MuiDrawer since it doesn't apply to all
            // selectable lists. Used to be 50
            "&.Mui-selected": {
              color: theme.palette.onSecondaryContainer.main,
              background: theme.palette.secondaryContainer.main,
              "& > .MuiListItemText-root > .MuiListItemText-primary": {
                fontWeight: "bold",
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: "inherit",
            minWidth: 32,
            "&.Mui-selected": {
              fontWeight: "bold",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: theme.palette.secondaryContainer.main,
            color: theme.palette.secondaryContainer.contrastText,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            "&:before": {
              display: "none",
            },
            "&.Mui-disabled": {
              backgroundColor: theme.palette.inverseOnSurface.main,
              color: theme.palette.inverseSurface.main,
            },
            borderRadius: "32px !important",
            marginBottom: 8,
            transition: theme.transitions.create([
              "border-radius",
              "margin",
              "background-color",
            ]),
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            "&.Mui-expanded": {
              borderRadius: "16px !important",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            borderRadius: 32,
            transition: theme.transitions.create([
              "border-radius",
              "background-color",
            ]),
            "&.Mui-expanded": {
              borderRadius: 16,
            },
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.inverseSurface.main,
          },
          message: {
            color: theme.palette.inverseOnSurface.main,
          },
          action: {
            color: theme.palette.inversePrimary.main,
          },
        },
      },
      MuiChip: {
        variants: [
          {
            props: { variant: "elevated" },
            style: {
              boxShadow: theme.shadows[1],
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              border: `1px solid ${theme.palette.outline}`,
            },
          },
          {
            props: { variant: "tonal" },
            style: {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          },
          {
            props: { color: "tertiary" },
            style: {
              backgroundColor: alpha(theme.palette.tertiary.main, 0.08),
            },
          },
        ],
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
          icon: {
            marginLeft: "8px",
            height: "18px",
            width: "18px",
            color: theme.palette.primary.main,
          },
          label: {
            paddingLeft: "16px",
            paddingRight: "16px",
          },
          filled: {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: "80px",
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            paddingTop: "38px", // 12 + 52/2
            paddingBottom: "42px", // 16 + 52/2
            marginLeft: "8px",
            marginRight: "8px",
            overflow: "hidden",
            "& .MuiSvgIcon-root": {
              height: "32px",
              width: "64px",
              borderRadius: "16px",
              marginBottom: "4px",
              color: theme.palette.onSurfaceVariant.main,
              padding: "4px",
              transition: theme.transitions.create([
                "transform",
                "background-color",
              ]),
              boxShadow: `0px 0px 0px 1000px ${theme.palette.background.default}`,
              zIndex: 9,
            },
            "&.Mui-selected": {
              "& .MuiSvgIcon-root": {
                backgroundColor: theme.palette.secondaryContainer.main,
                color: theme.palette.onSecondaryContainer.main,
              },
            },
            "&:hover": {
              "& .MuiSvgIcon-root": {
                backgroundColor: alpha(
                  theme.palette.onSurfaceVariant.main,
                  0.08
                ),
              },
              "&.Mui-selected": {
                "& .MuiSvgIcon-root": {
                  backgroundColor: alpha(theme.palette.onSurface.main, 0.08),
                },
              },
            },
          },
          label: {
            lineHeight: "12px",
            letterSpacing: "0.5px",
            fontSize: "12px",
            fontWeight: "500",
            color: theme.palette.onSurfaceVariant.main,
            zIndex: 9,
            "&.Mui-selected": {
              color: theme.palette.onSurface.main,
              fontSize: "12px",
            },
          },
          iconOnly: {
            "& .MuiSvgIcon-root": {
              transform: "translateY(8px)",
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
            marginLeft: 12,
            marginRight: 8,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: 7,
              transitionDuration: "100ms",
              "& .MuiSwitch-input": {
                height: 42,
                width: 60,
                marginLeft: -8,
                marginTop: -12,
              },
              "&.Mui-checked": {
                transform: "translateX(16px)",
                margin: 4,
                "& + .MuiSwitch-track": {
                  backgroundColor: theme.palette.primary.main,
                  opacity: 1,
                  border: 0,
                },
                "& .MuiSwitch-thumb": {
                  color: theme.palette.onPrimary.main,
                  width: 18,
                  height: 18,
                },
                "& .MuiSwitch-thumb:before": {
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.primary.main
                  )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                },
                "&.Mui-disabled .MuiSwitch-thumb:before": {
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    alpha(theme.palette.onSurfaceVariant.main, 0.28)
                  )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                  backgroundColor: alpha(theme.palette.onSurface.main, 0.1),
                },
                "&.Mui-disabled .MuiSwitch-thumb": {
                  color: alpha(theme.palette.surface.main, 0.8),
                },
              },
              "&.Mui-focusVisible .MuiSwitch-thumb": {
                color: theme.palette.primary.main,
                border: `6px solid ${theme.palette.primary.contrastText}`,
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: alpha(theme.palette.onSurface.main, 0.3),
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              color: theme.palette.outline,
              width: 12,
              height: 12,
              "&:before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              },
            },
            "& .MuiSwitch-track": {
              borderRadius: 26 / 2,
              border: `1px solid ${theme.palette.outline}`,
              backgroundColor: theme.palette.surfaceVariant.main,
              opacity: 1,
              transition: theme.transitions.create(["background-color"], {
                duration: 500,
              }),
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "24px",
            paddingTop: "8px",
            paddingBottom: "16px",
          },
        },
      },
      MuiTouchRipple: {
        styleOverrides: {
          rippleVisible: {
            animationDuration: "120ms",
          },
        },
      },
    },
  };
};
