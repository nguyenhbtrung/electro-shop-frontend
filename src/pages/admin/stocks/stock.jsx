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
import { useNavigate } from "react-router-dom";
import ReplayIcon from '@mui/icons-material/Replay';
import AlertDialog from "../../../components/AlertDialog";
import InfoDialog from "../../../components/InfoDialog";
import { GetAllStocks, DeleteStock, UpdateStockStatus } from "../../../services/StockService";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControl, MenuItem, Select } from "@mui/material";
/*
- ✓ Thay cách hiện thị thông báo bằng cửa sổ component riêng chứ không dùng cửa sổ alert mặc định
- ✓ Quên mật khẩu cho user đồng thời phải có xác thực email
- ✓ Thêm hàm đổi mật khẩu cho user
- ✓ Thêm hàm đổi mật khẩu cho admin
- ✖ Quản lí nhập hàng: thêm, sửa, xoá, xem chi tiết, Data gồm có: {Id, Id sản phẩm, Số lượng, Đơn giá, Trạng thái lô, Ngày nhập, Nhà cung cấp, (Ghi chú)}
- ✖ Cho người dùng có thể có nhiều địa chỉ nhận hàng
- ✖ Chỉnh sửa, tút tát lại trang đkí, đăng nhập
- ✖ Đăng nhập với google, X ,...
*/

const ManageStock = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [selectedRows, setSelectedRows] = useState([]);
	const [stocks, setStocks] = useState([]);
	const navigate = useNavigate();
	const [response, setResponse] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogQuestion, setDialogQuestion] = useState('');
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [info, setInfo] = useState('');

	// {
	// 	"stockImportId": 3,
	// 	"stockImportName": "string",
	// 	"supplierName": "BBBBBB",
	// 	"totalPrice": 0,
	// 	"stockImportStatus": "string",
	// 	"importDate": "2025-03-15T16:15:12.254",
	// 	"createdAt": "2025-03-15T16:18:46.7961955"
	//  },

	const handleStatusChange = async (event, row) => {
		const newStatus = event.target.value;
		try {
			const response = await UpdateStockStatus(row.stockImportId, newStatus);
			if (response.status === 200) {
				const updatedStocks = stocks.map(stock =>
					stock.stockImportId === row.stockImportId ? { ...stock, stockImportStatus: newStatus } : stock
				);
				setStocks(updatedStocks);
			} else {
				if (response.data === "Invalid status transition") {
					setInfo(`Trạng thái không hợp lệ!`);
					setInfoDialogOpen(true);
				} else {
					console.error('Failed to update status');
				}
			}
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	const columns = [
		{
			field: "stockImportId",
			headerName: "Id",
			flex: 0.2,
			cellClassName: "name-column--cell",
		},
		{
			field: "stockImportName",
			headerName: "Tên lô hàng",
			flex: 1,
			cellClassName: "name-column--cell",
		},
		{
			field: "supplierName",
			headerName: "Tên nhà cung cấp",
			headerAlign: "left",
			align: "left",
			flex: 0.9,
		},
		{
			field: "totalPrice",
			headerName: "Tổng giá",
			type: "Number",
			flex: 0.7
		},
		{
			field: 'stockImportStatus',
			headerName: 'Trạng thái',
			width: 200,
			flex: 0.7,
			renderCell: (params) => (
				<FormControl fullWidth variant="filled">
					<Select
						value={params.row.stockImportStatus}
						onChange={(event) => handleStatusChange(event, params.row)}
						sx={{ minWidth: 100 }}
					>
						<MenuItem value="Pending">Chờ duyệt</MenuItem>
						<MenuItem value="Approved">Đã duyệt</MenuItem>
						<MenuItem value="Completed">Thành công</MenuItem>
						<MenuItem value="Canceled">Đã hủy</MenuItem>
						<MenuItem value="Returned">Hoàn trả</MenuItem>
					</Select>
				</FormControl>
			),
		},
		{
			field: "importDate",
			headerName: "Ngày nhập",
			flex: 0.5,
			renderCell: (params) => {
				return convertToCustomMonthDate(params.value, "vi-VN", "long");
			}
		},
		{
			field: "createdAt",
			headerName: "Ngày tạo",
			flex: 0.5,
			renderCell: (params) => {
				return convertToCustomMonthDate(params.value, "vi-VN", "long");
			}
		},
		{
			field: "actions",
			headerName: "Chi tiết",
			headerAlign: 'center',
			align: 'center',
			flex: 0.2,
			minWidth: 100,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				return (
					<IconButton
						color={colors.primary[100]}
						onClick={handleDetail(params.row)}
					>
						<VisibilityIcon />
					</IconButton>
				);
			},
		},
	];

	const handleDetail = (row) => () => {
		navigate(`/admin/stockimports/detail/${row.stockImportId}`);
	};

	const GetAllStock = async () => {
		try {
			const response = await GetAllStocks();
			const data = await response.data;
			setStocks(data);
			console.log(data);
			return response.status;
		} catch (error) {
			console.error(error);
			return error.response ? error.response.status : 500;
		}
	};

	useEffect(() => {
		GetAllStock();
	}, []);

	const handleRefresh = async () => {
		var status = await GetAllStock();
		if (status === 200) {
			setInfo(`Làm mới thành công!`);
			setInfoDialogOpen(true);
		} else {
			setInfo(`Có lỗi khi làm mới dữ liệu!`);
			setInfoDialogOpen(true);
		}
	};

	const handleAddStock = () => {
		navigate("/admin/stockimports/add");
	}

	const handleDeleteSelected = async (userResponse) => {
		setDialogOpen(false);
		if (!userResponse) {
			return;
		} else {
			try {
				for (const stockImportId of selectedRows) {
					await DeleteStock(stockImportId);
				}
				setInfo(`Đã xoá ${selectedRows.length} lô hàng!`);
				setInfoDialogOpen(true);
				GetAllStock();
			} catch (error) {
				setInfo(`Có lỗi khi xóa lô hàng!`);
				setInfoDialogOpen(true);
				console.error(error);
			}
		}
	};

	const handleDeleteDialog = () => {
		if (selectedRows.length === 0) {
			setInfo(`Vui lòng chọn lô hàng cần xoá!`);
			setInfoDialogOpen(true);
			return;
		}
		setDialogQuestion(`Bạn có chắc chắn muốn xóa ${selectedRows.length} lô hàng đã chọn?`);
		setDialogOpen(true);
	};

	const handleEditSelected = () => {
		if (selectedRows.length === 0) {
			setInfo(`Vui lòng chọn lô hàng cần chỉnh sửa!`);
			setInfoDialogOpen(true);
			return;
		} else if (selectedRows.length > 1) {
			setInfo(`Chỉ được chọn 1 lô hàng để chỉnh sửa!`);
			setInfoDialogOpen(true);
			return;
		} else {
			navigate(`/admin/stockimports/edit/${selectedRows[0]}`);
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
					title="Quản lý lô hàng"
					subtitle="Danh sách lô hàng trong hệ thống"
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
						onClick={handleAddStock}
						sx={{ color: 'text.primary' }}
					>
						Thêm lô hàng mới
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
					rows={stocks}
					columns={columns}
					getRowId={(row) => row.stockImportId}
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

export default ManageStock;
