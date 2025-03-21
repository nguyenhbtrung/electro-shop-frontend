import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Autocomplete from "@mui/material/Autocomplete";
import { UpdateCategory, GetAllCategories } from "../../services/categoryService";
import { UploadImage } from "../../services/imageService";

const UpdateCategoryDialog = ({ open, onClose, onSubmit, category }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    parentCategoryId: null,
    imageUrl: "",
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await GetAllCategories();
        if (res?.status === 200 && res?.data) {
          const parents = res.data.filter((cat) => cat.parentCategoryId === null);
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

  useEffect(() => {
    if (category) {
      setFormValues({
        name: category.name || "",
        description: category.description || "",
        parentCategoryId: category.parentCategoryId,
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

  const handleRemoveImage = () => {
    setFormValues((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("File", file);
    try {
      setUploading(true);
      const res = await UploadImage(formData);
      if (res?.status === 200 && res?.data?.imageUrl) {
        setFormValues((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
      } else {
        console.error("Có lỗi xảy ra khi upload ảnh.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
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
                setFormValues((prev) => ({ ...prev, description: e.target.value }))
              }
              multiline
              rows={4}
            />
          </Grid>
          {/* Combobox hiển thị danh mục cha */}
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
          {/* Phần chỉnh sửa ảnh */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Ảnh hiện tại:
            </Typography>
            {formValues.imageUrl ? (
              <Box sx={{ position: "relative", width: "100%", textAlign: "center" }}>
                <Box
                  component="img"
                  src={formValues.imageUrl}
                  alt="Ảnh Category"
                  sx={{
                    width: "60%",
                    height: "auto",
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: "20%",
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Typography variant="body2" align="center">
                Không có ảnh nào.
              </Typography>
            )}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={handleAddImageClick}
                disabled={uploading}
              >
                {uploading ? "Đang upload..." : "Chọn ảnh"}
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Box>
          </Grid>
          {/* Nếu muốn người dùng chỉnh sửa trực tiếp URL ảnh thì giữ lại trường TextField */}
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
