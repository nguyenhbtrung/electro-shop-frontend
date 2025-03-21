import { Box, Button, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataContacts } from "../../../data/mockData";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { GetAllUserLatestMessages } from "../../../services/SupportMessageService";
import { useNavigate } from "react-router-dom";

const ManageChatCustomer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [userMessages, setUserMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const FetchData = async () => {
      const res = await GetAllUserLatestMessages();
      if (res?.status === 200 && res?.data) {
        setUserMessages(res?.data);
      }
    };

    FetchData();

  }, []);

  const handleResponse = (row) => {
    navigate(`/admin/chats/${row.userId}/${row.userName}`);
  }

  const columns = [
    { field: "userName", headerName: "Tên đăng nhập", flex: 1 },
    {
      field: "fullName",
      headerName: "Họ và tên",
      flex: 0.8,
    },
    {
      field: "message",
      headerName: "Tin nhắn mới",
      flex: 1.5,
      renderCell: (params) => {
        if (!params.value) {
          return "";
        }
        const content = `${params.row?.senderName}: ${params.value}`;
        return (
          <span style={{ fontWeight: params.row?.isFromAdmin ? "normal" : "bold" }}>
            {content}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 0.8,
      renderCell: (params) => {
        // Ánh xạ trạng thái sang màu sắc
        const statusColorMap = {
          pending: colors.status[300],
          approved: colors.status[100],
          processing: colors.status[200],
          completed: colors.status[100],
          rejected: colors.status[400],
        };

        const color = statusColorMap[params.value] || "inherit";
        let status = "";
        if (params.row.isFromAdmin != null && !params.row.isFromAdmin) {
          status = "Chưa phản hồi";
        }

        return (
          <span style={{ color: color, fontWeight: "bold" }}>
            {status}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: "Hành động",
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleResponse(params.row)}
          sx={{
            textTransform: "none"
          }}
        >
          Phản hồi
        </Button>
      ),
    }
  ];
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
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={userMessages}
          columns={columns}
          getRowId={(row) => row.userId}
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

export default ManageChatCustomer;
