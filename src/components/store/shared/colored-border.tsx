import React, { ReactNode } from "react";

interface ColorBorderProps {
  colors: string; // Colors string in the format "red,blue,green"
  borderWidth?: number; // Optional: Border width, default is 8px
  borderRadius?: number; // Optional: Border radius, default is 12px
  children: ReactNode; // Children elements inside the bordered div
}

const ColorBorder: React.FC<ColorBorderProps> = ({
  colors,
  borderWidth = 2,
  borderRadius = 12,
  children,
}) => {
  const colorArray = colors.split(",");

  const parentStyle: React.CSSProperties = {
    position: "relative",
    borderRadius: `${borderRadius}px`,
    padding: `${borderWidth}px`, // Space inside the border
  };

  const childStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1, // Ensure child content is above the border
    borderRadius: `${borderRadius}px`, // Ensure inner div also has rounded corners
    backgroundColor: "white", // Background color of the inner div
  };

  const beforeStyle: React.CSSProperties = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    borderRadius: `${borderRadius}px`, // Make sure the gradient follows the border-radius
    padding: `${borderWidth}px`,
    background: `linear-gradient(to right, ${colorArray.join(",")})`,
    WebkitMask:
      `linear-gradient(#fff 0 0) content-box, ` + `linear-gradient(#fff 0 0)`,
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
  };

  return (
    <div style={parentStyle}>
      <div style={beforeStyle} />
      <div style={childStyle}>{children}</div>
    </div>
  );
};

export default ColorBorder;
