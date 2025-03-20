// ChatButton.jsx
import React from "react";
import { Button } from "@mui/material";

const ChatButton = ({ onClick }) => (
    <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1300,
            borderRadius: "50%",
            width: 56,
            height: 56,
            minWidth: 0,
            padding: 0,
        }}
    >
        Chat
    </Button>
);

export default ChatButton;
