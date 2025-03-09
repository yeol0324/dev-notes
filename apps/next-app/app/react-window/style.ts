import { SxProps, Theme } from "@mui/material";

export const rootSx: SxProps<Theme> = {
  border: "1px solid #E0E0E0",
  borderRadius: 2,
  pr: 5,
  "& .CmpDocTable-container": {
    my: 2,
    ml: 2,
  },
};

export const tableSx: SxProps = {
  "*": {
    whiteSpace: "nowrap",
  },

  table: {},
  "& .divTable": {},
  ".tr, tr": {
    display: "flex",
  },
  ".th, th": {
    cursor: "pointer",
    alignItems: "center",
    py: 1.5,
    position: "relative",
    fontWeight: 500,
    textAlign: "center",
    border: "1px solid #e0e4ee",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ".td, td": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    border: "1px solid #e0e4ee",
  },
  ".resizer": {
    position: "absolute",
    right: "0",
    top: "0",
    height: "100%",
    width: "5px",
    background: "rgba(0, 0, 0, 0.5)",
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
  },
  ".resizer.isResizing": {
    background: "blue",
    opacity: "1",
  },
  "@media (hover: hover)": {
    ".resizer": {
      opacity: "0",
    },
    "*:hover > .resizer": {
      opacity: "1",
    },
  },
};
