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
import { GetAllAttribute } from "../../../services/attributeService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddAttributeDialog from "../../../components/attributes/AddAttributeDialog";
import UpdateAttributeDialog from "../../../components/attributes/UpdateAttributeDialog";
import ViewAttributeDetailsDialog from "../../../components/attributes/AddAttributeDialog";

const ManageAttribute = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [attributes, setAttributes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const fetchAttributes = async () => {
    try {
      const res = await GetAllAttribute();
      if (res?.data) {
        console.log(">>>Attributes: ", res.data);
        setAttributes(res.data);
      }
    } catch (error) {
      console.log("Error fetching attributes", error);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleViewDetails = (row) => {
    setSelectedAttribute(row);
    setOpenDetailDialog(true);
  };

  const handleEdit = (row) => {
    setSelectedAttribute(row);
    setOpenUpdateDialog(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này không?")) {
      setAttributes((prev) =>
        prev.filter((attr) => attr.attributeId !== row.attributeId)
      );
      alert("Xóa thuộc tính thành công!");
    }
  };

  const columns = [
    {
      field: "attributeId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Tên thuộc tính",
      flex: 1,
    },
    {
      field: "values",
      headerName: "Giá trị",
      flex: 1,
      renderCell: (params) => {
        if (Array.isArray(params.row.details)) {
          // Lấy danh sách value của từng detail và nối thành chuỗi
          return params.row.details.map((detail) => detail.value).join(", ");
        }
        return "";
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 0.8,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color={colors.primary[100]}
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color={colors.primary[100]}
              onClick={() => handleDelete(params.row)}
            >
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
        <Header title="Quản lý thuộc tính" subtitle="Danh sách các thuộc tính sản phẩm" />
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Thêm thuộc tính
          </Button>
        </Box>
      </Box>

      <Box
        mt="10px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: `1px solid ${colors.grey ? colors.grey[300] : "#e0e0e0"}`,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${colors.grey ? colors.grey[300] : "#e0e0e0"}`,
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": { 
            color: colors.primary[100] 
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={attributes}
          columns={columns}
          getRowId={(row) => row.attributeId}
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

      {/* Dialog thêm thuộc tính */}
      {openAddDialog && (
        <AddAttributeDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onSubmit={(newAttribute) => {
            // Giả sử gọi API tạo mới thuộc tính ở đây
            setAttributes((prev) => [newAttribute, ...prev]);
            setOpenAddDialog(false);
            alert("Thêm thuộc tính thành công!");
          }}
        />
      )}

      {/* Dialog cập nhật thuộc tính */}
      {openUpdateDialog && (
        <UpdateAttributeDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          onSubmit={(updatedAttribute) => {
            // Sau khi cập nhật, gọi lại API hoặc làm mới danh sách thuộc tính
            fetchAttributes();
            setOpenUpdateDialog(false);
          }}
          attribute={selectedAttribute}
        />
      )}
    </Box>
  );
};

export default ManageAttribute;
