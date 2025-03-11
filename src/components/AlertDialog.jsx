import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';

const AlertDialog = ({ open, question, onClose }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const handleClose = (response) => {
		onClose(response);
	};

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="md" // Set the maximum width of the dialog
			fullWidth // Make the dialog take the full width of the screen
			sx={{
				'& .MuiDialog-paper': {
					minWidth: '500px', // Set the minimum width of the dialog
					maxWidth: '700px', // Set the maximum width of the dialog
				},
			}}
		>
			<DialogTitle id="alert-dialog-title" sx={{ fontSize: '1.2rem', color: colors.redAccent[600] }}>
				Cảnh báo
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description" sx={{ fontSize: '1.2rem' }}>
					{question}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button sx={{ fontSize: '1.1rem', color: colors.redAccent[500] }} onClick={() => handleClose(false)}>Hủy</Button>
				<Button sx={{ fontSize: '1.1rem', color: colors.greenAccent[500] }} onClick={() => handleClose(true)} autoFocus>
					Đồng ý
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AlertDialog;