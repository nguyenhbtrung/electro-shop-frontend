import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Header } from "../../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddUser } from "../../../services/UserService";

const initialValues = {
	userName: "",
	password: "",
	email: "",
	role: "",
	fullname: "",
	phoneNumber: "",
	address: "",
};

const phoneRegExp =
	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
	userName: yup.string().required("Không được để trống."),
	email: yup.string().email("Email không hợp lệ.").required("Không được để trống."),
	role: yup.string().required("Không được để trống."),
	password: yup.string().required("Không được để trống"),
	contact: yup
		.string()
		.matches(phoneRegExp, "Số điện thoại không hợp lệ."),
});

const AddUserForm = () => {
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const navigate = useNavigate();


	const handleFormSubmit = async (values) => {
		var response = await AddUser(values);
		if (response.status === 200) {
			alert("Thêm người dùng thành công!");
			navigate("/admin/users");
		} else {
			alert("Thêm người dùng thất bại!");
		}
	};

	const handleCancel = () => {
		if (
			window.confirm(
				"Bạn có chắc chắn muốn hủy thêm người dùng?"
			)
		) {
			navigate("/admin/users");
		}
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
							<Button color="error" variant="contained" onClick={handleCancel}>
								Hủy
							</Button>
							<Button type="submit" color="secondary" variant="contained">
								Thêm người dùng mới
							</Button>
						</Box>
					</form>
				)}
			</Formik>
		</Box>
	);
};

export default AddUserForm;
// thiếu password, avatar,trạng thái người dùng, thêm nút reset form, thêm nút submit form, thêm function tạo nick cho người dùng mới ở backend, có full data để điền.