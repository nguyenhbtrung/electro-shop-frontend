import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import { GetProductByCategoryId, GetCategoryById } from "../../../services/categoryService";
import { FilterInCategory } from "../../../services/filterProductService";
import { GetAllBrand } from "../../../services/brandService";
import { useParams } from "react-router-dom";
import Footer from "../../../components/Footer";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null); // state lưu thông tin danh mục

  // Các state để lưu bộ lọc
  const [priceFilter, setPriceFilter] = useState("");
  const [brandId, setBrandId] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  // State lưu danh sách thương hiệu
  const [brands, setBrands] = useState([]);

  // Lấy danh sách thương hiệu khi component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await GetAllBrand();
        if (res?.data) {
          setBrands(res.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Lấy sản phẩm theo category ban đầu
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const res = await GetProductByCategoryId(categoryId);
        if (res?.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Error fetching products by category id:", error);
      }
    };
    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]);

  // Lấy thông tin danh mục theo categoryId
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await GetCategoryById(categoryId);
        if (res?.data) {
          setCategory(res.data);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  // Hàm lọc sản phẩm theo các tiêu chí
  const fetchFilteredProducts = async () => {
    try {
      const res = await FilterInCategory(
        categoryId,
        priceFilter !== "" ? parseInt(priceFilter) : null,
        brandId !== "" ? parseInt(brandId) : null,
        ratingFilter !== "" ? parseInt(ratingFilter) : null
      );
      if (res?.data) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          p: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sản phẩm của danh mục {category ? category.name : categoryId}
        </Typography>

        {/* Container chứa Filter Panel và danh sách sản phẩm */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {/* Filter Panel bên trái */}
          <Box
            sx={{
              width: 250,
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              // Nếu muốn cố định chiều cao và cuộn nội dung
              // maxHeight: 600,
              // overflow: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bộ lọc
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Giá</InputLabel>
              <Select
                value={priceFilter}
                label="Giá"
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={0}>Dưới 5 triệu</MenuItem>
                <MenuItem value={1}>Từ 5 - 10 triệu</MenuItem>
                <MenuItem value={2}>Từ 10 - 15 triệu</MenuItem>
                <MenuItem value={3}>Từ 15 - 20 triệu</MenuItem>
                <MenuItem value={4}>Trên 20 triệu</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                value={brandId}
                label="Thương hiệu"
                onChange={(e) => setBrandId(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Đánh giá</InputLabel>
              <Select
                value={ratingFilter}
                label="Đánh giá"
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={0}>0-1 sao</MenuItem>
                <MenuItem value={1}>1-2 sao</MenuItem>
                <MenuItem value={2}>2-3 sao</MenuItem>
                <MenuItem value={3}>3-4 sao</MenuItem>
                <MenuItem value={4}>4-5 sao</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" fullWidth onClick={fetchFilteredProducts}>
              Áp dụng lọc
            </Button>
          </Box>

          {/* Product List Panel bên phải */}
          <Box
            sx={{
              flexGrow: 1,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
            }}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))
            ) : (
              <Typography>Không tìm thấy sản phẩm nào</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default CategoryProductsPage;
