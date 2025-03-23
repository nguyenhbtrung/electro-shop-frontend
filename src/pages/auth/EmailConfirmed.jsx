import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ConfirmEmail } from '../../services/UserService';

const EmailConfirmed = () => {
	const [message, setMessage] = useState('');
	const location = useLocation();

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		let token = query.get('token');
		const email = query.get('email');
		if (token) {
			token = token.replace(/ /g, '+'); // Fix the + being converted to space
		}
		const CheckConfirmEmail = async () => {
			try {
				const response = await ConfirmEmail({ email, token });
				if (response.data.confirmed) {
					setMessage(
						<>
							Email đã được xác thực, vui lòng quay lại trang đăng nhập {' '}
							<a href="/login" style={styles.link}>tại đây</a>!
						</>
					);
				} else if (response.data[0].code === "ConcurrencyFailure") {
					setMessage(
						<>
							Email đã được xác thực, vui lòng quay lại trang đăng nhập {' '}
							<a href="/login" style={styles.link}>tại đây</a>!
						</>
					);
				} else {
					setMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
				}
			} catch (error) {
				setMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
			}
		};

		if (token && email) {
			CheckConfirmEmail();
		} else {
			setMessage('Email hoặc token không hợp lệ.');
		}
	}, [location.search]);

	return (
		<div style={styles.container}>
			<h1 style={styles.header}>XÁC THỰC EMAIL</h1>
			{message && <p style={styles.message}>{message}</p>}
		</div>
	);
};

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		backgroundColor: '#f0f0f0',
		padding: '20px',
		boxSizing: 'border-box',
	},
	header: {
		fontSize: '4em',
		color: '#333',
		marginBottom: '20px',
	},
	message: {
		fontSize: '2em',
		color: '#666',
		textAlign: 'center',
	},
};

export default EmailConfirmed;