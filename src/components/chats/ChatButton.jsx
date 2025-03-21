// ChatButton.jsx
import React from "react";
import { Button, Badge } from "@mui/material";
import { ChatBubble } from "@mui/icons-material";

const ChatButton = ({ onClick, hasNotification }) => (
    <Badge
        color="error"
        variant="dot"
        invisible={!hasNotification}
        sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1300,
        }}
    >
        <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            sx={{
                borderRadius: "50%",
                width: 56,
                height: 56,
                minWidth: 0,
                padding: 0,
            }}
        >
            <ChatBubble />
        </Button>
    </Badge>
);

export default ChatButton;
