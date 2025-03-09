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
import {
    CreateDiscount,
    DeleteDiscount,
    GetDiscounts,
    UpdateDiscount,
} from "../../../services/discountService";
import { convertToCustomMonthDate } from "../../../utils/formatDatetime";
import DiscountPaper from "../../../components/discounts/DiscountPaper";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import AddDiscountDialog from "../../../components/discounts/AddDiscountDiaglog";
import UpdateDiscountDialog from "../../../components/discounts/UpdateDiscountDialog";

const ManageDiscount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [discounts, setDiscounts] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    useEffect(() => {
        const GetDiscountsData = async () => {
            try {
                const res = await GetDiscounts();
                if (res?.data) {
                    setDiscounts(res.data);
                }
            } catch (error) {
                console.log("Lỗi lấy dữ liệu:", error);
            }
        };

        GetDiscountsData();
    }, []);

    // Xử lý mở dialog thêm giảm giá
    const handleAddDiscount = () => {
        setOpenAddDialog(true);
    };

    // Xử lý submit từ dialog thêm giảm giá
    const handleAddDialogSubmit = async (newDiscount) => {
        try {
            const res = await CreateDiscount(newDiscount);
            if (res?.status === 201 && res?.data) {
                alert("Thêm chương trình giảm giá thành công!");
                setDiscounts((prev) => [res.data, ...prev]);
            } else {
                console.log("Lỗi thêm:", res);
            }
        } catch (error) {
            console.log("Lỗi:", error);
        }
    };

    // Xử lý mở dialog cập nhật giảm giá
    const handleEdit = (row) => {
        setSelectedDiscount(row);
        setOpenUpdateDialog(true);
    };

    // Xử lý submit từ dialog cập nhật giảm giá
    const handleUpdateDialogSubmit = async (updatedDiscount) => {
        try {
            const res = await UpdateDiscount(updatedDiscount?.discountId, updatedDiscount);
            if (res?.status === 200 && res?.data) {
                alert("Cập nhật chương trình giảm giá thành công!");
                setDiscounts((prevDiscounts) =>
                    prevDiscounts.map((discount) =>
                        discount.discountId === updatedDiscount.discountId ? res.data : discount
                    )
                );
            } else {
                console.log("Lỗi cập nhật:", res);
            }
        } catch (error) {
            console.log("Lỗi:", error);
        }
        // console.log(">>>Check discount:", updatedDiscount);
        setOpenUpdateDialog(false);
    };

    const handleDelete = async (row) => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa chương trình giảm giá này không?"
            )
        ) {
            try {
                const res = await DeleteDiscount(row.discountId);
                if (res?.status === 204) {
                    setDiscounts((prevDiscounts) =>
                        prevDiscounts.filter(
                            (discount) => discount.discountId !== row.discountId
                        )
                    );
                } else {
                    console.log("Lỗi xóa:", res);
                }
            } catch (error) {
                console.log("Lỗi:", error);
            }
        }
    };

    const handleDeleteSelected = () => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xoá các chương trình giảm giá đã chọn?"
            )
        ) {
            setDiscounts((prevDiscounts) =>
                prevDiscounts.filter(
                    (discount) => !selectedRows.includes(discount.discountId)
                )
            );
            setSelectedRows([]);
        }
    };

    const columns = [
        {
            field: "discountId",
            headerName: "ID",
            flex: 0.5,
        },
        {
            field: "name",
            headerName: "Tên Giảm giá",
            cellClassName: "name-column--cell",
        },
        {
            field: "discountType",
            headerName: "Loại",
            flex: 1,
        },
        {
            field: "discountValue",
            headerName: "Giá trị",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 0.6,
            minWidth: 120,
            renderCell: (params) => {
                const { discountType } = params.row;
                const discountValue = params.value;
                if (
                    discountType === "Percentage" ||
                    discountType === "Flat Amount"
                ) {
                    return (
                        <DiscountPaper
                            discountType={discountType}
                            discountValue={discountValue}
                        />
                    );
                }
                return discountValue;
            },
        },
        {
            field: "startDate",
            headerName: "Ngày bắt đầu",
            flex: 1,
            renderCell: (params) => {
                return convertToCustomMonthDate(params.value, "vi-VN", "long");
            },
        },
        {
            field: "endDate",
            headerName: "Ngày kết thúc",
            flex: 1,
            renderCell: (params) => {
                return convertToCustomMonthDate(params.value, "vi-VN", "long");
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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Header
                    title="Quản lý giảm giá"
                    subtitle="Danh sách các chương trình giảm giá"
                />
                <Box display="flex" alignItems="center" gap={2}>
                    {selectedRows.length > 0 && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteSelected}
                        >
                            Xoá đã chọn
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={handleAddDiscount}
                    >
                        Thêm chương trình giảm giá
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
                    "& .name-column--cell": { color: colors.greenAccent[300] },
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
                    "& .MuiDataGrid-iconSeparator": { color: colors.primary[100] },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={discounts}
                    columns={columns}
                    getRowId={(row) => row.discountId}
                    checkboxSelection
                    selectionModel={selectedRows}
                    onRowSelectionModelChange={(ids) => {
                        setSelectedRows(ids);
                    }}
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                />
            </Box>

            {/* Dialog thêm giảm giá */}
            <AddDiscountDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddDialogSubmit}
            />

            {/* Dialog cập nhật giảm giá */}
            <UpdateDiscountDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                onSubmit={handleUpdateDialogSubmit}
                discount={selectedDiscount}
            />
        </Box>
    );
};

export default ManageDiscount;
