import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import InfoDialog from "../../components/InfoDialog";

const ChangePasswordDialog = ({ open, onClose, onSubmit }) => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [info, setInfo] = useState('');
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);

	const handleSubmit = () => {
		if (newPassword === confirmPassword) {
			onSubmit(oldPassword, newPassword);
		} else {
			setInfo('Mật khẩu mới không khớp');
			setInfoDialogOpen(true);
		}
	};

	const closeInfoDialog = () => {
		setInfoDialogOpen(false);
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Đổi mật khẩu</DialogTitle>
			<DialogContent>
				<TextField
					margin="dense"
					label="Nhập mật khẩu cũ"
					type="password"
					fullWidth
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
				<TextField
					margin="dense"
					label="Nhập mật khẩu mới"
					type="password"
					fullWidth
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
				<TextField
					margin="dense"
					label="Nhập lại mật khẩu mới"
					type="password"
					fullWidth
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error" variant="contained">
					Hủy
				</Button>
				<Button onClick={handleSubmit} color="secondary" variant="contained">
					Đổi
				</Button>
			</DialogActions>
			<InfoDialog
				open={infoDialogOpen}
				question={info}
				onClose={closeInfoDialog}
			/>
		</Dialog>
	);
};

export default ChangePasswordDialog;