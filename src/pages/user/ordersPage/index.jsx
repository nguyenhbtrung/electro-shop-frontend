import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const OrderList = ({ orders }) => {
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <Box sx={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}> {/* Đã chỉnh maxWidth 800px */}
            {orders.map((order) => (
                <Box
                    key={order.orderId}
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'  // Tăng độ bóng đổ
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: '12px', fontSize: '1.3rem', fontWeight: 600 }}> {/* Font size 1.3rem */}
                        Đơn hàng #{order.orderId}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}> {/* Tăng khoảng cách */}
                        <img
                            src={order.items[0].image}
                            alt={order.items[0].name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }} // 100px x 100px
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}> {/* Font size 1.1rem */}
                                {order.items[0].name}
                            </Typography>
                            <Typography color="text.secondary" sx={{ fontSize: '1rem' }}> {/* Font size 1rem */}
                                {order.items[0].price.toLocaleString()} đ x {order.items[0].quantity}
                            </Typography>
                        </Box>
                        <Button
                            onClick={() => alert('Đánh giá sản phẩm')}
                            sx={{ marginLeft: 'auto', color: '#007bff', textDecoration: 'underline' }}
                        >
                            Đánh giá
                        </Button>
                    </Box>

                    {order.items.length > 1 && (
                        <Button onClick={() => toggleExpand(order.orderId)} sx={{ fontSize: '1rem' }}>
                            {expandedOrderId === order.orderId ? 'Ẩn bớt' : 'Xem thêm'}
                        </Button>
                    )}

                    {expandedOrderId === order.orderId && (
                        <Box sx={{ marginTop: '12px' }}>
                            {order.items.slice(1).map((item, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }} // 100px x 100px
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
                                            {item.price.toLocaleString()} đ x {item.quantity}
                                        </Typography>
                                    </Box>
                                    <Button
                                        onClick={() => alert('Đánh giá sản phẩm')}
                                        sx={{ marginLeft: 'auto', color: '#007bff', textDecoration: 'underline' }}
                                    >
                                        Đánh giá
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button onClick={() => alert('Yêu cầu trả hàng')}>Trả hàng</Button>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

const testOrders = [
    {
        orderId: 1,
        items: [
            { name: 'Sản phẩm A', price: 75000, quantity: 2, image: 'https://via.placeholder.com/100' },
            { name: 'Sản phẩm B', price: 85000, quantity: 1, image: 'https://via.placeholder.com/100' }
        ]
    },
    {
        orderId: 2,
        items: [
            { name: 'Sản phẩm C', price: 129000, quantity: 1, image: 'https://via.placeholder.com/100' }
        ]
    }
];

const OrderListWithTestData = () => <OrderList orders={testOrders} />;

export default OrderListWithTestData;
