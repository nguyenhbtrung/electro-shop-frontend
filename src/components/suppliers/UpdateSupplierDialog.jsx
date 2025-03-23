import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";



const phoneRegExp =
	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
	supplierName: yup.string().required("Tên nhà cung cấp là bắt buộc"),
	//address: yup.string().required("Địa chỉ nhà cung cấp là bắt buộc"),
	supplierContact: yup
		.string()
		.matches(phoneRegExp, "Số điện thoại không hợp lệ."),
});

const UpdateSupplierDialog = ({ open, onClose, onSubmit, supplier }) => {
	const [initialValues, setValues] = useState({
		supplierId: "",
		supplierName: "",
		supplierAddress: "",
		supplierContact: "",
	});

	useEffect(() => {
		console.log("Supplier", supplier);
		setValues(supplier);
	}, [supplier]);

	const handleFormSubmit = (values) => {
		onSubmit(values);
		onClose();
	};

	const handleCancel = () => {
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
			<DialogTitle>Thêm nhà cung cấp</DialogTitle>
			<DialogContent dividers>
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
					}) => (
						<form onSubmit={handleSubmit}>
							<Box display="grid"
								gap="30px"
								gridTemplateColumns="repeat(4, minmax(0, 1fr))"
								sx={{
									"& > div": {
										gridColumn: "span 4",
									},
								}}>
								<TextField
									fullWidth
									type="text"
									label="Tên nhà cung cấp"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.supplierName}
									name="supplierName"
									error={touched.supplierName && errors.supplierName}
									helperText={touched.supplierName && errors.supplierName}
									sx={{
										gridColumn: "span 4",
									}}
								/>
								<TextField
									fullWidth
									type="text"
									label="Địa chỉ nhà cung cấp"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.supplierAddress}
									name="supplierAddress"
									error={touched.supplierAddress && errors.supplierAddress}
									helperText={touched.supplierAddress && errors.supplierAddress}
									sx={{
										gridColumn: "span 4",
									}}
								/>
								<TextField
									fullWidth
									type="text"
									label="Số điện thoại nhà cung cấp"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.supplierContact}
									name="supplierContact"
									error={touched.supplierContact && errors.supplierContact}
									helperText={touched.supplierContact && errors.supplierContact}
									sx={{
										gridColumn: "span 4",
									}}
								/>
							</Box>
							<DialogActions>
								<Button onClick={handleCancel} color="error" variant="contained">
									Huỷ
								</Button>
								<Button type="submit" color="secondary" variant="contained">
									Sửa
								</Button>
							</DialogActions>
						</form>
					)}
				</Formik>
			</DialogContent>

		</Dialog>
	);
};

export default UpdateSupplierDialog;
