import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { GetAllReturns } from "../../../services/returnService";
import { convertToLocaleDateString } from "../../../utils/formatDatetime";
import { MapMethod, MapStatus } from "../../../utils/returnHelper";

// Mock data cho bảng danh sách yêu cầu hoàn trả
const mockReturnRequests = [
    {
        returnId: "RETURN#1234",
        orderId: "ORDER#5678",
        timeStamp: "20/10/2023",
        returnMethod: "Hoàn tiền",
        status: "Chờ xử lý",
    },
    {
        returnId: "RETURN#1235",
        orderId: "ORDER#6789",
        timeStamp: "18/10/2023",
        returnMethod: "Đổi hàng",
        status: "Đã phê duyệt",
    },
    {
        returnId: "RETURN#1236",
        orderId: "ORDER#7890",
        timeStamp: "15/10/2023",
        returnMethod: "Sửa chữa",
        status: "Đang xử lý",
    },
];

const ManageReturn = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [returns, setReturns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    useState(() => {
        const GetReturns = async () => {
            const res = await GetAllReturns();
            if (res?.status === 200 && res?.data) {
                setReturns(res?.data);
            } else {
                alert('Có lỗi xảy ra');
            }
        };

        GetReturns();
    }, []);

    // Hàm xử lý khi người dùng bấm nút "Xem"
    const handleView = (row) => {
        navigate(`/admin/returns/detail/${row.returnId}`);
    };

    const columns = [
        {
            field: "returnId",
            headerName: "Mã yêu cầu",
            flex: 1,
        },
        {
            field: "orderId",
            headerName: "Đơn hàng liên quan",
            flex: 1,
            renderCell: (params) => {
                return `Order ID: ${params.value}`
            },
        },
        {
            field: "timeStamp",
            headerName: "Ngày gửi",
            flex: 1,
            renderCell: (params) => {
                return convertToLocaleDateString(params.value);
            },
        },
        {
            field: "returnMethod",
            headerName: "PT xử lý",
            flex: 1,
            renderCell: (params) => {
                return MapMethod(params.value);
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1,
            renderCell: (params) => {
                // Ánh xạ trạng thái (status) sang màu sắc
                const statusColorMap = {
                    pending: colors.status[300],
                    approved: colors.status[100],
                    processing: colors.status[200],
                    completed: colors.status[100],
                    rejected: colors.status[400],
                };

                // Lấy màu tương ứng với giá trị status (nếu không có thì dùng mặc định)
                const color = statusColorMap[params.value] || "inherit";

                return (
                    <span style={{ color: color, fontWeight: "bold" }}>
                        {MapStatus(params.value)}
                    </span>
                );
            },
        },
        {
            field: "actions",
            headerName: "Hành động",
            flex: 0.8,
            minWidth: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleView(params.row)}
                    >
                        Xem
                    </Button>
                );
            },
        },
    ];

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Header
                    title="Quản lý hoàn trả"
                    subtitle="Danh sách các yêu cầu hoàn trả"
                />
            </Box>
            <Box
                mt="10px"
                height="75vh"
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
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={returns}
                    columns={columns}
                    getRowId={(row) => row.returnId}
                    checkboxSelection
                    selectionModel={selectedRows}
                    onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                />
            </Box>
        </Box>
    );
};

export default ManageReturn;
