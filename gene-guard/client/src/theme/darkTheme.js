import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// --- Color Palette Definition: "Modern Professional - Light" ---
const palette = {
  // Core Neutrals
  white: '#FFFFFF',
  backgroundScreen: '#F8F9FA', // Very light grey, almost white (Bootstrap-like)
  backgroundSurface: '#FFFFFF', // Pure white for cards, interactive elements

  borderSubtle: '#F1F3F5',   // Very light border
  borderDefault: '#DEE2E6',  // Standard border
  borderMedium: '#CED4DA',   // Stronger border or dividers

  textPrimary: '#212529',    // Dark, highly readable (Bootstrap's default text)
  textSecondary: '#495057',  // Medium-dark grey
  textTertiary: '#6C757D',   // Lighter grey
  textDisabled: '#ADB5BD',

  // Accent Colors - Sticking to a strong, professional black/dark grey primary
  primaryBase: '#212529',    // Using the primary text color as the main "action" color
  primaryHover: '#000000',   // Pure black for hover/active
  primaryFocusRing: 'rgba(33, 37, 41, 0.25)', // For focus rings
  primaryContrast: '#FFFFFF',

  // Secondary Accent - A very subtle grey for less prominent actions
  secondaryBase: '#6C757D',   // Using tertiary text color
  secondaryHover: '#495057',  // Darker
  secondaryContrast: '#FFFFFF',

  // Semantic Colors
  successBase: '#198754',   // Bootstrap Success Green
  successHover: '#157347',
  successContrast: '#FFFFFF',

  warningBase: '#FFC107',   // Bootstrap Warning Yellow
  warningHover: '#FFB300',
  warningContrast: '#212529', // Dark text on yellow

  errorBase: '#DC3545',     // Bootstrap Error Red
  errorHover: '#BB2D3B',
  errorContrast: '#FFFFFF',

  infoBase: '#0DCAF0',      // Bootstrap Info Cyan
  infoHover: '#0AA9CF',
  infoContrast: '#212529', // Dark text on cyan
};

// --- Theme Configuration ---
let lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.primaryBase,
      dark: palette.primaryHover, // For pressed/hover states
      contrastText: palette.primaryContrast,
    },
    secondary: {
      main: palette.secondaryBase,
      dark: palette.secondaryHover,
      contrastText: palette.secondaryContrast,
    },
    error: { main: palette.errorBase, dark: palette.errorHover, contrastText: palette.errorContrast },
    warning: { main: palette.warningBase, dark: palette.warningHover, contrastText: palette.warningContrast },
    success: { main: palette.successBase, dark: palette.successHover, contrastText: palette.successContrast },
    info: { main: palette.infoBase, dark: palette.infoHover, contrastText: palette.infoContrast },
    background: {
      default: palette.backgroundScreen,
      paper: palette.backgroundSurface,
    },
    text: {
      primary: palette.textPrimary,
      secondary: palette.textSecondary,
      disabled: palette.textDisabled,
    },
    divider: palette.borderDefault,
    action: {
      active: palette.primaryBase,
      hover: 'rgba(33, 37, 41, 0.04)', // Subtle dark hover
      hoverOpacity: 0.04,
      selected: 'rgba(33, 37, 41, 0.08)',
      selectedOpacity: 0.08,
      disabled: palette.textDisabled,
      disabledBackground: palette.borderSubtle,
      focus: palette.primaryFocusRing,
      focusOpacity: 1,
    },
  },
  shape: {
    borderRadius: 6, // Sharper corners (4-8px range is good for "boxy but slightly rounded")
  },
  typography: {
    fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,

    // Slightly larger base and more distinct hierarchy
    h1: { fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },  // ~44px
    h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em' }, // ~36px
    h3: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }, // ~30px
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' }, // ~24px
    h5: { fontSize: '1.3125rem', fontWeight: 600, lineHeight: 1.4 }, // ~21px
    h6: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5 },  // ~18px

    subtitle1: { fontSize: '1.125rem', fontWeight: 500, color: palette.textSecondary, lineHeight: 1.55 }, // ~18px
    subtitle2: { fontSize: '1rem', fontWeight: 400, color: palette.textTertiary, lineHeight: 1.5 },      // ~16px

    body1: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.7, color: palette.textSecondary }, // ~18px - INCREASED MAIN TEXT
    body2: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.65, color: palette.textTertiary },  // ~16px

    button: {
      fontSize: '1rem', // ~16px - Larger button text
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: { fontSize: '0.875rem', fontWeight: 400, color: palette.textTertiary, lineHeight: 1.5 }, // ~14px
    overline: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: palette.textSecondary }, // ~12px
  },
  spacing: 8, // Keep 8px base, but use multiples for larger gaps (e.g., theme.spacing(4) = 32px)
  shadows: [ // Clean, modern, subtle shadows
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', // Good for cards
    '0 6px 10px -2px rgba(0, 0, 0, 0.07), 0 3px 6px -3px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.06)', // Modals, popovers
  ].concat(Array(19).fill('0 12px 24px -6px rgba(0,0,0,0.08), 0 6px 10px -4px rgba(0,0,0,0.07)')),
  transitions: { // Slightly faster for a "snappy" feel
    easing: { sharp: 'cubic-bezier(0.4, 0, 0.6, 1)', easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)', easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    duration: { shortest: 120, shorter: 180, short: 230, standard: 280, complex: 350 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({ // Pass theme for palette access
        html: { scrollBehavior: 'smooth', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.borderMedium} ${theme.palette.background.default}`,
          // Removing the DNA pattern for a cleaner default, you can add it back if you like it
        },
        'body::-webkit-scrollbar': { width: '8px', height: '8px' },
        'body::-webkit-scrollbar-track': { background: theme.palette.background.default },
        'body::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.borderMedium,
          borderRadius: '4px',
          border: `2px solid ${theme.palette.background.default}`,
        },
        '::selection': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText },
        a: {
          color: theme.palette.primary.main, // Use primary color for links
          textDecoration: 'none',
          fontWeight: theme.typography.fontWeightMedium,
          transition: `color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeOut}`,
          '&:hover': {
            color: theme.palette.primary.dark,
            textDecoration: 'underline',
          },
        },
        // You can remove #bio-logo if it's not a generic theme element
      }),
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Flat with border by default
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius, // Use global sharper radius
          padding: theme.spacing(3), // Default padding for papers (24px)
          transition: theme.transitions.create(['box-shadow', 'border-color']),
        }),
      },
      variants: [ // Define common Paper variants for consistency
        {
          props: { variant: 'card' }, // Use <Paper variant="card">
          style: ({ theme }) => ({
            padding: theme.spacing(4), // Larger padding for "cards" (32px)
            boxShadow: theme.shadows[3], // Apply a card shadow
            border: 'none', // No border if shadow is present
          }),
        },
        {
          props: { variant: 'outlined-surface' }, // Use <Paper variant="outlined-surface">
          style: ({ theme }) => ({
            backgroundColor: theme.palette.background.default, // Use screen background
            // border: `1px solid ${theme.palette.divider}`, // Already default
          }),
        },
      ],
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: theme.shape.borderRadius * 0.75, // Slightly rounder than main radius
          padding: '12px 24px', // Increased padding for larger buttons
          fontWeight: theme.typography.fontWeightSemiBold,
          fontSize: theme.typography.button.fontSize, // Use theme defined button font size
          transition: theme.transitions.create(['background-color', 'border-color', 'color', 'box-shadow', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            transform: 'translateY(-2px)', // Lift effect
            boxShadow: theme.shadows[2], // Subtle shadow on hover for all buttons
          },
          // Contained
          ...(ownerState.variant === 'contained' && {
            // boxShadow: 'none', // Overriding defaultProps if needed
            ...(ownerState.color === 'primary' && {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
            }),
            ...(ownerState.color === 'secondary' && {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              '&:hover': { backgroundColor: theme.palette.secondary.dark },
            }),
          }),
          // Outlined
          ...(ownerState.variant === 'outlined' && {
            borderWidth: '1px', // Thinner border for outlined
             padding: '11px 23px', // Adjust for border
            ...(ownerState.color === 'primary' && {
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.action.focus, // Use focus ring color as subtle bg
                borderColor: theme.palette.primary.dark,
              },
            }),
            ...((!ownerState.color || ownerState.color === 'inherit') && {
              color: theme.palette.text.primary,
              borderColor: theme.palette.borderMedium,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.text.primary,
              },
            }),
          }),
          // Text
          ...(ownerState.variant === 'text' && {
             padding: '12px 16px',
            ...(ownerState.color === 'primary' && {
              color: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.action.focus },
            }),
            ...((!ownerState.color || ownerState.color === 'inherit') && {
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: theme.palette.action.hover, color: theme.palette.text.primary },
            }),
          }),
        }),
        // sizeSmall: { padding: '8px 16px', fontSize: '0.875rem' },
        // sizeLarge: { padding: '14px 28px', fontSize: '1.0625rem' },
      },
    },
    MuiCard: { // Cards use Paper styles by default, customize if needed
      defaultProps: {
        // elevation: 0, // Will use Paper's border
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius, // Ensure cards follow global radius
          // If you want cards to always have a shadow:
          // boxShadow: theme.shadows[3],
          // border: 'none', // Remove default Paper border if using shadow
        }),
      },
    },
    MuiChip: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: theme.shape.borderRadius * 2.5, // More pill-shaped
          padding: '0px 12px',
          height: '32px', // Consistent height
          fontSize: theme.typography.caption.fontSize, // Use caption for chip text
          fontWeight: theme.typography.fontWeightMedium,
          borderWidth: '1px',
          borderColor: theme.palette.borderDefault,
          color: theme.palette.text.secondary,
          backgroundColor: 'transparent',
          '& .MuiChip-icon': { fontSize: '1.125rem', marginLeft: '6px', marginRight: '-4px' },
          // Filled variant styling
          ...(ownerState.variant === 'filled' && {
            borderColor: 'transparent',
            backgroundColor: theme.palette.action.disabledBackground, // Neutral fill
            ...(ownerState.color === 'primary' && {
              backgroundColor: theme.palette.action.selected, // Light primary fill
              color: theme.palette.primary.dark,
            }),
            // ... other filled colors
          }),
          // Outlined variant styling (already default but explicit)
          ...(ownerState.variant === 'outlined' && ownerState.color === 'primary' && {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
          }),
        }),
      },
    },
    MuiTextField: { // Using OutlinedInput styles primarily
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius, // Global radius
          backgroundColor: theme.palette.background.paper, // Surface color for inputs
          transition: theme.transitions.create(['border-color', 'box-shadow']),
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.borderDefault,
            transition: theme.transitions.create(['border-color']),
          },
          '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.borderMedium,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px', // Can be 2px for more pop
            boxShadow: `0 0 0 3px ${theme.palette.action.focus}`, // Focus ring
          },
          '&.Mui-disabled': {
            backgroundColor: palette.borderSubtle,
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.borderSubtle,
          },
        }),
        input: ({theme}) => ({
            padding: '14px 16px', // Generous padding for larger text fields
            fontSize: theme.typography.body1.fontSize, // Use body1 for input text size
            height: '1.5em', // Ensure consistent input height based on font
            '&::placeholder': {
                color: palette.textTertiary,
                opacity: 1,
            }
        })
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({theme}) => ({
          fontSize: theme.typography.body1.fontSize, // Label matches input text size
          color: theme.palette.text.secondary,
          fontWeight: theme.typography.fontWeightRegular,
          '&.Mui-focused': {
            // color: theme.palette.primary.main, // Default MUI behavior, often good
          },
        }),
        outlined: { // Adjust position for outlined variant
            transform: 'translate(14px, 14px) scale(1)', // Matches input padding
            '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -9px) scale(0.75)', // Standard shrink
            }
        }
      }
    },
    MuiListItem: { /* ... (keep or refine as needed) ... */ },
    MuiListItemButton: { /* ... (keep or refine as needed) ... */ },
    MuiDivider: {
      styleOverrides: {
        root: ({theme}) => ({
          borderColor: theme.palette.divider, // Use borderColor for Mui v5+
          marginTop: theme.spacing(3),
          marginBottom: theme.spacing(3),
        }),
      },
    },
    MuiTooltip: { /* ... (keep or refine from previous good version) ... */ },
  },
});

lightTheme = responsiveFontSizes(lightTheme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  factor: 2, // Standard scaling
});

export default lightTheme;