import React, { useState, useEffect } from "react";
import { Box, Button, Hidden, IconButton, useTheme } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { DeleteRating, GetAllRating } from "../../../services/ratingService";
import DeleteIcon from "@mui/icons-material/Delete";

const convertToCustomMonthDate = (dateString, locale, format) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { month: format, day: 'numeric', year: 'numeric' });
};

const ManageRating = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [ratings, setRatings] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const fetchRatings = async () => {
        try {
            const res = await GetAllRating();
            if (res?.data) {
                console.log(">>>Ratings: ", res.data);
                const ratingsWithId = res.data.map((rating, index) => ({
                    ...rating,
                    ratingId: rating.ratingId || index,
                }));
                setRatings(ratingsWithId);
            }
        } catch (error) {
            console.log(">>>Error fetching ratings", error);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    const handleDeleteSelected = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
            console.log("Delete rating: ", row?.productId);
            try {
                const res = await DeleteRating(row?.productId);
                if (res?.status === 200 || res?.status === 204) {
                    setRatings((prevRatings) =>
                        prevRatings.filter((rating) => rating.ratingId !== row.ratingId)
                    );
                    alert("Xóa đánh giá thành công!");
                } else {
                    console.log(">>>Error deleting rating:", res);
                }
            } catch (error) {
                console.log(">>>Error deleting rating:", error);
            }
        }
    };

    const columns = [
        {
            field: "productId",
            headerName: "ID sản phẩm",
            flex: 0.5,
        },
        {
            field: "userId",
            headerName: "ID người dùng",
            flex: 0.5,
        },
        {
            field: "ratingScore",
            headerName: "Số sao",
            flex: 0.5,
        },
        {
            field: "ratingContent",
            headerName: "Nội dung",
            type: "string",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1,
        },
        {
            field: "timeStamp",
            headerName: "Thời gian",
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
                        <IconButton color={colors.primary[100]} onClick={() => handleDeleteSelected(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Header title="Quản lý đánh giá" subtitle="Danh sách đánh giá" />
            </Box>

            <Box
                mt="10px"
                height="75vh"
                maxWidth="100%"
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
                }}
            >
                <DataGrid
                    rows={ratings}
                    columns={columns}
                    getRowId={(row) => row.ratingId}
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

export default ManageRating;