import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DeleteReturnReason, GetAllReturnReason, CreateReturnReason, UpdateReturnReason } from "../../../services/reasonService";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton } from "@mui/material";
import { Header } from "../../../components";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AddReasonDialog from "../../../components/reasons/AddReasonDialog";
import UpdateReasonDialog from "../../../components/reasons/UpdateReasonDialog";

const ManageReason = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [reasons, setReasons] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

    const fetchReasons = async () => {
        try {
            const res = await GetAllReturnReason();
            if (res?.data) {
                console.log(">>>Reasons: ", res.data);
                const reasonsWithId = res.data.map((reason, index) => ({
                    ...reason,
                    reasonId: reason.reasonId || index,
                }));
                setReasons(reasonsWithId);
            } else {
                console.log(">>>No data received from API");
            }
        } catch (error) {
            console.log(">>>Error fetching reasons", error);
        }
    };

    useEffect(() => {
        fetchReasons();
    }, []);

    const handleAddReason = () => {
        setOpenAddDialog(true);
    };

    const handleAddDialogSubmit = async (newReason) => {
        try {
            const res = await CreateReturnReason(newReason);
            if (res?.status === 200) {
                alert("Thêm lý do hoàn trả thành công!");
                // Thêm lý do mới vào đầu danh sách
                setReasons((prev) => [res.data, ...prev]);
                setOpenAddDialog(false);
            } else {
                console.log(">>>Error creating reason:", res);
            }
        } catch (error) {
            console.log(">>>Error creating reason:", error);
        }
    };

    const handleEdit = (row) => {
        setSelectedReason(row);
        setOpenEditDialog(true);
    };

    const handleEditDialogSubmit = async (updatedReason) => {
        try {
            const res = await UpdateReturnReason(selectedReason.reasonId, updatedReason);
            if (res?.status === 200 && res?.data) {
                alert("Cập nhật lý do hoàn trả thành công!");
                fetchReasons();
                setOpenEditDialog(false);
            } else {
                console.log(">>>Error updating reason:", res);
            }
        } catch (error) {
            console.log(">>>Error updating reason:", error);
        }
    };

    const handleDeleteSelected = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa lý do hoàn trả này không?")) {
            console.log("Delete reason: ", row?.reasonId);
            try {
                const res = await DeleteReturnReason(row?.reasonId);
                if (res?.status === 200 || res?.status === 204) {
                    setReasons((prevReasons) =>
                        prevReasons.filter((reason) => reason.reasonId !== row.reasonId)
                    );
                    alert("Xóa lý do hoàn trả thành công!");
                } else {
                    console.log(">>>Error deleting reason:", res);
                }
            } catch (error) {
                console.log(">>>Error deleting reason:", error);
            }
        }
    };

    const handleDeleteSelectedRows = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa các lý do hoàn trả đã chọn không?")) {
            try {
                for (const reasonId of selectedRows) {
                    const res = await DeleteReturnReason(reasonId);
                    if (res?.status !== 200 && res?.status !== 204) {
                        console.log(">>>Error deleting reason:", res);
                    }
                }
                setReasons((prevReasons) =>
                    prevReasons.filter((reason) => !selectedRows.includes(reason.reasonId))
                );
                setSelectedRows([]);
                alert("Xóa các lý do hoàn trả đã chọn thành công!");
            } catch (error) {
                console.log(">>>Error deleting selected reasons:", error);
            }
        }
    };

    const columns = [
        {
            field: "reasonId",
            headerName: "ID Lý do hoàn trả",
            flex: 0.5,
        },
        {
            field: "name",
            headerName: "Nội dung lý do hoàn trả",
            type: "string",
            flex: 1,
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
                        <IconButton color={colors.primary[100]} onClick={() => handleEdit(params.row)}>
                            <EditIcon />
                        </IconButton>
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
                <Header title="Quản lý lý do hoàn trả" subtitle="Danh sách lý do hoàn trả" />
                <Box display="flex" alignItems="center" gap={2}>
                    <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddReason}>
                        Thêm mẫu lý do hoàn trả
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteSelectedRows}>
                        Xóa đã chọn
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
                }}
            >
                <DataGrid
                    rows={reasons}
                    columns={columns}
                    getRowId={(row) => row.reasonId}
                    checkboxSelection
                    selectionModel={selectedRows}
                    onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                />
            </Box>

            <AddReasonDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddDialogSubmit}
            />

            <UpdateReasonDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                onSubmit={handleEditDialogSubmit}
                reason={selectedReason}
            />
        </Box>
    );
};

export default ManageReason;