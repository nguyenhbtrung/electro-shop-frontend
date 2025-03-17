import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Header } from "../../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddUser } from "../../../services/UserService";
import InfoDialog from "../../../components/InfoDialog";
import { useState } from "react";
import AlertDialog from "../../../components/AlertDialog";


const initialValues = {
	userName: "",
	password: "",
	email: "",
	role: "",
	userStatus: "",
	fullname: "",
	phoneNumber: "",
	address: "",
};

const phoneRegExp =
	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
	userName: yup.string().required('Tên đăng nhập là bắt buộc'),
	email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
	role: yup.string().required('Vai trò là bắt buộc'),
	password: yup.string().required('Mật khẩu là bắt buộc'),
	contact: yup
		.string()
		.matches(phoneRegExp, "Số điện thoại không hợp lệ."),
	userStatus: yup.string().required('Trạng thái người dùng là bắt buộc'),
});

const AddUserForm = () => {
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const navigate = useNavigate();
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [info, setInfo] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogQuestion, setDialogQuestion] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);

	const handleFormSubmit = async (values) => {
		const response = await AddUser(values);
		console.log("AAA", response);
		if (response.status === 200) {
			setInfo(`Thêm người dùng thành công!`);
			setInfoDialogOpen(true);
			setIsSuccess(true);
		} else {
			displayError(response.data[0].code);
		}
	};

	const closeInfoDialog = () => {
		setInfoDialogOpen(false);
		if (isSuccess) {
			navigate("/admin/users");
		}
	}

	const handleOpenDialog = () => {
		setDialogQuestion("Bạn có chắc chắn muốn hủy bỏ việc thêm người dùng?");
		setDialogOpen(true);
	};

	const displayError = (error) => {
		if (error === 'DuplicateUserName') {
			setInfo('Tên tài khoản đã tồn tại!');
		}
		else if (error === 'InvalidUserName') {
			setInfo('Tên tài khoản không hợp lệ!');
		}
		else if (error === 'PasswordTooShort') {
			setInfo('Mật khẩu quá ngắn!');
		}
		else if (error === 'PasswordRequiresNonAlphanumeric') {
			setInfo('Mật khẩu thiếu ký tự đặc biệt!');
		}
		else if (error === 'PasswordRequiresLower') {
			setInfo('Mật khẩu phải gồm chữ thường!');
		}
		else if (error === 'PasswordRequiresUpper') {
			setInfo('Mật khẩu phải gồm chữ viết hoa!');
		}
		else if (error === 'PasswordRequiresDigit') {
			setInfo('Mật khẩu phải gồm số!');
		}
		else if (error === 'DuplicateEmail') {
			setInfo('Email đã tồn tại!');
		}
		else {
			setInfo("Đã có lỗi không xác định xảy ra!");
		}
		setInfoDialogOpen(true);
	};

	const handleCancel = async (userResponse) => {
		if (!userResponse) {
			setDialogOpen(false);
			return;
		}
		navigate("/admin/users");
	};

	return (
		<Box m="20px">
			<Header title="Thêm người dùng" subtitle="Tạo tài khoản cho người dùng mới" />

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
						<Box
							display="grid"
							gap="30px"
							gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
								label="Tên đăng nhập"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.userName}
								name="userName"
								error={touched.userName && errors.userName}
								helperText={touched.userName && errors.userName}
								sx={{
									gridColumn: "span 4",
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Mật khẩu"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.password}
								name="password"
								error={touched.password && errors.password}
								helperText={touched.password && errors.password}
								sx={{
									gridColumn: "span 4",
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Email"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.email}
								name="email"
								error={touched.email && errors.email}
								helperText={touched.email && errors.email}
								sx={{ gridColumn: "span 2" }}
							/>
							<FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
								<InputLabel>Vai trò</InputLabel>
								<Select
									label="Vai trò"
									name="role"
									value={values.role}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.role && Boolean(errors.role)}
								>
									<MenuItem value="Admin">Quản lý</MenuItem>
									<MenuItem value="User">Người dùng</MenuItem>
								</Select>
								{touched.role && errors.role && (
									<Box color="error.main" mt={1}>
										{errors.role}
									</Box>
								)}
							</FormControl>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Tên người dùng"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.fullname}
								name="fullname"
								error={touched.fullname && errors.fullname}
								helperText={touched.fullname && errors.fullname}
								sx={{ gridColumn: "span 4" }}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Số điện thoại"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.phoneNumber}
								name="phoneNumber"
								error={touched.phoneNumber && errors.phoneNumber}
								helperText={touched.phoneNumber && errors.phoneNumber}
								sx={{ gridColumn: "span 2" }}
							/>
							<FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
								<InputLabel>Trạng thái</InputLabel>
								<Select
									label="Trạng thái"
									name="userStatus"
									value={values.userStatus}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.userStatus && Boolean(errors.userStatus)}
								>
									<MenuItem value="Active">Hoạt động bình thường</MenuItem>
									<MenuItem value="Banned">Bị chặn</MenuItem>
								</Select>
								{touched.userStatus && errors.userStatus && (
									<Box color="error.main" mt={1}>
										{errors.userStatus}
									</Box>
								)}
							</FormControl>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Địa chỉ"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.address}
								name="address"
								error={touched.address && errors.address}
								helperText={touched.address && errors.address}
								sx={{ gridColumn: "span 4" }}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Ảnh đại diện"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.avatarImg}
								name="avatarImg"
								error={touched.avatarImg && errors.avatarImg}
								helperText={touched.avatarImg && errors.avatarImg}
								sx={{ gridColumn: "span 4" }}
							/>
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
								Thêm người dùng mới
							</Button>
						</Box>
					</form>
				)}
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

export default AddUserForm;
// thiếu password, avatar,trạng thái người dùng, thêm nút reset form, thêm nút submit form, thêm function tạo nick cho người dùng mới ở backend, có full data để điền.