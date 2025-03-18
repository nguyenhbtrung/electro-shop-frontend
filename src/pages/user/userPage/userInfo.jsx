import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Footer from "../../../components/Footer";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AlertDialog from "../../../components/AlertDialog";
import InfoDialog from "../../../components/InfoDialog";
import { Formik } from "formik";
import { useState } from "react";
import { UpdateAvatar, UpdateUser } from "../../../services/UserService";
import * as yup from "yup";
import { useMediaQuery } from "@mui/material";
import { Avatar } from "@mui/material";
import { UploadImage } from "../../../services/imageService";
import { useEffect } from "react";
import { GetUserProfileData } from "../../../services/UserService";
import { DeleteImage } from "../../../services/imageService";

const phoneRegExp =
	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
	userName: yup.string().required('Tên đăng nhập là bắt buộc'),
	email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
	roles: yup.string().required('Vai trò là bắt buộc'),
	userStatus: yup.string().required('Trạng thái người dùng là bắt buộc'),
	contact: yup
		.string()
		.matches(phoneRegExp, "Số điện thoại không hợp lệ."),
});

const UserInfoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [info, setInfo] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const [avatar, setAvatar] = useState("/static/images/avatar/1.jpg");
	const [formValues, setFormValues] = useState(null); // State to store form values

	const [initialValues, setInitialValues] = useState({
		email: '',
		roles: '',
		password: '',
		contact: '',
		userName: '',
		address: '',
		fullName: '',
		phoneNumber: '',
		userStatus: '',
	});

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

	const getUserData = async () => {
		var response = await GetUserProfileData(localStorage.getItem("userName"));
		if (response.status === 200) {
			setInitialValues(response.data);
			setAvatar(response.data.avatarImg);
			console.log(response.data);
		} else {
			alert("Lỗi khi lấy dữ liệu người dùng!");
		}
	};

	useEffect(() => {
		getUserData();
	}, []);

	const handleFormSubmit = async (values) => {
		const response = await UpdateUser(values);
		if (response.status === 200) {
			setInfo(`Cập nhập người dùng thành công!`);
			setInfoDialogOpen(true);
		} else {
			displayError(response.data[0].code);
		}
	}

	const closeInfoDialog = () => {
		setInfoDialogOpen(false);
	}

	const handleAvatarChange = async (event) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append('File', file);
		const res = await UploadImage(formData);
		if (res?.status === 200 && res?.data) {
			const response = await UpdateAvatar(res?.data?.imageUrl);
			console.log(res?.data?.imageUrl);
			if (response.status === 200) {
				DeleteImage(avatar);
				setInfo(`Cập nhập ảnh đại diện thành công!`);
				setInfoDialogOpen(true);
				getUserData();
			} else {
				displayError(response.data[0].code);
			}
		}
		else {
			console.log("có lỗi xảy ra");
		}
	};

	const handleCancel = async (userResponse) => {
		if (!userResponse) {
			setDialogOpen(false);
			return;
		} else {
			if (!phoneRegExp.test(formValues.phoneNumber)) {
				setInfo('Số điện thoại không hợp lệ.');
				setInfoDialogOpen(true);
			}
			else if (formValues) {
				handleFormSubmit(formValues);
			}
		}
		setDialogOpen(false);
	};

	const mapRoleToDisplay = (role) => {
		switch (role) {
			case 'Admin':
				return 'Quản lý';
			case 'User':
				return 'Người dùng';
			default:
				return role;
		}
	};

	return (
		<div>
			<Box component="section"
				sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					borderRadius: 1.5,
					backgroundColor: colors.hyu[200],
					margin: '2rem auto',
					width: "80%",
					minHeight: "80vh",
					padding: "2rem",
					paddingTop: "1rem",
					paddingRight: "0rem",
				}}>
				<Box component="h1"
					sx={{
						fontSize: 32,
						fontWeight: 500,
						color: colors.primary[100],
						marginTop: "1rem",
						marginBottom: "0rem",
					}}>
					Hồ Sơ Của Tôi
				</Box>
				<Box component="h3"
					sx={{
						fontSize: 22,
						fontWeight: 500,
						color: colors.primary[100],
						my: "0rem",
					}}>
					Quản lí thông tin hồ sơ để bảo mật tài khoản
				</Box>
				<Divider sx={{ my: '0.5rem', backgroundColor: colors.primary[100], marginRight: "2rem" }} />
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					<Box sx={{ flex: '1 1 80%' }}>
						<Formik
							onSubmit={(values) => {
								setFormValues(values);
								setDialogOpen(true);
							}}
							initialValues={initialValues}
							validationSchema={checkoutSchema}
							enableReinitialize={true}
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
											value={values.userName || ""}
											autoFocus={true}
											name="userName"
											disabled
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
											label="Tên người dùng"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.fullName || ""}
											name="fullName"
											error={touched.fullName && errors.fullName}
											helperText={touched.fullName && errors.fullName}
											sx={{ gridColumn: "span 4" }}
										/>
										<TextField
											fullWidth
											variant="filled"
											type="text"
											label="Email"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.email || ""}
											name="email"
											error={touched.email && errors.email}
											helperText={touched.email && errors.email}
											sx={{ gridColumn: "span 2" }}
											disabled
										/>
										<TextField
											fullWidth
											variant="filled"
											type="text"
											label="Số điện thoại"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.phoneNumber || ""}
											name="phoneNumber"
											error={touched.phoneNumber && errors.phoneNumber}
											helperText={touched.phoneNumber && errors.phoneNumber}
											sx={{ gridColumn: "span 2" }}
										/>
										<TextField
											label="Vai trò"
											value={mapRoleToDisplay(values.roles)}
											disabled
											variant="filled"
											sx={{ gridColumn: "span 2" }}
										/>
										<TextField
											label="Trạng thái"
											value={"Hoạt động bình thường"}
											disabled
											variant="filled"
											sx={{ gridColumn: "span 2" }}
										/>
										<TextField
											fullWidth
											variant="filled"
											type="text"
											label="Địa chỉ"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.address || ""}
											name="address"
											error={touched.address && errors.address}
											helperText={touched.address && errors.address}
											sx={{ gridColumn: "span 4" }}
										/>
									</Box>
									<Box
										display="flex"
										alignItems="center"
										justifyContent="start"
										mt="20px"
									>
										<Button type="submit" color="secondary" variant="contained">
											Lưu
										</Button>
									</Box>
								</form>
							)}
						</Formik>
					</Box>
					<Box sx={{
						flex: '1 1 20%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<Avatar
							alt="A"
							src={avatar}
							sx={{
								width: 100,
								height: 100,
								mb: 2,
							}}
						/>
						<input
							accept="image/*"
							style={{ display: 'none' }}
							id="avatar-upload"
							type="file"
							onChange={handleAvatarChange}
						/>
						<label htmlFor="avatar-upload">
							<Button component="span" color="secondary" variant="contained">
								Đổi ảnh đại diện
							</Button>
						</label>
					</Box>
				</Box>
				<AlertDialog
					open={dialogOpen}
					question={"Bạn có chắc chắn muốn cập nhật thông tin người dùng?"}
					onClose={handleCancel}
				/>
				<InfoDialog
					open={infoDialogOpen}
					question={info}
					onClose={closeInfoDialog}
				/>
			</Box>
			<Footer />
		</div>
	);
};

export default UserInfoPage;