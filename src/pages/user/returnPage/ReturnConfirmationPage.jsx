import React from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useParams } from 'react-router-dom';

const ReturnConfirmationPage = () => {
    const { returnId } = useParams();

    // Sample return request data
    const returnData = {
        returnId: 'RETURN#12345',
        processingTime: '5-7 ngày',
        shippingInstructions: [
            'Đóng gói sản phẩm cẩn thận theo quy định.',
            'In nhãn vận chuyển & gửi hàng tới địa chỉ trung tâm.',
            'Thời gian xử lý dự kiến: 5-7 ngày.'
        ]
    };

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        XÁC NHẬN YÊU CẦU HOÀN TRẢ
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Confirmation message */}
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ReceiptLongIcon color="primary" fontSize="large" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                            Cảm ơn bạn đã gửi yêu cầu hoàn trả.
                        </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Mã yêu cầu: {returnId}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Shipping instructions */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalShippingIcon color="primary" fontSize="medium" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                            Hướng dẫn gửi hàng:
                        </Typography>
                    </Box>

                    <List>
                        {returnData.shippingInstructions.map((instruction, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemText
                                    primary={<Typography variant="body1">- {instruction}</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Track button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => console.log('Tracking return request:', returnId)}
                    >
                        Theo dõi trạng thái hoàn trả
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ReturnConfirmationPage;