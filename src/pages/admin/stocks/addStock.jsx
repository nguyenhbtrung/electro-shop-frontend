import React, { useEffect, useState } from "react";
import { Box, Button, TextField, useMediaQuery, FormControl, InputLabel, Select, MenuItem, IconButton, Autocomplete } from "@mui/material";
import { Header } from "../../../components";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import InfoDialog from "../../../components/InfoDialog";
import AlertDialog from "../../../components/AlertDialog";
import { GetAllSuppliers } from "../../../services/SupplierService";
import { GetAllProduct } from "../../../services/productService";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { AddStock } from "../../../services/StockService";

const initialValues = {
	stockImportName: "",
	stockImportStatus: "",
	totalPrice: 0,
	supplierId: null,
	stockImportItems: [{ productId: null, quantity: '', unitPrice: '' }],
};

const checkoutSchema = yup.object().shape({
	stockImportName: yup.string().required('Tên đăng nhập là bắt buộc'),
	supplierId: yup.number().required("Nhà cung cấp là bắt buộc"),
	stockImportItems: yup.array().of(
		yup.object().shape({
			productId: yup.number().required('Sản phẩm là bắt buộc'),
			quantity: yup.number().min(0, 'Số lượng không thể âm').required('Số lượng là bắt buộc'),
			unitPrice: yup.number().min(0, 'Đơn giá không thể âm').required('Đơn giá là bắt buộc'),
		})
	),
});

const AddStockForm = () => {
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const navigate = useNavigate();
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [info, setInfo] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogQuestion, setDialogQuestion] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [suppliers, setSuppliers] = useState([]);
	const [selectedSupplier, setSelectedSupplier] = useState(null);
	const [products, setProducts] = useState([]);

	const handleFormSubmit = async (values) => {
		console.log("Form values:", values);
		const response = await AddStock(values);
		console.log("AAA", response);
		if (response.status === 200) {
			setInfo(`Thêm lô hàng thành công!`);
			setInfoDialogOpen(true);
			setIsSuccess(true);
		} else {
			displayError(response.data[0].code);
		}
	};

	const fetchSuppliers = async () => {
		try {
			const response = await GetAllSuppliers();
			const data = await response.data;
			setSuppliers(data);
			console.log(data);
			return response.status;
		} catch (error) {
			console.error(error);
			return error.response ? error.response.status : 500;
		}
	};

	const fetchProducts = async () => {
		try {
			const response = await GetAllProduct();
			const data = await response.data;
			console.log("Products:", data);
			setProducts(data);
			return response.status;
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchSuppliers();
		fetchProducts();
	}, []);

	const closeInfoDialog = () => {
		setInfoDialogOpen(false);
		if (isSuccess) {
			navigate("/admin/stockimports");
		}
	}

	const handleOpenDialog = () => {
		setDialogQuestion("Bạn có chắc chắn muốn hủy bỏ việc thêm lô hàng mới?");
		setDialogOpen(true);
	};

	const displayError = (error) => {
		setInfo("Đã có lỗi không xác định xảy ra!");
		setInfoDialogOpen(true);
	};

	const handleCancel = async (userResponse) => {
		if (!userResponse) {
			setDialogOpen(false);
			return;
		}
		navigate("/admin/stockimports");
	};

	return (
		<Box m="20px">
			<Header title="Thêm lô hàng mới" subtitle="Thêm lô hàng mới cho cửa hàng." />
			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues}
				validationSchema={checkoutSchema}
			>
				{({
					values,
					errors,
					touched,
					handleBlur,
					handleChange,
					handleSubmit,
					setFieldValue,
				}) => {
					useEffect(() => {
						// Calculate total price whenever stockImportItems change
						const totalPrice = values.stockImportItems.reduce((total, item) => {
							const quantity = parseFloat(item.quantity) || 0;
							const price = parseFloat(item.unitPrice) || 0;
							return total + (quantity * price);
						}, 0);
						setFieldValue('totalPrice', totalPrice);
					}, [values.stockImportItems, setFieldValue]);

					return (
						<form onSubmit={handleSubmit}>
							<Box
								display="grid"
								gap="30px"
								gridTemplateColumns="repeat(10, minmax(0, 1fr))"
								sx={{
									"& > div": {
										gridColumn: isNonMobile ? undefined : "span 4",
									},
								}}
							>
								<TextField
									fullWidth
									variant="filled"
									type="text"
									label="Tên lô hàng"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.stockImportName}
									name="stockImportName"
									error={touched.stockImportName && errors.stockImportName}
									helperText={touched.stockImportName && errors.stockImportName}
									sx={{
										gridColumn: "span 10",
									}}
								/>
								<Autocomplete
									sx={{
										gridColumn: "span 10",
									}}
									options={suppliers}
									getOptionLabel={(option) => option.supplierName || "No Name"}
									onChange={(event, newValue) => {
										setSelectedSupplier(newValue);
										setFieldValue("supplierId", newValue ? newValue.supplierId : null);

									}}
									value={selectedSupplier}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Nhà cung cấp"
											variant="filled"
											fullWidth
											error={touched.supplierId && Boolean(errors.supplierId)}
											helperText={touched.supplierId && errors.supplierId}
										/>
									)}
								/>
								<TextField
									fullWidth
									variant="filled"
									type="text"
									label="Tổng giá"
									onBlur={handleBlur}
									onChange={handleChange}
									disabled
									value={values.totalPrice}
									name="totalPrice"
									error={touched.totalPrice && errors.totalPrice}
									helperText={touched.totalPrice && errors.totalPrice}
									sx={{ gridColumn: "span 10" }}
								/>
								{/* <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 5" }}>
									<InputLabel>Trạng thái</InputLabel>
									<Select
										label="Trạng thái"
										name="stockImportStatus"
										value={values.stockImportStatus}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.stockImportStatus && Boolean(errors.stockImportStatus)}
									>
										<MenuItem value="pending">Chờ duyệt</MenuItem>
										<MenuItem value="approved">Đã duyệt</MenuItem>
										<MenuItem value="completed">Thành công</MenuItem>
										<MenuItem value="canceled">Đã hủy</MenuItem>
										<MenuItem value="returned">Hoàn trả</MenuItem>
									</Select>
									{touched.stockImportStatus && errors.stockImportStatus && (
										<Box color="error.main" mt={1}>
											{errors.stockImportStatus}
										</Box>
									)}
								</FormControl> */}
								<FieldArray name="stockImportItems">
									{({ push, remove }) => (
										<>
											{values.stockImportItems.map((product, index) => (
												<React.Fragment key={index}>
													<Autocomplete
														options={products}
														getOptionLabel={(option) => option.name || "No Name"}
														onChange={(event, newValue) => {
															setFieldValue(`stockImportItems[${index}].productId`, newValue ? newValue.productId : null);
														}}
														value={products.find(p => p.productId === product.productId) || null}
														renderInput={(params) => (
															<TextField
																{...params}
																label="Sản phẩm"
																variant="filled"
																fullWidth
																error={touched.stockImportItems?.[index]?.productId && Boolean(errors.stockImportItems?.[index]?.productId)}
																helperText={touched.stockImportItems?.[index]?.productId && errors.stockImportItems?.[index]?.productId}
															/>
														)}
														sx={{
															gridColumn: "span 5",
														}}
													/>
													<TextField
														fullWidth
														variant="filled"
														type="number"
														label="Số lượng"
														onBlur={handleBlur}
														onChange={handleChange}
														value={product.quantity}
														name={`stockImportItems[${index}].quantity`}
														error={touched.stockImportItems?.[index]?.quantity && Boolean(errors.stockImportItems?.[index]?.quantity)}
														helperText={touched.stockImportItems?.[index]?.quantity && errors.stockImportItems?.[index]?.quantity}
														sx={{
															gridColumn: "span 2",
														}}
													/>
													<TextField
														fullWidth
														variant="filled"
														type="number"
														label="Đơn giá"
														onBlur={handleBlur}
														onChange={handleChange}
														value={product.unitPrice}
														name={`stockImportItems[${index}].unitPrice`}
														error={touched.stockImportItems?.[index]?.unitPrice && Boolean(errors.stockImportItems?.[index]?.unitPrice)}
														helperText={touched.stockImportItems?.[index]?.unitPrice && errors.stockImportItems?.[index]?.unitPrice}
														sx={{
															gridColumn: "span 2",
														}}
													/>
													<IconButton
														onClick={() => remove(index)}
														sx={{
															gridColumn: "span 1",
															width: '40px', // Set the width
															height: '40px', // Set the height to be equal to the width
															borderRadius: '4px', // Optional: Set a small border radius to make it square
															margin: 'auto', // Center the icon
														}}
													>
														<DeleteIcon />
													</IconButton>
												</React.Fragment>
											))}
											<Button
												type="button"
												onClick={() => push({ productId: null, quantity: '', unitPrice: '' })}
												sx={{
													gridColumn: "span 10",
												}}
												startIcon={<AddIcon />}
											>
												Thêm sản phẩm
											</Button>
										</>
									)}
								</FieldArray>
							</Box>
							<Box
								display="flex"
								alignItems="center"
								justifyContent="end"
								mt="20px"
							>
								<Button color="error" variant="contained" onClick={handleOpenDialog}>
									Hủy
								</Button>
								<Button type="submit" color="secondary" variant="contained">
									Thêm lô hàng mới
								</Button>
							</Box>
						</form>
					);
				}}
			</Formik>
			<AlertDialog
				open={dialogOpen}
				question={dialogQuestion}
				onClose={handleCancel}
			/>
			<InfoDialog
				open={infoDialogOpen}
				question={info}
				onClose={closeInfoDialog}
			/>
		</Box>
	);
};

export default AddStockForm;