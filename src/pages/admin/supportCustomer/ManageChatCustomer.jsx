import { Box, Button, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataContacts } from "../../../data/mockData";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { GetAllUserLatestMessages } from "../../../services/SupportMessageService";
import { useNavigate } from "react-router-dom";
import adminSignalRService from "../../../services/signalR/adminSignalRService";

const ManageChatCustomer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const adminId = localStorage.getItem("userId");

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

  useEffect(() => {
    // Mở kết nối khi component được mount
    adminSignalRService.startConnection();

    // Lắng nghe sự kiện "ReceiveMessage"
    adminSignalRService.connection.on("ReceiveUserMessage", (userId, message, userName) => {
      setUserMessages((prevMessages) =>
        prevMessages.some((m) => m.userId === userId)
          ? prevMessages.map((m) =>
            m.userId === userId ? { ...m, message, senderName: userName, isFromAdmin: false } : m
          )
          : [...prevMessages, { userId, message, senderName: userName, isFromAdmin: false }]
      );
    });

    adminSignalRService.connection.on("ReceiveAdminMessage", (message, userId, adminName) => {
      setUserMessages((prevMessages) =>
        prevMessages.some((m) => m.userId === userId)
          ? prevMessages.map((m) =>
            m.userId === userId ? { ...m, message, senderName: adminName, isFromAdmin: true } : m
          )
          : [...prevMessages, { userId, message, senderName: adminName, isFromAdmin: true }]
      );
    });

    adminSignalRService.connection.on("ConversationClaimed", (userId, adminId) => {
      setUserMessages((prevMessages) =>
        prevMessages.some((m) => m.userId === userId)
          ? prevMessages.map((m) =>
            m.userId === userId ? { ...m, adminId } : m
          )
          : [...prevMessages, { userId, adminId }]
      );
    });

    adminSignalRService.connection.on("ConversationReleased", (userId, adminId) => {
      setUserMessages((prevMessages) =>
        prevMessages.some((m) => m.userId === userId)
          ? prevMessages.map((m) =>
            m.userId === userId ? { ...m, adminId: null } : m
          )
          : [...prevMessages, { userId, adminId: null }]
      );
    });


    // Dọn dẹp listener khi component unmount
    return () => {
      adminSignalRService.connection.off("ReceiveUserMessage");
      adminSignalRService.connection.off("ReceiveAdminMessage");
    };
  }, []);

  const handleResponse = (row) => {
    adminSignalRService.claimConversation(row.userId);
    navigate(`/admin/chats/${row.userId}/${row.userName}`);
  };

  const buttonStyle = {
    textTransform: "none",
    minWidth: 80, // sizing theo pixel hoặc "100%" nếu muốn full width trong cell
  };

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
          1: colors.status[300],
          2: colors.status[100],
          3: colors.status[200],
          4: colors.status[100],
          5: colors.status[400],
        };

        let statusText = "";
        let status = 0;
        if (params.row.isFromAdmin != null && !params.row.isFromAdmin) {
          statusText = "Chưa phản hồi";
          status = 1;
        }
        if (params.row.adminId && params.row.adminId != adminId) {
          statusText = "Admin khác đang phản hồi";
          status = 3;
        }

        const color = statusColorMap[status] || "inherit";
        return (
          <span style={{ color: color, fontWeight: "bold" }}>
            {statusText}
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
      renderCell: (params) => {
        // if (adminId && params.row.adminId === adminId) {
        //   return (
        //     <Box>
        //       <Button
        //         variant="contained"
        //         color="error"
        //         onClick={() => handleResponse(params.row)}
        //         sx={buttonStyle}
        //       >
        //         Kết thúc
        //       </Button>
        //       <Button
        //         variant="contained"
        //         color="info"
        //         disabled={params.row.adminId}
        //         onClick={() => handleResponse(params.row)}
        //         sx={buttonStyle}
        //       >
        //         Phản hồi
        //       </Button>
        //     </Box>
        //   );
        // }
        if (params.row.isFromAdmin != null && !params.row.isFromAdmin) {
          return (
            <Button
              variant="contained"
              color="info"
              disabled={params.row.adminId && params.row.adminId !== adminId}
              onClick={() => handleResponse(params.row)}
              sx={buttonStyle}
            >
              Phản hồi
            </Button>
          );
        }
        return (
          <Button
            variant="contained"
            color="secondary"
            disabled={params.row.adminId && params.row.adminId !== adminId}
            onClick={() => handleResponse(params.row)}
            sx={buttonStyle}
          >
            Gửi
          </Button>
        );
      },
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
