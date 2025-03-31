/* eslint-disable react/prop-types */
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { GetLast12MonthsRevenue } from "../services/dashboardService";

// Dữ liệu tổng doanh thu theo tháng
const revenueMockData = [
    {
        id: "Doanh thu",
        color: "hsl(211, 70%, 50%)",
        data: [
            { x: "12/2024", y: 20000000 },
            { x: "01/2025", y: 25000000 },
            { x: "02/2025", y: 18230000 },
            { x: "03/2025", y: 23000000 },
        ],
    },
];


const RevenueLineChart = ({ isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [revenueData, setRevenueData] = useState([
        {
            id: "Doanh thu",
            color: "hsl(211, 70%, 50%)",
            data: [{ x: "0", y: 0 },],
        },
    ]);

    useEffect(() => {
        const FetchData = async () => {
            const res = await GetLast12MonthsRevenue();
            if (res?.status === 200 && res?.data) {
                setRevenueData([
                    {
                        id: "Doanh thu",
                        color: "hsl(211, 70%, 50%)",
                        data: res.data,
                    },
                ]);
            }
        };

        FetchData();
    }, []);

    return (
        <ResponsiveLine
            data={revenueData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.gray[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.gray[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.gray[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.gray[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.gray[100],
                    },
                },
                tooltip: {
                    container: {
                        color: colors.primary[500],
                    },
                },
            }}
            colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: "bottom",
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "Tháng", // Xem các tháng
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                orient: "left",
                tickValues: 5,
                tickSize: 3,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "Doanh thu ($)", // Hiển thị doanh thu
                legendOffset: -40,
                legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default RevenueLineChart;
