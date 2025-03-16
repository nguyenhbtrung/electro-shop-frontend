import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { GetAllCategories } from "../../services/categoryService";

const AddCategoryDialog = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchParentCategories = async () => {
        try {
          const res = await GetAllCategories();
          if (res?.data) {
            const parents = res.data.filter(
              (cat) => cat.parentCategoryId === null
            );
            setParentCategories(parents);
          }
        } catch (err) {
          console.log("Error fetching parent categories", err);
        }
      };

      fetchParentCategories();
    }
  }, [open]);

  const handleSubmit = () => {
    if (name.trim() === "") {
      setError("Vui lòng nhập tên category.");
      return;
    }
    if (name.length > 255) {
      setError("Tên category không được vượt quá 255 ký tự.");
      return;
    }

    const newCategory = {
      name: name.trim(),
      description: description.trim(),
      parentCategoryId: parentCategoryId, // đã là number hoặc null
      imageUrl: imageUrl.trim(),
    };

    onSubmit(newCategory);

    // Reset form và đóng dialog
    setName("");
    setDescription("");
    setParentCategoryId(null);
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
            <Autocomplete
              options={parentCategories}
              getOptionLabel={(option) => option.name}
              value={
                parentCategories.find(
                  (item) => item.categoryId === parentCategoryId
                ) || null
              }
              onChange={(event, newValue) =>
                setParentCategoryId(newValue ? newValue.categoryId : null)
              }
              renderInput={(params) => (
                <TextField {...params} label="Danh mục cha" variant="outlined" />
              )}
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
