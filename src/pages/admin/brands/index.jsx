import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GetAllBrand, CreateBrand, UpdateBrand, DeleteBrand } from "../../../services/brandService";
import AddBrandDialog from "../../../components/brands/AddBrandDialog";
import UpdateBrandDialog from "../../../components/brands/UpdateBrandDialog";

const ManageBrand = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [brands, setBrands] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await GetAllBrand();
      if (res?.data) {
        console.log(">>>Brand: ", res.data);
        setBrands(res.data);
      }
    } catch (error) {
      console.log(">>>Error fetching brands", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogSubmit = async (newBrand) => {
    try {
      const res = await CreateBrand(newBrand);
      if (res?.status === 200 && res?.data) {
        alert("Thêm brand thành công!");
        // Thêm brand mới vào đầu danh sách
        setBrands((prev) => [res.data, ...prev]);
        setOpenAddDialog(false);
      } else {
        console.log(">>>Error creating brand:", res);
      }
    } catch (error) {
      console.log(">>>Error creating brand", error);
    }
  };

  const handleEdit = (row) => {
    setSelectedBrand(row);
    setOpenEditDialog(true);
  };

  const handleEditDialogSubmit = async (updatedBrand) => {
    try {
      const res = await UpdateBrand(selectedBrand.brandId, updatedBrand);
      if (res?.status === 200) {
        alert("Cập nhật brand thành công!");
        setOpenEditDialog(false);
        fetchBrands();
      } else {
        console.log(">>>Error updating brand:", res);
      }
    } catch (error) {
      console.log(">>>Error updating brand:", error);
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhãn hàng này không?")) {
      try {
        const res = await DeleteBrand(row.brandId);
        if (res?.status === 204) {
          setBrands((prev) =>
            prev.filter((brand) => brand.brandId !== row.brandId)
          );
          alert("Xóa nhãn hàng thành công");
        } else {
          alert(res.data);
          console.log(">>>Error deleting category:", res);
        }
      } catch (error) {
        console.log(">>>Error deleting brand:", error);
      }
    }
  };

  const columns = [
    {
      field: "brandId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "brandName",
      headerName: "Tên nhãn hàng",
      flex: 1,
    },
    {
      field: "country",
      headerName: "Thuộc nước",
      flex: 1,
    },
    {
      field: "info",
      headerName: "Thông tin",
      flex: 1.5,
    },
    {
      field: "imageUrl",
      headerName: "Ảnh",
      flex: 1,
      renderCell: (params) => {
        return params.value ? (
          <img src={params.value} alt={params.row.brandName} style={{ height: "40px" }} />
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
      renderCell: (params) => (
        <>
          <IconButton color={colors.primary[100]} onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color={colors.primary[100]} onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Quản lý brand" subtitle="Danh sách các brand" />
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddBrand}>
            Thêm Nhãn Hàng
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
          rows={brands}
          columns={columns}
          getRowId={(row) => row.brandId}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>

      <AddBrandDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddDialogSubmit}
      />

      <UpdateBrandDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleEditDialogSubmit}
        brand={selectedBrand}
      />
    </Box>
  );
};

export default ManageBrand;
