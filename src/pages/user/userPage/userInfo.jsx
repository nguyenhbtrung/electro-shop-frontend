import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const UserInfoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<div>Trang theo dõi các yêu cầu hoàn trả</div>
	);
};

export default UserInfoPage;