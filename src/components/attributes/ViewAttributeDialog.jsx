import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ViewAttributeDetailsDialog = ({ open, onClose, attribute }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi tiết thuộc tính: {attribute.name}</DialogTitle>
      <DialogContent>
        <List>
          {attribute.details.map((detail) => (
            <ListItem key={detail.attributeDetailId}>
              <ListItemText
                primary={detail.value}
                secondary={`Price Modifier: ${detail.priceModifier}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAttributeDetailsDialog;
