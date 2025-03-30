import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { Edit } from "@mui/icons-material";
import { GridToolbar } from "@mui/x-data-grid";
import { convertToCustomMonthDate } from "../../../utils/formatDatetime";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import AlertDialog from "../../../components/AlertDialog";
import InfoDialog from "../../../components/InfoDialog";
import AddSupplierDialog from "../../../components/suppliers/AddSupplierDialog";
import UpdateSupplierDialog from "../../../components/suppliers/UpdateSupplierDialog";
import { AddSupplier, GetAllSuppliers, DeleteSupplier, UpdateSupplier } from "../../../services/SupplierService";

const ManageSupplier = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [selectedRows, setSelectedRows] = useState([]);
	const [suppliers, setSupplier] = useState([]);
	const [response, setResponse] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogQuestion, setDialogQuestion] = useState('');
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [info, setInfo] = useState('');
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [selectedSupplier, setSelectedSupplier] = useState(null);

	const columns = [
		{
			field: "supplierId",
			headerName: "Id",
			flex: 0.2,
			cellClassName: "name-column--cell",
		},
		{
			field: "supplierName",
			headerName: "Tên nhà cung cấp",
			flex: 1,
			cellClassName: "name-column--cell",
		},
		{
			field: "supplierAddress",
			headerName: "Địa chỉ",
			headerAlign: "left",
			align: "left",
			flex: 1
		},
		{
			field: "supplierContact",
			headerName: "Số điện thoại",
			flex: 0.7
		},
		{
			field: "createdAt",
			headerName: "Ngày tạo",
			flex: 0.5,
			renderCell: (params) => {
				return convertToCustomMonthDate(params.value, "vi-VN", "long");
			}
		},
	];

	const fetchSuppliers = async () => {
		try {
			const response = await GetAllSuppliers();
			const data = await response.data;
			setSupplier(data);
			console.log(data);
			return response.status;
		} catch (error) {
			console.error(error);
			return error.response ? error.response.status : 500;
		}
	};

	useEffect(() => {
		fetchSuppliers();
	}, []);

	const handleRefresh = async () => {
		var status = await fetchSuppliers();
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


	const handleAddDialogSubmit = async (newSupplier) => {
		console.log("New Supplier: ", newSupplier);
		const res = await AddSupplier(newSupplier);
		if (res?.status === 200 && res?.data) {
			setInfo(`Thêm nhà cung cấp thành công!`);
			setInfoDialogOpen(true);
			fetchSuppliers();
		} else {
			setInfo(`Có lỗi khi thêm nhà cung cấp!`);
			setInfoDialogOpen(true);
		}
	}

	const handleUpdateDialogSubmit = async (updatedSupplier) => {
		console.log("Updated Supplier: ", updatedSupplier);
		const res = await UpdateSupplier(updatedSupplier);
		if (res?.status === 200 && res?.data) {
			setInfo(`Cập nhật nhà cung cấp thành công!`);
			setInfoDialogOpen(true);
			fetchSuppliers();
		} else {
			setInfo(`Có lỗi khi cập nhật nhà cung cấp!`);
			setInfoDialogOpen(true);
		}
	}

	const handleDeleteSelected = async (userResponse) => {
		setDialogOpen(false);
		if (!userResponse) {
			return;
		} else {
			try {
				for (const supplierId of selectedRows) {
					await DeleteSupplier(supplierId);
				}
				setInfo(`Đã xoá ${selectedRows.length} nhà cung cấp!`);
				setInfoDialogOpen(true);
				fetchSuppliers();
			} catch (error) {
				setInfo(`Có lỗi khi xóa nhà cung cấp!`);
				setInfoDialogOpen(true);
				console.error(error);
			}
		}
	};

	const handleDeleteDialog = () => {
		if (selectedRows.length === 0) {
			setInfo(`Vui lòng chọn nhà cung cấp cần xoá!`);
			setInfoDialogOpen(true);
			return;
		}
		setDialogQuestion(`Bạn có muốn xóa ${selectedRows.length} nhà cung cấp đã chọn?`);
		setDialogOpen(true);
	};

	const handleEditSelected = () => {
		if (selectedRows.length === 0) {
			setInfo(`Vui lòng chọn nhà cung cấp cần chỉnh sửa!`);
			setInfoDialogOpen(true);
			return;
		} else if (selectedRows.length > 1) {
			setInfo(`Chỉ được chọn 1 nhà cung cấp để chỉnh sửa!`);
			setInfoDialogOpen(true);
			return;
		} else {
			const supplier = suppliers.find((supplier) => supplier.supplierId === selectedRows[0]);
			setSelectedSupplier(supplier);
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
					title="Nhà cung cấp"
					subtitle="Danh sách các nhà cung cấp"
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
						Thêm nhà cung cấp
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
					rows={suppliers}
					columns={columns}
					getRowId={(row) => row.supplierId}
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
			<AddSupplierDialog
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				onSubmit={handleAddDialogSubmit}
			/>
			<UpdateSupplierDialog
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				onSubmit={handleUpdateDialogSubmit}
				supplier={selectedSupplier}
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

export default ManageSupplier;
