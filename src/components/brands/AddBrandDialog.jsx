import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

const AddBrandDialog = ({ open, onClose, onSubmit }) => {
  const [brandName, setName] = useState("");
  const [country, setCountry] = useState("");
  const [info, setInfo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (brandName.trim() === "") {
      setError("Vui lòng nhập tên nhãn hàng.");
      return;
    }
    if (brandName.length > 255) {
      setError("Tên nhãn hàng không được vượt quá 255 ký tự.");
      return;
    }
    // Chuẩn bị DTO cho brand
    const newBrand = {
    brandName: brandName.trim(),
    country: country.trim(),
    imageUrl: imageUrl.trim(),
    info: info.trim(),
    };

    onSubmit(newBrand);

    setName("");
    setCountry("");
    setInfo("");
    setImageUrl("");
    setError("");
    onClose();
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Thêm Brand</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên nhãn hàng"
              fullWidth
              value={brandName}
              onChange={(e) => setName(e.target.value)}
              helperText="Tối đa 255 ký tự"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thuộc nước"
              fullWidth
              multiline
              rows={4}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              helperText="Nhãn hàng thuộc nước nào"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thông tin"
              fullWidth
              multiline
              rows={4}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              helperText="Thêm thông tin cho nhãn hàng"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              helperText="Đường dẫn hình ảnh (nếu có)"
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <div style={{ color: "red" }}>{error}</div>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Huỷ
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBrandDialog;
