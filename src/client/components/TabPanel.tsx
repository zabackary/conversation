import { Box, Typography } from "@mui/material";

interface TabPanelProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  index: number;
  current: number;
  a11yId: string;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, current, index, a11yId, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={current !== index}
      id={`${a11yId}-panel`}
      aria-labelledby={`${a11yId}-tab`}
      {...other}
    >
      {current === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
