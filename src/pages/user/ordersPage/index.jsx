// import React, { useState } from 'react';
// import { Box, Typography, Button } from '@mui/material';

// const OrderList = ({ orders }) => {
//     const [expandedOrderId, setExpandedOrderId] = useState(null);

//     const toggleExpand = (orderId) => {
//         setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
//     };

//     // Hàm tính tổng giá trị của đơn hàng
//     const calculateTotalPrice = (items) => {
//         return items.reduce((total, item) => total + item.price * item.quantity, 0);
//     };

//     return (
//         <Box sx={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
//             {orders.map((order) => (
//                 <Box
//                     key={order.orderId}
//                     sx={{
//                         border: '1px solid #ccc',
//                         borderRadius: '8px',
//                         marginBottom: '16px',
//                         padding: '20px',
//                         backgroundColor: '#fff',
//                         boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                         position: 'relative'
//                     }}
//                 >
//                     {/* Hiển thị trạng thái đơn hàng ở góc trên phải */}
//                     <Typography
//                         sx={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '20px',
//                             fontWeight: 600,
//                             color: order.status === 'Pending' ? '#FFA500' : '#28a745', // Đổi màu theo trạng thái
//                         }}
//                     >
//                         {order.status}
//                     </Typography>

//                     <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
//                         <img
//                             src={order.items[0].image}
//                             alt={order.items[0].name}
//                             style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }}
//                         />
//                         <Box sx={{ flex: 1 }}>
//                             <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
//                                 {order.items[0].name}
//                             </Typography>
//                             <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
//                                 {order.items[0].price.toLocaleString()} đ x {order.items[0].quantity}
//                             </Typography>
//                         </Box>
//                         <Button
//                             onClick={() => alert('Đánh giá sản phẩm')}
//                             sx={{ marginLeft: 'auto', color: '#007bff', textDecoration: 'underline' }}
//                         >
//                             Đánh giá
//                         </Button>
//                     </Box>

//                     {order.items.length > 1 && (
//                         <Button onClick={() => toggleExpand(order.orderId)} sx={{ fontSize: '1rem' }}>
//                             {expandedOrderId === order.orderId ? 'Ẩn bớt' : 'Xem thêm'}
//                         </Button>
//                     )}

//                     {expandedOrderId === order.orderId && (
//                         <Box sx={{ marginTop: '12px' }}>
//                             {order.items.slice(1).map((item, idx) => (
//                                 <Box key={idx} sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
//                                     <img
//                                         src={item.image}
//                                         alt={item.name}
//                                         style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }}
//                                     />
//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
//                                             {item.name}
//                                         </Typography>
//                                         <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
//                                             {item.price.toLocaleString()} đ x {item.quantity}
//                                         </Typography>
//                                     </Box>
//                                     <Button
//                                         onClick={() => alert('Đánh giá sản phẩm')}
//                                         sx={{ marginLeft: 'auto', color: '#007bff', textDecoration: 'underline' }}
//                                     >
//                                         Đánh giá
//                                     </Button>
//                                 </Box>
//                             ))}
//                         </Box>
//                     )}

//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//                         <Button onClick={() => alert('Yêu cầu trả hàng')}>Trả hàng</Button>
//                     </Box>

//                     {/* Hiển thị tổng giá trị của đơn hàng ở góc trái dưới */}
//                     <Typography
//                         variant="body1"
//                         sx={{
//                             position: 'absolute',
//                             bottom: '20px',
//                             left: '20px',
//                             fontWeight: 600,
//                             color: '#333'
//                         }}
//                     >
//                         Tổng giá trị: {calculateTotalPrice(order.items).toLocaleString()} đ
//                     </Typography>
//                 </Box>
//             ))}
//         </Box>
//     );
// };

// // Dữ liệu đơn hàng mẫu
// const testOrders = [
//     {
//         orderId: 1,
//         status: 'Pending', // Trạng thái đơn hàng
//         items: [
//             { name: 'Sản phẩm A', price: 75000, quantity: 2, image: 'https://via.placeholder.com/100' },
//             { name: 'Sản phẩm B', price: 85000, quantity: 1, image: 'https://via.placeholder.com/100' }
//         ]
//     },
//     {
//         orderId: 2,
//         status: 'Completed', // Trạng thái đơn hàng
//         items: [
//             { name: 'Sản phẩm C', price: 129000, quantity: 1, image: 'https://via.placeholder.com/100' }
//         ]
//     }
// ];

// const OrderListWithTestData = () => <OrderList orders={testOrders} />;

// export default OrderListWithTestData;

// src/pages/user/orderPage/index.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import ViewUserOrders from "../../../components/orders/ViewUserOrders";

const OrderPage = () => {
  return (
    <Box sx={{ maxWidth: "800px", margin: "32px auto" }}>
      <Typography variant="h5" sx={{ marginBottom: "16px", textAlign: "center" }}>
        Danh sách đơn hàng của bạn
      </Typography>
      <ViewUserOrders />
    </Box>
  );
};

export default OrderPage;
