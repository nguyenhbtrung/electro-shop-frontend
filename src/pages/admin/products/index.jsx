import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { CreateProduct, DeleteProduct, GetAllProduct } from "../../../services/productService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";
import AddProductDialog from "../../../components/products/AddProductDialog";
import AddUpdateProductDialog from "../../../components/products/UpdateProductDialog";
import EditProductImagesDialog from "../../../components/products/ProductImageDialog";

const ManageProduct = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEditProductDialog, setEditProductDialog] = useState(false);

  // State để mở dialog chỉnh sửa ảnh và lưu sản phẩm được chọn
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImageProduct, setSelectedImageProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await GetAllProduct();
      if (res?.data) {
        console.log(">>>Products: ", res.data);
        setProducts(res.data);
      }
    } catch (error) {
      console.log(">>>Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogSubmit = async (newProduct) => {
    console.log("New Product: ", newProduct);
    const res = await CreateProduct(newProduct);
    if (res?.status === 200 && res?.data) {
      alert("Thêm sản phẩm thành công!");
      setProducts((prevProducts) => [res.data, ...prevProducts]);
    } else {
      console.log(">>>Check err:", res);
    }
  };


  const handleEdit = (row) => {
    setSelectedProduct(row);
    setEditProductDialog(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      console.log("Delete product: ", row?.productId);
      try {
        const res = await DeleteProduct(row?.productId);
        if (res?.status === 200 || res?.status === 204) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.productId !== row.productId)
          );
          alert("Xóa sản phẩm thành công!");
        } else {
          console.log(">>>Error deleting product:", res);
        }
      } catch (error) {
        console.log(">>>Error deleting product:", error);
      }
    }
  };

  // Xử lý nút chỉnh sửa ảnh
  const handleEditImage = (row) => {
    setSelectedImageProduct(row);
    setOpenImageDialog(true);
  };

  const columns = [
    {
      field: "productId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "info",
      headerName: "Thông tin",
      flex: 1,
    },
    {
      field: "originalPrice",
      headerName: "Giá",
      type: "number",
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: "stock",
      headerName: "Số lượng",
      type: "number",
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: "averageRating",
      headerName: "Đánh giá trung bình",
      type: "number",
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: "categories",
      headerName: "Danh mục",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.map((cat) => cat.name).join(", ");
        }
        return "";
      },
    },
    {
      field: "brand",
      headerName: "Nhãn hàng",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return params.value ? params.value.brandName : "";
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 0.8,
      minWidth: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton color={colors.primary[100]} onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton color={colors.primary[100]} onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
            <IconButton color={colors.primary[100]} onClick={() => handleEditImage(params.row)}>
              <ImageIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Quản lý sản phẩm" subtitle="Danh sách các sản phẩm" />
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
          >
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      <Box
        mt="10px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.gray[900],
            "--DataGrid-containerBackground": "transparent",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.gray[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": { color: colors.primary[100] },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.productId}
          checkboxSelection
          selectionModel={selectedRows}
          onRowSelectionModelChange={(ids) => {
            console.log("Selected rows: ", ids);
            setSelectedRows(ids);
          }}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: { paginationModel: { pageSize: 100 } },
          }}
        />
      </Box>

      <AddProductDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddDialogSubmit}
      />

      {/* Dialog cập nhật sản phẩm */}
      <AddUpdateProductDialog
        open={openEditProductDialog}
        onClose={() => setEditProductDialog(false)}
        onSubmit={(updatedProduct) => {
          // Sau khi chỉnh sửa, fetch lại danh sách sản phẩm từ server
          fetchProducts();
          setEditProductDialog(false);
        }}
        product={selectedProduct}
        categories={[]}
      />


      {/* Dialog chỉnh sửa ảnh sản phẩm */}
      <EditProductImagesDialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        productId={selectedImageProduct ? selectedImageProduct.productId : null}
      />
    </Box>
  );
};

export default ManageProduct;
