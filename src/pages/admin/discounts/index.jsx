import { Box, Button, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { GetDiscounts } from "../../../services/discountService";
import { convertToCustomMonthDate } from "../../../utils/formatDatetime";
import DiscountPaper from "../../../components/discounts/DiscountPaper";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const ManageDiscount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [discounts, setDiscounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const GetDiscountsData = async () => {
            try {
                const res = await GetDiscounts();
                if (res?.data) {
                    console.log(">>>Check res", res.data);
                    setDiscounts(res.data);
                }
            } catch (error) {
                console.log(">>>Check err", error);
            }
        };

        GetDiscountsData();
    }, []);

    const handleAddDiscount = () => {
        // Điều hướng tới trang thêm chương trình giảm giá.
        navigate("/discounts/add");
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

                if (discountType === "Percentage" || discountType === "Flat Amount") {
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
    ];

    return (
        <Box m="20px">
            {/* Bọc header và nút trong cùng một container Flex */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Header
                    title="Quản lý giảm giá"
                    subtitle="Danh sách các chương trình giảm giá"
                />
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={handleAddDiscount}
                >
                    Thêm chương trình giảm giá
                </Button>
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
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    checkboxSelection
                />
            </Box>
        </Box>
    );
};

export default ManageDiscount;
