import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { SendForgotPasswordEmail } from '../../services/UserService';
import InfoDialog from "../../components/InfoDialog";

function ForgotPassword({ open, handleClose }) {
  const [infoDialogOpen, setInfoDialogOpen] = React.useState(false);
  const [info, setInfo] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    if (!isValidEmail(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    setEmailError('');
    // Add your forgot password logic here
    try {
      var response = await SendForgotPasswordEmail(email);
      if (response.status === 200) {
        setInfoDialogOpen(true);
        setInfo('Một email đã được gửi đến địa chỉ email của bạn với hướng dẫn để đặt lại mật khẩu.');
      }
      else {
        setInfoDialogOpen(true);
        setInfo('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
      console.log('Forgot password form submitted with email:', email);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      setInfoDialogOpen(true);
      setInfo('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Đặt lại mật khẩu</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Nhập địa chỉ email của tài khoản của bạn, và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Địa chỉ email"
            placeholder="Địa chỉ email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
          />
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Tiếp tục
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <InfoDialog
        open={infoDialogOpen}
        question={info}
        onClose={handleInfoDialogClose}
      />
    </Dialog >
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
