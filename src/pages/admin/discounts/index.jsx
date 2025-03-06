import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useEffect } from "react";
import { GetDiscounts } from "../../../services/discountService";

const ManageDiscount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const TestApiCall = async () => {
            try {
                const res = await GetDiscounts();
                if (res) {
                    console.log(">>>check res: ", res);
                }
            } catch (error) {
                console.log(">>>check err: ", res);
            }

        }

        TestApiCall();
    }, [])

    return (
        <div>Trang quản lý giảm giá</div>
    );
};

export default ManageDiscount;