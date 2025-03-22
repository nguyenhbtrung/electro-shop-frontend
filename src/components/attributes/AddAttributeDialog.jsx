import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { CreateAttribute } from "../../services/attributeService";

const AddAttributeDialog = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Tên thuộc tính không được để trống!");
      return;
    }
    try {
      const res = await CreateAttribute({ name });
      if (res?.data) {
        alert("Thêm thuộc tính thành công!");
        onSuccess && onSuccess(res.data);
        setName("");
        onClose();
      }
    } catch (error) {
      console.log("Error creating attribute", error);
      alert("Lỗi khi thêm thuộc tính!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm Thuộc Tính Mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên thuộc tính"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttributeDialog;
