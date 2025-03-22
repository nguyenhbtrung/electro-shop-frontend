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
import { GetAllAttribute, CreateAttribute, CreateAttributeDetail } from "../../../services/attributeService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAttributeDialog from "../../../components/attributes/AddAttributeDialog";
import UpdateAttributeDialog from "../../../components/attributes/UpdateAttributeDialog";
import AddAttributeDetailDialog from "../../../components/attributes/AddAttributeDetailDialog";

const ManageAttribute = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [attributes, setAttributes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openAddDetailDialog, setOpenAddDetailDialog] = useState(false);
  const [selectedAttributeForDetail, setSelectedAttributeForDetail] = useState(null);

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
      fetchAttributes();
    }
  };

  const handleAddDetailClick = (row) => {
    setSelectedAttributeForDetail(row);
    setOpenAddDetailDialog(true);
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
          return params.row.details.map((detail) => detail.value).join(", ");
        }
        return "";
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 1, // Tăng kích thước cột cho đủ 3 nút
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {/* Nút thêm chi tiết thuộc tính */}
          <IconButton
            color={colors.primary[100]}
            onClick={() => handleAddDetailClick(params.row)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
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
      ),
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
            color: colors.primary[100],
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

      {/* Dialog Thêm Thuộc Tính */}
      {openAddDialog && (
        <AddAttributeDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
        />
      )}

      {/* Dialog Cập nhật Thuộc Tính */}
      {openUpdateDialog && (
        <UpdateAttributeDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          onSubmit={(updatedAttribute) => {
            fetchAttributes();
            setOpenUpdateDialog(false);
          }}
          attribute={selectedAttribute}
        />
      )}

      {/* Dialog Thêm Chi Tiết Thuộc Tính */}
      {openAddDetailDialog && selectedAttributeForDetail && (
        <AddAttributeDetailDialog
          open={openAddDetailDialog}
          onClose={() => setOpenAddDetailDialog(false)}
          attribute={selectedAttributeForDetail}
          onSubmit={async (detailData) => {
            try {
              const res = await CreateAttributeDetail(
                selectedAttributeForDetail.attributeId,
                detailData
              );
              if (res?.data) {
                alert("Thêm chi tiết thuộc tính thành công!");
                // Cập nhật lại danh sách nếu cần, ví dụ gọi fetchAttributes()
              }
            } catch (error) {
              console.log("Error creating attribute detail", error);
              alert("Lỗi khi thêm chi tiết thuộc tính!");
            }
            setOpenAddDetailDialog(false);
          }}
        />
      )}
    </Box>
  );
};

export default ManageAttribute;
