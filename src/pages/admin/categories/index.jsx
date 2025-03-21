import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  GetAllCategories,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  GetProductByCategoryId, 
} from "../../../services/categoryService";
import AddCategoryDialog from "../../../components/categories/AddCategoryDialog";
import UpdateCategoryDialog from "../../../components/categories/UpdateCategoryDialog";
import ViewCategoryImageDialog from "../../../components/categories/ViewCategoryImageDialog";

const ManageCategory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories, setCategories] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // State cho dialog xem ảnh chi tiết danh mục
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImageCategory, setSelectedImageCategory] = useState(null);

  // State cho dialog xem danh sách sản phẩm của category
  const [openProductsDialog, setOpenProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductsCategory, setSelectedProductsCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await GetAllCategories();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogSubmit = async (newCategory) => {
    try {
      const res = await CreateCategory(newCategory);
      if (res?.status === 200) {
        alert("Thêm category thành công!");
        setCategories((prev) => [res.data, ...prev]);
        setOpenAddDialog(false);
      } else {
        console.log("Error creating category:", res);
      }
    } catch (error) {
      console.log("Error creating category:", error);
    }
  };

  const handleEdit = (row) => {
    setSelectedCategory(row);
    setOpenEditDialog(true);
  };

  const handleEditDialogSubmit = async (updatedCategory) => {
    try {
      const res = await UpdateCategory(selectedCategory.categoryId, updatedCategory);
      if (res?.status === 200 && res?.data) {
        fetchCategories();
        setOpenEditDialog(false);
        alert("Cập nhật category thành công!");
      } else {
        console.log("Error updating category:", res);
      }
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa category này không?")) {
      try {
        const res = await DeleteCategory(row.categoryId);
        if (res?.status === 204) {
          alert("Xóa category thành công!");
          fetchCategories();
        } else {
          alert(res.data);
          console.log("Error deleting category:", res);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Có lỗi xảy ra khi xóa danh mục.");
        }
        console.log("Error deleting category:", error);
      }
    }
  };

  // Mở dialog xem ảnh chi tiết của danh mục
  const handleViewImage = (row) => {
    setSelectedImageCategory(row);
    setOpenImageDialog(true);
  };

  // Mở dialog xem danh sách sản phẩm của category
  const handleViewProducts = async (row) => {
    try {
      const res = await GetProductByCategoryId(row.categoryId);
      if (res?.data) {
        setProducts(res.data);
        setSelectedProductsCategory(row);
        setOpenProductsDialog(true);
      }
    } catch (error) {
      console.log("Error fetching products for category", error);
    }
  };

  const columns = [
    {
      field: "categoryId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Tên category",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 1,
    },
    {
      field: "parentCategoryId",
      headerName: "Danh mục cha",
      flex: 0.7,
      renderCell: (params) => {
        const parentId = params.value;
        const parentCategory = categories.find((cat) => cat.categoryId === parentId);
        return parentCategory ? parentCategory.name : "";
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton color={colors.primary[100]} onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color={colors.primary[100]} onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton color={colors.primary[100]} onClick={() => handleViewImage(params.row)}>
            <ImageIcon />
          </IconButton>
          <IconButton color={colors.primary[100]} onClick={() => handleViewProducts(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Quản lý category" subtitle="Danh sách các category" />
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddCategory}>
            Thêm category
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
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={categories}
          columns={columns}
          getRowId={(row) => row.categoryId}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>

      <AddCategoryDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSubmit={handleAddDialogSubmit} />
      <UpdateCategoryDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleEditDialogSubmit}
        category={selectedCategory}
      />
      <ViewCategoryImageDialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} category={selectedImageCategory} />

      {/* Dialog hiển thị danh sách sản phẩm của danh mục */}
      <ViewCategoryProductsDialog
        open={openProductsDialog}
        onClose={() => setOpenProductsDialog(false)}
        products={products}
        category={selectedProductsCategory}
      />
    </Box>
  );
};

// Component Dialog hiển thị danh sách sản phẩm của danh mục
const ViewCategoryProductsDialog = ({ open, onClose, products, category }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Định nghĩa các cột hiển thị: chỉ bao gồm ID, Tên, ảnh (ảnh đầu tiên), giá gốc và điểm đánh giá trung bình
  const columns = [
    { field: "productId", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Tên sản phẩm", flex: 1 },
    {
      field: "image",
      headerName: "Ảnh",
      flex: 0.5,
      renderCell: (params) => {
        const images = params.row.images;
        return images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={params.row.name}
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
          />
        ) : null;
      },
    },
    { field: "originalPrice", headerName: "Giá gốc", flex: 0.5 },
    { field: "averageRating", headerName: "Đánh giá", flex: 0.3 },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Sản phẩm của danh mục: {category ? category.name : ""}
      </DialogTitle>
      <DialogContent>
        <Box mt="10px" height="400px">
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row.productId}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCategory;
