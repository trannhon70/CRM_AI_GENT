import { forwardRef } from "react";
import Fab, { type FabProps } from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

interface ActionFabProps extends FabProps {
    loading?: boolean;
}

const ActionFab = forwardRef<HTMLButtonElement, ActionFabProps>(
    ({ sx, color = "primary", loading = false, children, disabled, ...props }, ref) => {
        return (
            <Fab
                ref={ref}
                size="small"
                color={color}
                disabled={disabled || loading}
                {...props}
                sx={[
                    (theme: any) => {
                        const palette =
                            color !== "inherit"
                                ? theme.palette[color]
                                : theme.palette.primary;

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
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            >
                {loading ? (
                    <CircularProgress size={18} color="inherit" />
                ) : (
                    children
                )}
            </Fab>
        );
    }
);

ActionFab.displayName = "ActionFab";

export default ActionFab;