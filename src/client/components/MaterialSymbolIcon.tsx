import { Icon, IconProps } from "@mui/material";
import { forwardRef } from "react";
import {
  MaterialSymbolWeight,
  SymbolCodepoints,
} from "react-material-symbols/dist/types";

export interface MaterialSymbolIconProps extends IconProps {
  icon: SymbolCodepoints;
  fill?: boolean;
  weight?: MaterialSymbolWeight;
  grade?: number;
  size?: number;
  fontSize?: undefined;
}

const MaterialSymbolIcon = forwardRef<HTMLSpanElement, MaterialSymbolIconProps>(
  ({ icon, fill, weight, grade, size, sx, className, ...props }, ref) => {
    return (
      <Icon
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        sx={{
          fontVariationSettings: `"FILL" ${fill ? 1 : 0}, "GRAD" ${grade ?? 0}`,
          fontWeight: weight,
          fontSize: `${size ?? 24}px`,
          transition: `font-variation-settings 300ms`,
          ...(sx || {}),
        }}
        className={`material-symbols-rounded ${className ?? ""}`}
        ref={ref}
      >
        {icon}
      </Icon>
    );
  }
);

export default MaterialSymbolIcon;
