import React, { useEffect, useState } from "react";
import { Box, Button, TextField, useMediaQuery, IconButton, Autocomplete } from "@mui/material";
import { Header } from "../../../components";
import { Formik, FieldArray } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { GetAllSuppliers } from "../../../services/SupplierService";
import { GetAllProduct } from "../../../services/productService";
import { GetStock } from "../../../services/StockService";

const initialValues = {
	stockImportName: "",
	stockImportStatus: "",
	totalPrice: 0,
	supplierId: null,
	stockImportItems: [{ productId: null, quantity: '', unitPrice: '' }],
};

const DetailStock = () => {
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const navigate = useNavigate();
	const { stockImportId } = useParams(); // Get the stock ID from the URL
	const [suppliers, setSuppliers] = useState([]);
	const [selectedSupplier, setSelectedSupplier] = useState(null);
	const [products, setProducts] = useState([]);

	const handleFormSubmit = async (values) => {
		navigate("/admin/stockimports");
	};

	const fetchSuppliers = async () => {
		try {
			const response = await GetAllSuppliers();
			const data = await response.data;
			setSuppliers(data);
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



	const fetchStock = async (setFieldValue) => {
		try {
			const response = await GetStock(stockImportId);
			const data = await response.data;
			console.log("Stock:", data);
			setFieldValue('stockImportName', data.stockImportName);
			setFieldValue('stockImportStatus', data.stockImportStatus);
			setFieldValue('supplierId', data.supplierId);
			setFieldValue('stockImportItems', data.stockImportItems);
			setFieldValue('totalPrice', data.totalPrice);
			setSelectedSupplier(suppliers.find(supplier => supplier.supplierId === data.supplierId));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box m="20px">
			<Header title="Chi tiết lô hàng" subtitle="Chi tiết lô hàng" />

			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues}
				enableReinitialize
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
						const fetchData = async () => {
							try {
								await fetchSuppliers();
								await fetchProducts();
							} catch (error) {
								console.error(error);
							}
						};

						fetchData();
					}, []);

					useEffect(() => {
						if (suppliers.length > 0 && products.length > 0) {
							fetchStock(setFieldValue);
						}
					}, [suppliers, products]);

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
									disabled
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
									disabled
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
										<MenuItem value="Pending">Chờ duyệt</MenuItem>
										<MenuItem value="Approved">Đã duyệt</MenuItem>
										<MenuItem value="Completed">Thành công</MenuItem>
										<MenuItem value="Canceled">Đã hủy</MenuItem>
										<MenuItem value="Returned">Hoàn trả</MenuItem>
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
														disabled
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
														disabled
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
														disabled
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
												</React.Fragment>
											))}
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
								<Button type="submit" color="secondary" variant="contained">
									Quay lại
								</Button>
							</Box>
						</form>
					);
				}}
			</Formik>
		</Box>
	);
};

export default DetailStock;