import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { Edit } from "@mui/icons-material";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import AlertDialog from "../../../components/AlertDialog";
import InfoDialog from "../../../components/InfoDialog";
import AddBannerDialog from "../../../components/banners/AddBannerDialog";
import UpdateBannerDialog from "../../../components/banners/UpdateBannerDialog";
import { AddBanner, DeleteBanner, GetAllBanners, UpdateBanner } from "../../../services/BannerService";

const ManageBanner = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selectedRows, setSelectedRows] = useState([]);
    const [banners, setBanners] = useState([]);
    const [response, setResponse] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogQuestion, setDialogQuestion] = useState('');
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [info, setInfo] = useState('');
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);

    const columns = [
        {
            field: "bannerId",
            headerName: "Id",
            flex: 0.2,
            cellClassName: "name-column--cell",
        },
        {
            field: "title",
            headerName: "Tên biểu ngữ",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "imageUrl",
            headerName: "Hình ảnh",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params) => (
                <img
                    src={params.value || '/NoImageAvailable.jpg'}
                    alt="public\NoImageAvailable.jpg"
                    style={{ width: '100%', height: '100%', maxHeight: '100px', objectFit: 'contain' }}
                />
            ),
        },
        {
            field: "link",
            headerName: "Liên kết",
            flex: 0.7
        },
        {
            field: "position",
            headerName: "Vị trí",
            flex: 0.5,
        },
    ];

    const fetchBanners = async () => {
        try {
            const response = await GetAllBanners();
            const data = await response.data;
            setBanners(data);
            console.log(data);
            return response.status;
        } catch (error) {
            console.error(error);
            return error.response ? error.response.status : 500;
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleRefresh = async () => {
        var status = await fetchBanners();
        if (status === 200) {
            setInfo(`Làm mới thành công!`);
            setInfoDialogOpen(true);
        } else {
            setInfo(`Có lỗi khi làm mới dữ liệu!`);
            setInfoDialogOpen(true);
        }
    }

    const handleAddSupplier = () => {
        setOpenAddDialog(true);
    }


    const handleAddDialogSubmit = async (newBanner) => {
        console.log("New Banner: ", newBanner);
        const res = await AddBanner(newBanner);
        if (res?.status === 200 && res?.data) {
            setInfo(`Thêm biểu ngữ thành công!`);
            setInfoDialogOpen(true);
            fetchBanners();
        } else {
            setInfo(`Có lỗi khi thêm biểu ngữ!`);
            setInfoDialogOpen(true);
        }
    }

    const handleUpdateDialogSubmit = async (updatedBanner) => {
        console.log("Updated Banner: ", updatedBanner);
        const res = await UpdateBanner(updatedBanner);
        if (res?.status === 200 && res?.data) {
            setInfo(`Cập nhật biểu ngữ thành công!`);
            setInfoDialogOpen(true);
            fetchBanners();
        } else {
            setInfo(`Có lỗi khi cập nhật biểu ngữ!`);
            setInfoDialogOpen(true);
        }
    }

    const handleDeleteSelected = async (userResponse) => {
        setDialogOpen(false);
        if (!userResponse) {
            return;
        } else {
            try {
                for (const bannerId of selectedRows) {
                    await DeleteBanner(bannerId);
                }
                setInfo(`Đã xoá ${selectedRows.length} biểu ngữ!`);
                setInfoDialogOpen(true);
                fetchBanners();
            } catch (error) {
                setInfo(`Có lỗi khi xóa biểu ngữ!`);
                setInfoDialogOpen(true);
                console.error(error);
            }
        }
    };

    const handleDeleteDialog = () => {
        if (selectedRows.length === 0) {
            setInfo(`Vui lòng chọn biểu ngữ cần xoá!`);
            setInfoDialogOpen(true);
            return;
        }
        setDialogQuestion(`Bạn có muốn xóa ${selectedRows.length} biểu ngữ đã chọn?`);
        setDialogOpen(true);
    };

    const handleEditSelected = () => {
        if (selectedRows.length === 0) {
            setInfo(`Vui lòng chọn biểu ngữ cần chỉnh sửa!`);
            setInfoDialogOpen(true);
            return;
        } else if (selectedRows.length > 1) {
            setInfo(`Chỉ được chọn 1 biểu ngữ để chỉnh sửa!`);
            setInfoDialogOpen(true);
            return;
        } else {
            const banner = banners.find((banner) => banner.bannerId === selectedRows[0]);
            setSelectedBanner(banner);
            setOpenUpdateDialog(true);
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
                    title="Banners"
                    subtitle="Danh sách các biểu ngữ"
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
                        onClick={handleAddSupplier}
                        sx={{ color: 'text.primary' }}
                    >
                        Thêm biểu ngữ
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
                    rows={banners}
                    columns={columns}
                    getRowId={(row) => row.bannerId}
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
            <AddBannerDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddDialogSubmit}
            />
            <UpdateBannerDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                onSubmit={handleUpdateDialogSubmit}
                banner={selectedBanner}
            />
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

export default ManageBanner;
