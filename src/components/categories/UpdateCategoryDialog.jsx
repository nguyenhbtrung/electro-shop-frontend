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

import { UpdateCategory, GetAllCategories } from "../../services/categoryService";

const UpdateCategoryDialog = ({ open, onClose, onSubmit, category }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    parentCategoryId: null,
    imageUrl: "",
  });

  // Lưu danh sách các danh mục cha (các category có parentCategoryId === null)
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await GetAllCategories();
        if (res?.status === 200 && res?.data) {
          const parents = res.data.filter(
            (cat) => cat.parentCategoryId === null
          );
          setParentCategories(parents);
        } else {
          console.error("Error fetching categories:", res);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchParentCategories();
  }, []);

  // Cập nhật giá trị form khi có category được chọn hoặc dialog mở ra
  useEffect(() => {
    if (category) {
      setFormValues({
        name: category.name || "",
        description: category.description || "",
        parentCategoryId: category.parentCategoryId, // null nếu là danh mục cha
        imageUrl: category.imageUrl || "",
      });
    } else {
      setFormValues({
        name: "",
        description: "",
        parentCategoryId: null,
        imageUrl: "",
      });
    }
  }, [category, open]);

  const handleSubmit = async () => {
    if (!formValues.name.trim()) {
      alert("Vui lòng nhập tên category!");
      return;
    }
    const updatedCategory = {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      parentCategoryId: formValues.parentCategoryId,
      imageUrl: formValues.imageUrl.trim(),
    };

    try {
      const res = await UpdateCategory(category.categoryId, updatedCategory);
      if (res?.status === 200 && res?.data) {
        alert("Cập nhật category thành công!");
        onSubmit(res.data);
        onClose();
      } else {
        console.error("Error updating category:", res);
      }
    } catch (error) {
      console.error("Error updating category:", error);
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
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, name: e.target.value }))
              }
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
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              multiline
              rows={4}
            />
          </Grid>
          {/* Combobox hiển thị tên danh mục cha */}
          <Grid item xs={12}>
            <Autocomplete
              options={parentCategories}
              getOptionLabel={(option) => option.name}
              value={
                parentCategories.find(
                  (item) => item.categoryId === formValues.parentCategoryId
                ) || null
              }
              onChange={(event, newValue) =>
                setFormValues((prev) => ({
                  ...prev,
                  parentCategoryId: newValue ? newValue.categoryId : null,
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Danh mục cha" variant="outlined" />
              )}
            />
          </Grid>
          {/* Image URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formValues.imageUrl}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
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
