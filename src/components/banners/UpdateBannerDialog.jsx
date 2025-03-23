import React, { useEffect } from "react";
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
import { UploadImage } from "../../services/imageService";

const UpdateBannerDialog = ({ open, onClose, onSubmit, banner }) => {
	const [imagePreview, setImagePreview] = React.useState(null);
	const [image, setImage] = React.useState(null);
	const [previousImageUrl, setPreviousImageUrl] = React.useState("");
	const [initialValues, setValues] = React.useState({
		imageUrl: "",
		link: "",
		title: "",
		position: "",
	});


	useEffect(() => {
		if (banner) {
			setValues(banner);
			setImagePreview(banner.imageUrl);
			setPreviousImageUrl(banner.imageUrl);
		}
	}, [banner]);

	const handleFormSubmit = async (values) => {
		if (imagePreview !== previousImageUrl) {
			const res = await UploadImage(image);
			values.imageUrl = res.data.imageUrl;
		}
		onSubmit(values);
		onClose();
	};

	const handleCancel = () => {
		onClose();
	};


	const handleImageChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		const formData = new FormData();
		setImage(formData);
		formData.append('File', file);
		reader.onloadend = () => {
			setImagePreview(reader.result);
		}
		reader.readAsDataURL(file);
	}

	return (
		<Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
			<DialogTitle>Thêm biểu ngữ</DialogTitle>
			<DialogContent dividers>
				<Formik
					onSubmit={handleFormSubmit}
					initialValues={initialValues}
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
									label="Tên biểu ngữ"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.title}
									name="title"
									error={touched.title && errors.title}
									helperText={touched.title && errors.title}
									sx={{
										gridColumn: "span 4",
									}}
								/>
								<input
									accept="image/*"
									type="file"
									onChange={handleImageChange}
									style={{ display: 'none' }}
									id="image-upload"
								/>
								<label htmlFor="image-upload">
									<Button variant="contained" component="span">
										Upload Image
									</Button>
								</label>
								{imagePreview && (
									<Box mt={2}>
										<img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
									</Box>
								)}
								<TextField
									fullWidth
									type="text"
									label="Liên kết"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.link}
									name="link"
									error={touched.link && errors.link}
									helperText={touched.link && errors.link}
									sx={{
										gridColumn: "span 4",
									}}
								/>
								<TextField
									fullWidth
									type="text"
									label="Vị trí"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.position}
									name="position"
									error={touched.position && errors.position}
									helperText={touched.position && errors.position}
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

export default UpdateBannerDialog;
