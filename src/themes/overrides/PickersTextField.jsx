// project imports
import getColors from 'utils/getColors';
import getShadow from 'utils/getShadow';

// ==============================|| OVERRIDES - INPUT BORDER & SHADOWS ||============================== //

function getColor({ variant, theme }) {
  const colors = getColors(theme, variant);
  const { light } = colors;

  const shadows = getShadow(theme, `${variant}`);

  return {
    '&:hover .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: light
    },
    '&.Mui-focused': {
      boxShadow: shadows,
      '& .MuiPickersOutlinedInput-notchedOutline': {
        border: '1px solid',
        borderColor: light
      }
    }
  };
}

// ==============================|| OVERRIDES - PICKERS TEXT FIELD ||============================== //

export default function PickersTextField(theme) {
  return {
    MuiPickersTextField: {
      defaultProps: {
        variant: 'outlined',
        color: 'primary'
      },
      styleOverrides: {
        root: {
          '& .MuiPickersInputBase-sectionsContainer': {
            padding: '14px 14px 14px 0px'
          },
          '& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: theme.palette.secondary[400],
            ...theme.applyStyles('dark', { borderColor: theme.palette.secondary[200] })
          },
          variants: [
            {
              props: { variant: 'outlined' },
              style: ({ color }) => {
                return {
                  '& .MuiPickersInputBase-root': {
                    ...getColor({ variant: color, theme })
                  }
                };
              }
            },
            {
              props: { size: 'small' },
              style: {
                '& .MuiPickersInputBase-sectionsContainer': {
                  padding: '10px 10px 10px 0px'
                }
              }
            }
          ]
        }
      }
    }
  };
}
