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
import { UpdateProduct } from "../../services/productService";

const AddUpdateProductDialog = ({ open, onClose, onSubmit, product, categories }) => {


  const [formValues, setFormValues] = useState({
    name: "",
    info: "",
    price: "",
    stock: "",
    categoryIds: [],
  });

  // Khi có sản phẩm được chọn (hoặc khi đóng mở dialog), cập nhật giá trị ban đầu
  useEffect(() => {
    if (product) {
      setFormValues({
        name: product.name || "",
        info: product.info || "",
        price: product.originalPrice || "",
        stock: product.stock || "",
        categoryIds: product.categories ? product.categories.map((cat) => cat.categoryId) : [],
      });
    } else {
      setFormValues({
        name: "",
        info: "",
        price: "",
        stock: "",
        categoryIds: [],
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      categoryIds: newValue.map((cat) => cat.categoryId),
    }));
  };

  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    if (!formValues.name || !formValues.info || !formValues.price || !formValues.stock) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    // Chuẩn bị DTO gửi đi (chuyển Price, Stock về số)
    const updatedProduct = {
      name: formValues.name,
      info: formValues.info,
      price: parseFloat(formValues.price),
      stock: parseInt(formValues.stock, 10),
      categoryIds: formValues.categoryIds,
    };

    try {
      // Nếu có product được chọn thì gọi API cập nhật
      if (product) {
        const res = await UpdateProduct(product.productId, updatedProduct);
        if (res?.status === 200 && res?.data) {
          alert("Cập nhật sản phẩm thành công!");
          onSubmit(res.data); 
          onClose();
        } else {
          console.log(">>>Error updating product:", res);
        }
      } else {
        // Nếu trường hợp thêm sản phẩm mới, bạn có thể bổ sung thêm xử lý ở đây
      }
    } catch (error) {
      console.log(">>>Error updating product:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Tên sản phẩm */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Tên sản phẩm"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              inputProps={{ maxLength: 255 }}
            />
          </Grid>
          {/* Thông tin sản phẩm */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Thông tin"
              name="info"
              value={formValues.info}
              onChange={handleChange}
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
          {/* Giá sản phẩm */}
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Giá"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          {/* Số lượng sản phẩm */}
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Số lượng"
              name="stock"
              value={formValues.stock}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          {/* Danh mục (CategoryIds) */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={categories || []}
              getOptionLabel={(option) => option.name}
              value={
                categories
                  ? categories.filter((cat) =>
                      formValues.categoryIds.includes(cat.categoryId)
                    )
                  : []
              }
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField {...params} label="Danh mục" placeholder="Chọn danh mục" />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUpdateProductDialog;
