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
import Footer from "../../../components/Footer";
import ProductCard from "../../../components/products/ProductCard";
import { useParams } from "react-router-dom";
import { GetProductByBrandId, GetAllBrand } from "../../../services/brandService";
import { FilterInBrand } from "../../../services/filterProductService";
import { GetAllCategory } from "../../../services/productService";

const BrandProductPage = () => {
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [brands, setBrands] = useState([]); // danh sách tất cả các thương hiệu
  const [brand, setBrand] = useState(null); // thông tin thương hiệu hiện tại

  // Lấy danh sách categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetAllCategory();
        if (res?.data) {
          setCategoriesList(res.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách thương hiệu và tìm ra thương hiệu hiện tại dựa trên brandId
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await GetAllBrand();
        if (res?.data) {
          setBrands(res.data);
          const currentBrand = res.data.find(
            (item) => item.brandId.toString() === brandId
          );
          setBrand(currentBrand);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [brandId]);

  // Lấy sản phẩm theo brand
  useEffect(() => {
    const fetchProductsByBrand = async () => {
      try {
        const res = await GetProductByBrandId(brandId);
        if (res?.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Error fetching products by brand id:", error);
      }
    };

    if (brandId) {
      fetchProductsByBrand();
    }
  }, [brandId]);

  // Hàm lọc sản phẩm theo các tiêu chí
  const fetchFilteredProducts = async () => {
    try {
      const res = await FilterInBrand(
        brandId,
        priceFilter !== "" ? parseInt(priceFilter) : null,
        categoryId !== "" ? parseInt(categoryId) : null,
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
      <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
        {/* Box hiển thị thông tin thương hiệu */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          {brand && brand.imageUrl ? (
            <Box
              component="img"
              src={brand.imageUrl}
              alt={brand.brandName}
              sx={{ width: 120, height: "auto", mr: 2, objectFit: "contain" }}
            />
          ) : (
            <Box
              sx={{
                width: 120,
                height: 80,
                mr: 2,
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">
                {brand?.brandName ? brand.brandName.charAt(0) : "?"}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography variant="h5">
              {brand ? brand.brandName : brandId}
            </Typography>
            {brand && (
              <>
                <Typography variant="body2" color="textSecondary">
                  {brand.country}
                </Typography>
                <Typography variant="body1">{brand.info}</Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Tiêu đề sản phẩm và bộ lọc */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sản phẩm của thương hiệu {brand ? brand.brandName : brandId}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          {/* Panel lọc sản phẩm */}
          <Box
            sx={{
              width: 250,
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
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
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={categoryId}
                label="Danh mục"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categoriesList
                  .filter((cat) => cat.parentCategoryId !== null)
                  .map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
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

          {/* Panel hiển thị danh sách sản phẩm */}
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

      <Footer />
    </Box>
  );
};

export default BrandProductPage;
