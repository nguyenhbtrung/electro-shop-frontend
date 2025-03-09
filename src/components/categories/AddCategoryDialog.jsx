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

const AddCategoryDialog = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate tên Category
    if (name.trim() === "") {
      setError("Vui lòng nhập tên category.");
      return;
    }
    if (name.length > 255) {
      setError("Tên category không được vượt quá 255 ký tự.");
      return;
    }

    // Validate Parent Category ID nếu có (nếu không, sẽ trả về null)
    const parentIdValue =
      parentCategoryId.trim() === "" ? null : parseInt(parentCategoryId, 10);
    if (parentCategoryId.trim() !== "" && isNaN(parentIdValue)) {
      setError("Parent Category ID phải là số hợp lệ.");
      return;
    }

    // Chuẩn bị DTO cho category
    const newCategory = {
      name: name.trim(),
      description: description.trim(),
      parentCategoryId: parentIdValue,
      imageUrl: imageUrl.trim(),
    };

    // Nếu validate thành công, gọi onSubmit truyền dữ liệu mới cho component cha
    onSubmit(newCategory);

    // Reset form và đóng dialog
    setName("");
    setDescription("");
    setParentCategoryId("");
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
      <DialogTitle>Thêm Category</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên Category"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Tối đa 255 ký tự"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Mô tả category (tùy chọn)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Parent Category ID"
              fullWidth
              type="number"
              value={parentCategoryId}
              onChange={(e) => setParentCategoryId(e.target.value)}
              helperText="ID của category cha (nếu có)"
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

export default AddCategoryDialog;
