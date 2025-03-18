import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { Edit } from "@mui/icons-material";
import { GridToolbar } from "@mui/x-data-grid";
import { GetAllUsers, DeleteUser } from "../../../services/UserService";
import { convertToCustomMonthDate } from "../../../utils/formatDatetime";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import ReplayIcon from '@mui/icons-material/Replay';
import AlertDialog from "../../../components/AlertDialog";
import InfoDialog from "../../../components/InfoDialog";

/*
- ✓ Thay cách hiện thị thông báo bằng cửa sổ component riêng chứ không dùng cửa sổ alert mặc định
- ✓ Quên mật khẩu cho user đồng thời phải có xác thực email
- ✓ Thêm hàm đổi mật khẩu cho user
- ✓ Thêm hàm đổi mật khẩu cho admin
- ✖ Thêm nút đổi mật khẩu cho user. Khi click vào nút này, hiện ra cửa sổ dialog để nhập mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới.
- ✖ Quản lí nhập hàng: thêm, sửa, xoá, xem chi tiết, Data gồm có: {Id, Id sản phẩm, Số lượng, Đơn giá, Trạng thái lô, Ngày nhập, Nhà cung cấp, (Ghi chú)}
- ✖ Làm trang quên mật khẩu, đổi mật khẩu khi quên, đổi mật khẩu bình thường, xác thực email.
- ✖ Cho người dùng có thể có nhiều địa chỉ nhận hàng
- ✖ Chỉnh sửa, tút tát lại trang đkí, đăng nhập
- ✖ Đăng nhập với google, X ,...
*/

const ManageUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedRows, setSelectedRows] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQuestion, setDialogQuestion] = useState('');
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [info, setInfo] = useState('');

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
        const roleText = roles === "Admin" ? "Quản lý" : "Người dùng";
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
            {roles === "Admin" && <SecurityIcon />}
            {roles === "User" && <PersonIcon />}
            <Typography textTransform="capitalize">{roleText}</Typography>
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
      flex: 1,
      renderCell: (params) => {
        return convertToCustomMonthDate(params.value, "vi-VN", "long");
      }
    },
  ];

  const GetAllUser = async () => {
    try {
      const response = await GetAllUsers();
      const data = await response.data;
      setUsers(data);
      console.log(data);
      return response.status;
    } catch (error) {
      console.error(error);
      return error.response ? error.response.status : 500;
    }
  };

  useEffect(() => {
    GetAllUser();
  }, []);

  const handleRefresh = async () => {
    var status = await GetAllUser();
    if (status === 200) {
      setInfo(`Làm mới thành công!`);
      setInfoDialogOpen(true);
    } else {
      setInfo(`Có lỗi khi làm mới dữ liệu!`);
      setInfoDialogOpen(true);
    }
  };

  const handleAddUser = () => {
    navigate("/admin/users/add");
  }

  const handleDeleteSelected = async (userResponse) => {
    setDialogOpen(false);
    if (!userResponse) {
      return;
    } else {
      try {
        for (const userName of selectedRows) {
          await DeleteUser(userName);
        }
        setInfo(`Đã xoá ${selectedRows.length} người dùng!`);
        setInfoDialogOpen(true);
        GetAllUser();
      } catch (error) {
        setInfo(`Có lỗi khi xóa người dùng!`);
        setInfoDialogOpen(true);
        console.error(error);
      }
    }
  };

  const handleDeleteDialog = () => {
    if (selectedRows.length === 0) {
      setInfo(`Vui lòng chọn người dùng cần xoá!`);
      setInfoDialogOpen(true);
      return;
    }
    setDialogQuestion(`Bạn có muốn xóa ${selectedRows.length} người dùng đã chọn?`);
    setDialogOpen(true);
  };

  const handleEditSelected = () => {
    if (selectedRows.length === 0) {
      setInfo(`Vui lòng chọn người dùng cần chỉnh sửa!`);
      setInfoDialogOpen(true);
      return;
    } else if (selectedRows.length > 1) {
      setInfo(`Chỉ được chọn 1 người dùng để chỉnh sửa!`);
      setInfoDialogOpen(true);
      return;
    } else {
      navigate(`/admin/users/edit/${selectedRows[0]}`);
    }
  }

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
  }

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        marginBottom={0}
      >
        <Header
          title="Người dùng"
          subtitle="Danh sách người dùng trong hệ thống"
        />
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            color="info"
            startIcon={<ReplayIcon />}
            onClick={handleRefresh}
            sx={{ color: 'text.primary' }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ color: 'text.primary' }}
          >
            Thêm người dùng
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Edit />}
            onClick={handleEditSelected}
            sx={{ color: 'text.primary' }}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteDialog}
            sx={{ color: 'text.primary' }}
          >
            Xoá đã chọn
          </Button>
        </Box>
      </Box>
      <Box
        mt="0px"
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
            color: colors.greenAccent[0],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[500],
            "--DataGrid-containerBackground": "transparent",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[600],
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
          getRowId={(row) => row.userName}
          onRowSelectionModelChange={(ids) => {
            console.log("Selected rows: ", ids);
            setSelectedRows(ids);
          }}
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
      <AlertDialog
        open={dialogOpen}
        question={dialogQuestion}
        onClose={handleDeleteSelected}
      />
      <InfoDialog
        open={infoDialogOpen}
        question={info}
        onClose={closeInfoDialog}
      />
    </Box>
  );
};

export default ManageUser;
