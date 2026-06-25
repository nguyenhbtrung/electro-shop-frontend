import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import AppTheme from './shared-theme/AppTheme';
import ColorModeSelect from './shared-theme/ColorModeSelect';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UserLogin } from "../../services/UserService";
import { AuthContext } from '../../contexts/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    margin: 'auto',

    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },

    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',

    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    position: 'relative',
    minHeight: '100vh',
    padding: theme.spacing(2),
    overflowX: 'hidden',

    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },

    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',

        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    height: 'fit-content',
    backgroundColor:
        theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : '#ffffff',

    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4),
    },

    '& .MuiTypography-root': {
        fontFamily: 'Roboto, sans-serif',
        wordBreak: 'break-word',
    },
}));

export default function Login(props) {
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { login } = React.useContext(AuthContext);

    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userName === '' || password === '') {
            setPasswordError(true);
            setPasswordErrorMessage('Tên tài khoản hoặc mật khẩu không được để trống');
            return;
        }
        try {
            const loginData = {
                userName: userName,
                password: password
            }
            const response = await UserLogin(loginData);
            if (response.status === 200) {
                console.log('Đăng nhập thành công: ', response);
                const token = response.data.token;
                console.log("token: ", token);
                login(token);
                localStorage.setItem('userName', userName);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('role', response.data.roles);
                if (response.data.roles === "User") {
                    navigate('/');
                } else if (response.data.roles === "Admin") {
                    navigate('/admin');
                }
            }
            else {
                if (response.data === "Email not confirmed") {
                    setPasswordError(true);
                    setPasswordErrorMessage("Tài khoản chưa được xác nhận, vui lòng kiểm tra email của bạn!");
                } else if (response.data === "User is banned") {
                    setPasswordError(true);
                    setPasswordErrorMessage("Tài khoản của bạn đã bị khóa!");
                } else {
                    setPasswordError(true);
                    setPasswordErrorMessage("Tên tài khoản hoặc mật khẩu không đúng");
                }
                console.log('Đăng nhập thất bại: ', response);
            }
        }
        catch (error) {
            setPasswordError(true);
            setPasswordErrorMessage("Có lỗi khi đăng nhập, thử lại sau!");
            console.log('Đăng nhập thất bại: ', error);
        }
    };

    const navigate = useNavigate();
    const handleSignUpClick = () => {
        navigate('/register');
    };

    const handleClickHome = () => {
        navigate('/');
    };

    return (
    <AppTheme {...props}>
        <CssBaseline enableColorScheme />

        <SignInContainer
            direction="column"
            justifyContent="center"
        >
            <ColorModeSelect
                sx={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                }}
            />

            <Grid
                container
                spacing={{ xs: 2, md: 4 }}
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: '100%',
                    // maxWidth: '1200px',      
                    mx: 'auto',
                }}
            >
                {/* LEFT PANEL */}
                <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                        order: { xs: 2, md: 1 },
                    }}
                >
                    <InfoCard elevation={2}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                fontFamily: 'Roboto, sans-serif',
                            }}
                        >
                            ElectroShop Demo
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Thông tin tài khoản test và thanh toán VNPay Sandbox.
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                fontFamily: 'Roboto, sans-serif',
                            }}
                        >
                            Tài khoản test
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                                Customer
                            </Typography>
                            <Typography>
                                Tên tài khoản: <strong>test01</strong>
                            </Typography>
                            <Typography>
                                Mật khẩu: <strong>test01.Password</strong>
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                                Admin
                            </Typography>
                            <Typography>
                                Tên tài khoản: <strong>admin01</strong>
                            </Typography>
                            <Typography>
                                Mật khẩu: <strong>admin01.Password</strong>
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                fontFamily: 'Roboto, sans-serif',
                            }}
                        >
                            Test thanh toán VNPay Sandbox
                        </Typography>

                        <Typography
                            // variant="body1"
                            // color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Truy cập{' '}
                            <Link
                                href="https://sandbox.vnpayment.vn/apis/vnpay-demo/#th%C3%B4ng-tin-th%E1%BA%BB-test"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                VNPay Sandbox Test Credentials
                            </Link>{' '}
                            để lấy thông tin xác thực dùng thử, hoặc có thể dùng các thông tin sau:
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            Ngân hàng: <strong>NCB</strong>
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            Số thẻ: <strong>9704198526191432198</strong>
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            Chủ thẻ: <strong>NGUYEN VAN A</strong>
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            Ngày phát hành: <strong>07/15</strong>
                        </Typography>

                        <Typography sx={{ mb: 2 }}>
                            OTP: <strong>123456</strong>
                        </Typography>

                        
                    </InfoCard>
                </Grid>

                {/* RIGHT PANEL - LOGIN FORM */}
                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        order: { xs: 1, md: 2 },
                    }}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            width: '100%',
                            maxWidth: 500,
                            mx: 'auto',
                        }}
                    >
                        <Link
                            onClick={handleClickHome}
                            sx={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            &larr; Quay lại trang chủ
                        </Link>

                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                width: '100%',
                                fontSize: {
                                    xs: '1.75rem',
                                    sm: '2rem',
                                    md: '2.15rem',
                                },
                                textAlign: 'center',
                                fontFamily: 'Roboto, sans-serif',
                            }}
                        >
                            Đăng nhập
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <FormControl>
                                <FormLabel
                                    htmlFor="userName"
                                    sx={{
                                        textAlign: 'left',
                                        fontFamily: 'Roboto, sans-serif',
                                    }}
                                >
                                    Tên tài khoản
                                </FormLabel>

                                <TextField
                                    id="userName"
                                    type="userName"
                                    name="userName"
                                    placeholder="Nhập tên tài khoản"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleUserNameChange}
                                    sx={{
                                        '& .MuiInputBase-input::placeholder': {
                                            fontFamily: 'Roboto, sans-serif',
                                            fontSize: '16px',
                                        },
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                    }}
                                >
                                    <FormLabel
                                        htmlFor="password"
                                        sx={{
                                            fontFamily: 'Roboto, sans-serif',
                                        }}
                                    >
                                        Mật khẩu
                                    </FormLabel>

                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={handleClickOpen}
                                        variant="body2"
                                        sx={{
                                            alignSelf: 'baseline',
                                            fontFamily: 'Roboto, sans-serif',
                                        }}
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </Box>

                                <TextField
                                    name="password"
                                    placeholder="Điền mật khẩu của bạn"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={handlePasswordChange}
                                    sx={{
                                        '& .MuiInputBase-input::placeholder': {
                                            fontFamily: 'Roboto, sans-serif',
                                            fontSize: '16px',
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {passwordError && (
                                    <FormHelperText
                                        sx={{
                                            fontSize: '14px',
                                            fontFamily: 'Roboto, sans-serif',
                                            color: 'error.main',
                                        }}
                                    >
                                        {passwordErrorMessage}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                    />
                                }
                                label="Ghi nhớ tôi"
                            />

                            <ForgotPassword
                                open={open}
                                handleClose={handleClose}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    fontFamily: 'Roboto, sans-serif',
                                }}
                            >
                                Đăng nhập
                            </Button>

                            <Typography
                                sx={{
                                    textAlign: 'center',
                                    fontFamily: 'Roboto, sans-serif',
                                }}
                            >
                                Chưa có tài khoản?{' '}
                                <Link
                                    variant="body2"
                                    onClick={handleSignUpClick}
                                    sx={{
                                        cursor: 'pointer',
                                        fontFamily: 'Roboto, sans-serif',
                                    }}
                                >
                                    Đăng kí ngay
                                </Link>
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </SignInContainer>
    </AppTheme>
);
}
