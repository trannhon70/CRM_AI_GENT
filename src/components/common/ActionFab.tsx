import Fab, { type FabProps } from "@mui/material/Fab";
import { alpha } from "@mui/material/styles";

interface ActionFabProps extends FabProps { }

const ActionFab = ({ sx, color = "primary", ...props }: ActionFabProps) => {
    return (
        <Fab
            size="small"
            color={color}
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

            ]}
        />
    );
};

export default ActionFab;