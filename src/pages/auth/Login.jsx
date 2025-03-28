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
    padding: theme.spacing(4),
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
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
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
            <SignInContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card variant="outlined">
                    <Link onClick={handleClickHome} sx={{ fontFamily: 'Roboto, sans-serif' }}>&larr; Quay lại trang chủ</Link>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}
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
                            <FormLabel htmlFor="userName" sx={{ textAlign: 'left', fontFamily: 'Roboto, sans-serif' }}>Tên tài khoản</FormLabel>
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
                                    fontFamily: 'Roboto, sans-serif',
                                    '& .MuiInputBase-input::placeholder': {
                                        fontFamily: 'Roboto, sans-serif',
                                        fontSize: '16px',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="password" sx={{ fontFamily: 'Roboto, sans-serif' }} >Mật khẩu</FormLabel>
                                <Link
                                    component="button"
                                    type="button"
                                    onClick={handleClickOpen}
                                    variant="body2"
                                    sx={{ alignSelf: 'baseline', fontFamily: 'Roboto, sans-serif' }}
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
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handlePasswordChange}
                                sx={{
                                    fontFamily: 'Roboto, sans-serif',
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
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/* Show error message if password is invalid */}
                            {passwordError && (
                                <FormHelperText sx={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', color: 'error.main' }}>
                                    {passwordErrorMessage}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            sx={{ fontFamily: 'Roboto, sans-serif' }}
                            label="Ghi nhớ tôi"
                        />
                        <ForgotPassword open={open} handleClose={handleClose} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            Đăng nhập
                        </Button>
                        <Typography sx={{ textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}>
                            Chưa có tài khoản?{' '}
                            <span>
                                <Link
                                    variant="body2"
                                    sx={{ textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}
                                    onClick={handleSignUpClick}
                                >
                                    Đăng kí ngay
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </AppTheme>
    );
}
