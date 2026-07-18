import Fab from "@mui/material/Fab";
import type { FabProps } from "@mui/material/Fab";
import type { ReactNode } from "react";

interface ActionFabProps extends FabProps {
    children: ReactNode;
}

const ActionFab = ({ children, sx, ...props }: ActionFabProps) => {
    return (
        <Fab
            size="small"
            {...props}
            sx={{
                width: 30,
                height: 30,
                minWidth: 30,
                minHeight: 30,
                zIndex: 0,
                boxShadow: "none",
                transition: "all .2s ease",

                "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: "0 2px 8px rgba(0,0,0,.2)",
                },

                ...sx,
            }}
        >
            {children}
        </Fab>
    );
};

export default ActionFab;