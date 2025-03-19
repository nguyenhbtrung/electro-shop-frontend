import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { GetAllReturns } from "../../../services/returnService";
import { convertToLocaleDateString } from "../../../utils/formatDatetime";
import { MapMethod, MapStatus } from "../../../utils/returnHelper";

const ManageReturn = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [returns, setReturns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    // State cho các bộ lọc 
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterMethod, setFilterMethod] = useState("all");

    // Sử dụng useEffect để tải dữ liệu khi component mounted
    useEffect(() => {
        const GetReturns = async () => {
            const res = await GetAllReturns();
            if (res?.status === 200 && res?.data) {
                setReturns(res.data);
            } else {
                alert("Có lỗi xảy ra");
            }
        };

        GetReturns();
    }, []);

    // Hàm xử lý chuyển trang xem chi tiết
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
            renderCell: (params) => `Order ID: ${params.value}`,
        },
        {
            field: "timeStamp",
            headerName: "Ngày gửi",
            flex: 1,
            renderCell: (params) => convertToLocaleDateString(params.value),
        },
        {
            field: "returnMethod",
            headerName: "PT xử lý",
            flex: 1,
            renderCell: (params) => MapMethod(params.value),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1,
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
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleView(params.row)}
                >
                    Xem
                </Button>
            ),
        },
    ];

    // Lọc dữ liệu theo trạng thái và phương thức xử lý
    const filteredReturns = returns.filter((item) => {
        const matchesStatus = filterStatus === "all" || item.status === filterStatus;
        const matchesMethod = filterMethod === "all" || item.returnMethod === filterMethod;
        return matchesStatus && matchesMethod;
    });

    return (
        <Box m="20px">
            {/* Header và bộ lọc nằm trên cùng 1 hàng */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Header title="Quản lý hoàn trả" subtitle="Danh sách các yêu cầu hoàn trả" />
                <Box display="flex" gap={2} alignItems="center">
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            label="Trạng thái"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="pending">Chờ xử lý</MenuItem>
                            <MenuItem value="approved">Đã phê duyệt</MenuItem>
                            <MenuItem value="processing">Đang xử lý hoàn trả</MenuItem>
                            <MenuItem value="completed">Hoàn tất</MenuItem>
                            <MenuItem value="rejected">Từ chối</MenuItem>
                            <MenuItem value="canceled">Đã huỷ bỏ</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Phương thức</InputLabel>
                        <Select
                            label="Phương thức"
                            value={filterMethod}
                            onChange={(e) => setFilterMethod(e.target.value)}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="refund">Hoàn tiền</MenuItem>
                            <MenuItem value="exchange">Đổi hàng</MenuItem>
                            <MenuItem value="repair">Sửa chữa</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setFilterStatus("all");
                            setFilterMethod("all");
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Box>
            </Box>

            <Box
                mt="10px"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { border: "none" },
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
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={filteredReturns}
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
