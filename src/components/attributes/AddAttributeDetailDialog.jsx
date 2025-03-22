import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { CreateAttributeDetail } from "../../services/attributeService";

const AddAttributeDetailDialog = ({ open, onClose, attribute, onSuccess }) => {
  const [value, setValue] = useState("");
  const [priceModifier, setPriceModifier] = useState(0);

  const handleSubmit = async () => {
    if (!value.trim()) {
      alert("Giá trị không được để trống!");
      return;
    }
    if (priceModifier < 0) {
      alert("Price Modifier không được là số âm!");
      return;
    }
    try {
      const res = await CreateAttributeDetail(attribute.attributeId, {
        value,
        priceModifier,
      });
      if (res?.data) {
        alert("Thêm chi tiết thuộc tính thành công!");
        fetchAttributes();
        onSuccess && onSuccess();
      }
    } catch (error) {
    }
    setValue("");
    setPriceModifier(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm Chi Tiết Thuộc Tính cho "{attribute.name}"</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Giá trị"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price Modifier"
          type="number"
          fullWidth
          value={priceModifier}
          onChange={(e) => setPriceModifier(Number(e.target.value))}
          inputProps={{ min: 0 }}
          helperText="Không được nhập số âm"
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

export default AddAttributeDetailDialog;
