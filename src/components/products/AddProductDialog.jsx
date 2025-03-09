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
import { GetAllCategory } from "../../services/productService";

const AddProductDialog = ({ open, onClose, onSubmit }) => {
  // State cho các trường input của sản phẩm
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  // State cho danh sách category lấy từ API và danh mục được chọn
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");

  // Lấy danh sách category từ API /Category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetAllCategory();
        if (res?.data) {
          setCategoriesList(res.data);
        }
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = () => {
    // Validate tên sản phẩm
    if (name.trim() === "") {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (name.length > 255) {
      setError("Tên sản phẩm không được vượt quá 255 ký tự.");
      return;
    }
    // Validate thông tin sản phẩm
    if (info.trim() === "") {
      setError("Vui lòng nhập thông tin sản phẩm.");
      return;
    }
    if (info.length > 500) {
      setError("Thông tin sản phẩm không được vượt quá 500 ký tự.");
      return;
    }
    // Validate giá sản phẩm
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Giá sản phẩm phải là số lớn hơn 0.");
      return;
    }
    // Validate tồn kho
    const stockValue = parseInt(stock, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      setError("Số lượng tồn kho phải là số không âm.");
      return;
    }

    // Lấy mảng categoryIds từ danh mục được chọn
    const categoryIdsArray = selectedCategories.map((cat) => cat.categoryId);

    // Nếu validate thành công, gọi onSubmit truyền dữ liệu mới cho component cha
    onSubmit({
      name: name.trim(),
      info: info.trim(),
      price: priceValue,
      stock: stockValue,
      categoryIds: categoryIdsArray,
    });

    // Reset form và đóng dialog
    setName("");
    setInfo("");
    setPrice("");
    setStock("");
    setSelectedCategories([]);
    setError("");
    onClose();
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên sản phẩm"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Tối đa 255 ký tự"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thông tin sản phẩm"
              fullWidth
              multiline
              rows={4}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              helperText="Tối đa 500 ký tự"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Giá sản phẩm"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Số lượng tồn kho"
              fullWidth
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={categoriesList}
              getOptionLabel={(option) => option.name || ""}
              value={selectedCategories}
              onChange={(event, newValue) => {
                setSelectedCategories(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Chọn danh mục" placeholder="Danh mục" />
              )}
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

export default AddProductDialog;
