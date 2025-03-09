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

import { UpdateCategory } from "../../services/categoryService";

const UpdateCategoryDialog = ({ open, onClose, onSubmit, category }) => {
  // formValues lưu trữ các trường của category cần cập nhật
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    parentCategoryId: "",
    imageUrl: "",
  });

  // Khi có category được chọn (hoặc khi mở dialog), cập nhật giá trị ban đầu
  useEffect(() => {
    if (category) {
      setFormValues({
        name: category.name || "",
        description: category.description || "",
        parentCategoryId: category.parentCategoryId ?? "",
        imageUrl: category.imageUrl || "",
      });
    } else {
      setFormValues({
        name: "",
        description: "",
        parentCategoryId: "",
        imageUrl: "",
      });
    }
  }, [category, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate trường bắt buộc: tên Category
    if (!formValues.name.trim()) {
      alert("Vui lòng nhập tên category!");
      return;
    }

    // Chuẩn bị DTO gửi đi (chuyển ParentCategoryId về số nếu có)
    const updatedCategory = {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      parentCategoryId:
        formValues.parentCategoryId === ""
          ? null
          : parseInt(formValues.parentCategoryId, 10),
      imageUrl: formValues.imageUrl.trim(),
    };

    try {
      const res = await UpdateCategory(category.CategoryId, updatedCategory);
      if (res?.status === 200 && res?.data) {
      alert("Cập nhật category thành công!");
      onSubmit(res.data);
      onClose();
        } else {
        console.log(">>>Error updating category:", res);
       }
      
    } catch (error) {
      console.log(">>>Error updating category:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập nhật Category</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Tên Category */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Tên Category"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              inputProps={{ maxLength: 255 }}
            />
          </Grid>
          {/* Mô tả */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          {/* Parent Category ID */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Parent Category ID"
              name="parentCategoryId"
              type="number"
              value={formValues.parentCategoryId}
              onChange={handleChange}
            />
          </Grid>
          {/* Image URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formValues.imageUrl}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCategoryDialog;
