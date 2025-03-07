import { Box, useTheme, Paper, Typography } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { GetDiscounts } from "../../../services/discountService";

const DiscountPaper = ({ discountType, discountValue }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getPaperStyle = (type) => {
        if (type === "Percentage") {
            return { backgroundColor: colors.orange || "#FFA500" };
        }
        if (type === "Flat Amount") {
            return { backgroundColor: colors.red || "#FF0000" };
        }
        return {};
    };

    const getPaperContent = (type, value) => {
        if (type === "Percentage") {
            return `-${value}%`;
        }
        if (type === "Flat Amount") {
            return `-${value}đ`;
        }
        return value;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                ...getPaperStyle(discountType),
                borderRadius: "5px",
                padding: "5px 10px",
                display: "inline-block",
                minWidth: "60px",
                textAlign: "center",
            }}
        >
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold" }}>
                {getPaperContent(discountType, discountValue)}
            </Typography>
        </Paper>
    );
};

const ManageDiscount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [discounts, setDiscounts] = useState([]);

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
        }
        ,
        {
            field: "startDate",
            headerName: "Ngày bắt đầu",
            flex: 1,
        },
        {
            field: "endDate",
            headerName: "Ngày kết thúc",
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            <Header
                title="Quản lý giảm giá"
                subtitle="Danh sách các chương trình giảm giá"
            />
            <Box
                mt="40px"
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
