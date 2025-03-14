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

import { UpdateBrand } from "../../services/brandService";

const UpdateBrandDialog = ({ open, onClose, onSubmit, brand }) => {
  // formValues lưu trữ các trường của category cần cập nhật
  const [formValues, setFormValues] = useState({
    brandName: "",
    country: "",
    info: "",
    imageUrl: "",
  });

  // Khi có category được chọn (hoặc khi mở dialog), cập nhật giá trị ban đầu
  useEffect(() => {
    if (brand) {
      setFormValues({
        brandName: brand.brandName || "",
        country: brand.country || "",
        info: brand.info || "",
        imageUrl: brand.imageUrl || "",
      });
    } else {
      setFormValues({
        brandName: "",
        country: "",
        info: "",
        imageUrl: "",
      });
    }
  }, [brand, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formValues.brandName.trim()) {
      alert("Vui lòng nhập tên nhãn hàng!");
      return;
    }

    // Chuẩn bị DTO gửi đi 
    const updatedBrand = {
      brandName: formValues.brandName.trim(),
      country: formValues.country.trim(),
      info: formValues.info.trim(),
      imageUrl: formValues.imageUrl.trim(),
    };

    try {
      const res = await UpdateBrand(brand.brandId, updatedBrand);
      if (res?.status === 200) {
      alert("Cập nhật nhãn hàng thành công!");
      onSubmit(res.data);
      onClose();
        } else {
        console.log(">>>Error updating brand:", res);
       }
      
    } catch (error) {
      console.log(">>>Error updating brand:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập nhật Brand</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Tên Brand */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Tên Brand"
              name="brandName"
              value={formValues.brandName}
              onChange={handleChange}
              inputProps={{ maxLength: 255 }}
            />
          </Grid>
          {/* Country */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formValues.country}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          {/* Info */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Info"
              name="info"
              value={formValues.info}
              multiline
              onChange={handleChange}
              rows={4}
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

export default UpdateBrandDialog;
