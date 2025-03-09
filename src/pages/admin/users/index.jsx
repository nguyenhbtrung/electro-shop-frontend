import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { GridToolbar } from "@mui/x-data-grid";

const ManageUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);

  const columns = [
    {
      field: "userName",
      headerName: "Tên đăng nhập",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "fullName",
      headerName: "Họ và tên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      headerAlign: "left",
      align: "left",
    },
    { field: "phoneNumber", headerName: "Số điện thoại", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "emailConfirmed",
      headerName: "Xác nhận email",
      type: "Number",
      flex: 1
    },
    {
      field: "roles",
      headerName: "Vai trò",
      flex: 1,
      renderCell: ({ row: { roles } }) => {
        return (
          <Box
            width="120px"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            bgcolor={
              roles === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius={1}
          >
            {roles === "Admin" && <AdminPanelSettingsOutlined />}
            {roles === "manager" && <SecurityOutlined />}
            {roles === "User" && <LockOpenOutlined />}
            <Typography textTransform="capitalize">{roles}</Typography>
          </Box>
        );
      },
    },
    {
      field: "userStatus",
      headerName: "Trạng thái",
      flex: 1
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7169/api/User", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzMWJlNGI3NC1iMTFkLTQ2NjctYjAzNC1mNzdkNGQ0Yjg1NDkiLCJ1bmlxdWVfbmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQwODkwMTE3LCJleHAiOjE3NDE0OTQ5MTcsImlhdCI6MTc0MDg5MDExNywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE2OSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcxNjkifQ.8QfHR6XpbrggorD5HHEPozwUGkv73TItfh8WnIRRaJ4g5bvpO1hGFJ_u32hvB2iFXNVjO_5giONSF8HFqhRfMw`,
          },
        });
        const data = await response.data;
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        mt="40px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            "--DataGrid-containerBackground": "transparent",
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
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          slots={{ toolbar: GridToolbar }} // Đổi từ 'components' sang 'slots'
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />

      </Box>
    </Box>
  );
};

export default ManageUser;
