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
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                backgroundColor: "#fff",
                color: "#64748b",
                boxShadow: "none",
                transition: "background-color .2s,color .2s",
                zIndex: 0,
                "&:hover": {
                    backgroundColor: "#fee2e2",
                    color: "#ef4444",
                    boxShadow: "none",
                },

                ...sx,
            }}
        >
            {children}
        </Fab>
    );
};

export default ActionFab;