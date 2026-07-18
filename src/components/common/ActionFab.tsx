import { forwardRef } from "react";
import Fab, { type FabProps } from "@mui/material/Fab";
import { alpha } from "@mui/material/styles";

interface ActionFabProps extends FabProps { }

const ActionFab = forwardRef<HTMLButtonElement, ActionFabProps>(
    ({ sx, color = "primary", ...props }, ref) => {
        return (
            <Fab
                ref={ref}
                size="small"
                color={color}
                {...props}
                sx={[
                    (theme: any) => {
                        const palette =
                            color !== "inherit" ? theme.palette[color] : theme.palette.primary;

                        return {
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                            borderRadius: "8px",
                            zIndex: 0,
                            backgroundColor: "#fff",
                            color: "#64748b",
                            boxShadow: "none",

                            "&:hover": {
                                backgroundColor: alpha(palette.main, 0.12),
                                color: palette.main,
                                boxShadow: "none",
                            },
                        };
                    },
                    // cho phép override từ ngoài truyền vào qua prop sx
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            />
        );
    }
);

ActionFab.displayName = "ActionFab";

export default ActionFab;