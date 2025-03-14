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
import { GetAllBrand } from "../../services/brandService";
import { GetAllCategories } from "../../services/categoryService";

const AddUpdateProductDialog = ({ open, onClose, onSubmit, product }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    info: "",
    price: "",
    stock: "",
    categoryIds: [],
    brandId: null,
  });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandList, setBrandList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch danh sách nhãn hàng từ API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await GetAllBrand();
        if (res?.data) {
          setBrandList(res.data);
        }
      } catch (err) {
        console.log("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch danh sách category từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetAllCategories();
        if (res?.data) {
          setCategoriesList(res.data);
        }
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Khi có sản phẩm được chọn hoặc dialog mở, cập nhật giá trị ban đầu
  useEffect(() => {
    if (product) {
      setFormValues({
        name: product.name || "",
        info: product.info || "",
        price: product.originalPrice || "",
        stock: product.stock || "",
        categoryIds: product.categories ? product.categories.map((cat) => cat.categoryId) : [],
        brandId: product.brand ? product.brand.brandId : null,
      });
      setSelectedBrand(product.brand || null);
      setSelectedCategories(product.categories || []);
    } else {
      setFormValues({
        name: "",
        info: "",
        price: "",
        stock: "",
        categoryIds: [],
        brandId: null,
      });
      setSelectedBrand(null);
      setSelectedCategories([]);
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
    setSelectedCategories(newValue);
    setFormValues((prev) => ({
      ...prev,
      categoryIds: newValue.map((cat) => cat.categoryId),
    }));
  };

  const handleBrandChange = (event, newValue) => {
    setSelectedBrand(newValue);
    setFormValues((prev) => ({
      ...prev,
      brandId: newValue ? newValue.brandId : null,
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
      brandId: formValues.brandId,
    };

    try {
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
        // Xử lý thêm sản phẩm mới nếu cần
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
          {/* Danh mục: hiển thị danh sách các category từ API cho phép chọn nhiều, xóa thêm */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={categoriesList}
              getOptionLabel={(option) => option.name || ""}
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn danh mục" placeholder="Danh mục" />
              )}
            />
          </Grid>
          {/* Combobox nhãn hàng */}
          <Grid item xs={12}>
            <Autocomplete
              options={brandList}
              getOptionLabel={(option) => option.brandName || ""}
              value={selectedBrand}
              onChange={handleBrandChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn nhãn hàng" placeholder="Nhãn hàng" />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Huỷ
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUpdateProductDialog;
