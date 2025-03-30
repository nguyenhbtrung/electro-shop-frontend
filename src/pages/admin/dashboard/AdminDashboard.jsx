import {
    Box,
    Button,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    Header,
    StatBox,
    LineChart,
    ProgressCircle,
    BarChart,
    GeographyChart,
} from "../../../components";
import {
    AttachMoney,
    DownloadOutlined,
    Email,
    LocalAtm,
    MonetizationOn,
    Paid,
    PersonAdd,
    PointOfSale,
    Traffic,
    TrendingUp,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { mockTransactions } from "../../../data/mockData";
import { formatPrice, formatShortPrice } from "../../../utils/formatValue";
import { useState } from "react";
import RevenueLineChart from "../../../components/RevenueLineChart";

function AdminDashboard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");

    const [revenue, setRevenue] = useState(86230000);
    const [importFee, setImportFee] = useState(66660000);

    const mockProducts = [
        { id: "P001", name: "Sản phẩm A", description: "Mô tả sản phẩm A", sold: 25, price: "1000000" },
        { id: "P002", name: "Sản phẩm B", description: "Mô tả sản phẩm B", sold: 16, price: "7500000" },
        { id: "P003", name: "Sản phẩm C", description: "Mô tả sản phẩm C", sold: 11, price: "11000000" },
        // Thêm các sản phẩm khác nếu cần
    ];



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between">
                <Header title="DASHBOARD" subtitle="Báo cáo & thống kê" />
                {!isXsDevices && (
                    <Box>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: colors.blueAccent[700],
                                color: "#fcfcfc",
                                fontSize: isMdDevices ? "14px" : "10px",
                                fontWeight: "bold",
                                p: "10px 20px",
                                mt: "18px",
                                transition: ".3s ease",
                                ":hover": {
                                    bgcolor: colors.blueAccent[800],
                                },
                            }}
                            startIcon={<DownloadOutlined />}
                        >
                            DOWNLOAD REPORTS
                        </Button>
                    </Box>
                )}
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns={
                    isXlDevices
                        ? "repeat(12, 1fr)"
                        : isMdDevices
                            ? "repeat(6, 1fr)"
                            : "repeat(3, 1fr)"
                }
                gridAutoRows="140px"
                gap="20px"
            >
                {/* Statistic Items */}
                <Box
                    gridColumn="span 3"
                    bgcolor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={formatPrice(revenue)}
                        subtitle="Doanh thu"
                        progress="0.75"
                        increase="+14%"
                        // color={colors.red[600]}
                        icon={
                            <MonetizationOn
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={formatPrice(importFee)}
                        subtitle="Phí nhập hàng"
                        progress="0.50"
                        increase="+21%"
                        icon={
                            <LocalAtm
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={formatPrice(revenue - importFee)}
                        subtitle="Lợi nhuận"
                        progress="0.30"
                        increase="+5%"
                        color={revenue - importFee > 0 ? colors.greenAccent[500] : colors.redAccent[500]}
                        icon={
                            <TrendingUp
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="20"
                        subtitle="Khách hàng mới"
                        progress="0.80"
                        increase="+43%"
                        icon={
                            <PersonAdd
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>

                {/* ---------------- Row 2 ---------------- */}

                {/* Line Chart */}
                <Box
                    gridColumn={
                        isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
                    }
                    gridRow="span 2"
                    bgcolor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        px="30px"
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.gray[100]}
                            >
                                Doanh thu tạo ra
                            </Typography>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                                {formatPrice(revenue)}
                            </Typography>
                        </Box>
                        <IconButton>
                            <DownloadOutlined
                                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                            />
                        </IconButton>
                    </Box>
                    <Box height="250px" mt="-20px">
                        <RevenueLineChart isDashboard={true} />
                    </Box>
                </Box>

                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    bgcolor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                            Top sản phẩm bán chạy
                        </Typography>
                    </Box>

                    {mockProducts.map((product, index) => (
                        <Box
                            key={`${product.id}-${index}`}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            borderBottom={`4px solid ${colors.primary[500]}`}
                            p="15px"
                        >
                            {/* Xếp hạng sản phẩm */}
                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                {index + 1}.
                            </Typography>

                            {/* Thông tin sản phẩm */}
                            <Box ml="10px" flex={1}>
                                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                    {product.name}
                                </Typography>
                                <Typography color={colors.gray[100]}>
                                    {product.description}
                                </Typography>
                            </Box>

                            {/* Hiển thị số lượng đã bán */}
                            <Typography color={colors.gray[100]}>
                                {product.sold} đã bán
                            </Typography>

                            {/* Giá sản phẩm */}
                            <Box
                                bgcolor={colors.greenAccent[500]}
                                p="5px 10px"
                                borderRadius="4px"
                                ml="10px"
                            >
                                ${formatShortPrice(product.price)}
                            </Box>
                        </Box>
                    ))}
                </Box>



                {/* Revenue Details */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    p="30px"
                >
                    <Typography variant="h5" fontWeight="600">
                        Campaign
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt="25px"
                    >
                        <ProgressCircle size="125" />
                        <Typography
                            textAlign="center"
                            variant="h5"
                            color={colors.greenAccent[500]}
                            sx={{ mt: "15px" }}
                        >
                            $48,352 revenue generated
                        </Typography>
                        <Typography textAlign="center">
                            Includes extra misc expenditures and costs
                        </Typography>
                    </Box>
                </Box>

                {/* Bar Chart */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                >
                    <Typography
                        variant="h5"
                        fontWeight="600"
                        sx={{ p: "30px 30px 0 30px" }}
                    >
                        Sales Quantity
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="250px"
                        mt="-20px"
                    >
                        <BarChart isDashboard={true} />
                    </Box>
                </Box>

                {/* Geography Chart */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    padding="30px"
                >
                    <Typography variant="h5" fontWeight="600" mb="15px">
                        Geography Based Traffic
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="200px"
                    >
                        <GeographyChart isDashboard={true} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminDashboard;
