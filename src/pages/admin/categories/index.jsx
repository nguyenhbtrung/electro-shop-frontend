import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GetAllCategory, CreateCategory, UpdateCategory, DeleteCategory } from "../../../services/categoryService";
import AddCategoryDialog from "../../../components/categories/AddCategoryDialog";
import UpdateCategoryDialog from "../../../components/categories/UpdateCategoryDialog";

const ManageCategory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories, setCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await GetAllCategory();
      if (res?.data) {
        console.log(">>>Categories: ", res.data);
        setCategories(res.data);
      }
    } catch (error) {
      console.log(">>>Error fetching categories", error);
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
      if (res?.status === 200 && res?.data) {
        alert("Thêm category thành công!");
        fetchCategories();
        setOpenAddDialog(false);
      } else {
        console.log(">>>Error creating category:", res);
      }
    } catch (error) {
      console.log(">>>Error creating category:", error);
    }
  };

  const handleEdit = (row) => {
    setSelectedCategory(row);
    setOpenEditDialog(true);
  };

  const handleEditDialogSubmit = async (updatedCategory) => {
    try {
      const res = await UpdateCategory(selectedCategory.CategoryId, updatedCategory);
      if (res?.status === 200 && res?.data) {
        alert("Cập nhật category thành công!");
        fetchCategories();
        setOpenEditDialog(false);
      } else {
        console.log(">>>Error updating category:", res);
      }
    } catch (error) {
      console.log(">>>Error updating category:", error);
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa category này không?")) {
      try {
        const res = await DeleteCategory(row.CategoryId);
        if (res?.status === 204) {
          setCategories((prev) =>
            prev.filter((category) => category.CategoryId !== row.CategoryId)
          );
        } else {
          console.log(">>>Error deleting category:", res);
        }
      } catch (error) {
        console.log(">>>Error deleting category:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các category đã chọn không?")) {
      try {
        const deletePromises = selectedRows.map((id) => DeleteCategory(id));
        await Promise.all(deletePromises);
        setCategories((prev) =>
          prev.filter((category) => !selectedRows.includes(category.CategoryId))
        );
        setSelectedRows([]);
      } catch (error) {
        console.log(">>>Error deleting selected categories:", error);
      }
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
      headerName: "Parent Category ID",
      flex: 0.7,
    },
    {
      field: "imageUrl",
      headerName: "Ảnh",
      flex: 1,
      renderCell: (params) => {
        return params.value ? (
          <img src={params.value} alt={params.row.Name} style={{ height: "40px" }} />
        ) : (
          ""
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 0.6,
      minWidth: 100,
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
          </>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Quản lý category" subtitle="Danh sách các category" />
        <Box display="flex" alignItems="center" gap={2}>
          {selectedRows.length > 0 && (
            <Button variant="contained" color="error" onClick={handleDeleteSelected}>
              Xoá đã chọn
            </Button>
          )}
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
          checkboxSelection
          selectionModel={selectedRows}
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>

      <AddCategoryDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddDialogSubmit}
      />

      <UpdateCategoryDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleEditDialogSubmit}
        category={selectedCategory}
      />
    </Box>
  );
};

export default ManageCategory;
