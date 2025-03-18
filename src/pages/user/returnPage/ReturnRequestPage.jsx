import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Dialog,
    DialogContent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { GetOrderByUser } from '../../../services/orderService';
import { CreateReturnRequest } from '../../../services/returnService';
import { useNavigate, useParams } from 'react-router-dom';

const ReturnRequestPage = () => {
    // Sample order data
    // const orderData = {
    //     orderId: 'ORDER#12345',
    //     orderItems: [
    //         { orderItemId: 1, productName: 'Laptop HP', quantity: 1 },
    //         { orderItemId: 2, productName: 'PC Dell Inspiron', quantity: 2 },
    //         { orderItemId: 3, productName: 'Chuột Logitech', quantity: 1 }
    //     ]
    // };

    // State for form
    const { orderId } = useParams();
    const [selectedItems, setSelectedItems] = useState({});
    const [returnQuantities, setReturnQuantities] = useState({});
    const [reasons, setReasons] = useState({
        wrong_product: false,
        technical_issue: false,
        not_as_described: false,
        other: false
    });
    const [description, setDescription] = useState('');
    const [handlingMethod, setHandlingMethod] = useState('refund');
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [orderData, setOrderData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const GetOrder = async () => {
            const orderRes = await GetOrderByUser();
            if (orderRes?.status === 200 && orderRes?.data) {
                console.log(">>>check orders:", orderRes?.data);
                setOrderData(orderRes?.data?.[2]);
            }
        };

        GetOrder();
    }, []);

    const handleImageClick = (file) => {
        // Tạo URL cho file ảnh và đặt vào state để hiển thị trong modal.
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImage(null);
    };

    // Handle item selection
    const handleItemSelect = (event, itemId) => {
        setSelectedItems({
            ...selectedItems,
            [itemId]: event.target.checked
        });

        // Initialize quantity if item is selected
        if (event.target.checked && !returnQuantities[itemId]) {
            const item = orderData.orderItems.find(item => item.orderItemId === itemId);
            setReturnQuantities({
                ...returnQuantities,
                [itemId]: 1
            });
        }
    };

    // Handle quantity change
    const handleQuantityChange = (event, itemId) => {
        const item = orderData.orderItems.find(item => item.orderItemId === itemId);
        let value = parseInt(event.target.value, 10);

        // Validate quantity
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > item.quantity) {
            value = item.quantity;
        }

        setReturnQuantities({
            ...returnQuantities,
            [itemId]: value
        });
    };

    // Handle reason selection changes
    const handleReasonChange = (event) => {
        setReasons({
            ...reasons,
            [event.target.name]: event.target.checked
        });
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
        event.target.value = '';
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedProductIds = Object.keys(selectedItems)
            .filter(itemId => selectedItems[itemId]);
        if (selectedProductIds.length === 0) {
            alert("Vui lòng chọn sản phẩm cần hoàn trả");
            return;
        }
        const selectedReasons = Object.keys(reasons).filter(key => reasons[key]);
        if (selectedReasons.length === 0) {
            alert("Vui lòng chọn lý do hoàn trả");
            return;
        }
        if (files.length === 0) {
            alert("Vui lòng tải lên ảnh minh chứng");
            return;
        }
        const returnItems = selectedProductIds.map(itemId => ({
            orderItemId: parseInt(itemId, 10),
            returnQuantity: returnQuantities[itemId] || 1
        }));
        const formData = new FormData();
        formData.append('OrderId', orderData.orderId);
        formData.append('Reason', selectedReasons);
        formData.append('Detail', description);
        formData.append('ReturnMethod', handlingMethod);
        files.forEach((file, index) => {
            formData.append('EvidenceImages', file);
        });
        returnItems.forEach((item, index) => {
            formData.append(`ReturnItems[${index}].OrderItemId`, item.orderItemId);
            formData.append(`ReturnItems[${index}].ReturnQuantity`, item.returnQuantity);
        });
        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        const res = await CreateReturnRequest(formData);
        if (res?.status === 200 && res?.data) {
            console.log(">>>check returnRes", res?.data);
            navigate(`/returns/confirmation/${res?.data?.returnId}`);

        }
        else if (res?.status === 400) {
            alert(res?.data);
        }
        else {
            alert("Có lỗi xảy ra");
        }
    };

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Gửi YÊU CẦU HOÀN TRẢ ĐƠN HÀNG
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box component="form" onSubmit={handleSubmit}>
                    {/* Order Information */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6">
                            Đơn hàng: {orderData.orderId}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Product Selection */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Chọn sản phẩm cần hoàn trả:
                        </Typography>

                        {orderData.orderItems?.map((item) => (
                            <Grid container spacing={2} alignItems="center" key={item.orderItemId} sx={{ mb: 1 }}>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!selectedItems[item.orderItemId]}
                                                onChange={(e) => handleItemSelect(e, item.orderItemId)}
                                            />
                                        }
                                        label={item.productName}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số lượng"
                                        type="number"
                                        size="small"
                                        disabled={!selectedItems[item.orderItemId]}
                                        value={returnQuantities[item.orderItemId] || ''}
                                        onChange={(e) => handleQuantityChange(e, item.orderItemId)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Typography variant="caption">
                                                        (Tối đa: {item.quantity})
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                min: 1,
                                                max: item.quantity
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Return Reason */}
                    <Box sx={{ mb: 3 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                <Typography variant="h6">Lý do hoàn trả (có thể chọn nhiều):</Typography>
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={reasons.wrong_product}
                                            onChange={handleReasonChange}
                                            name="wrong_product"
                                        />
                                    }
                                    label="Sai sản phẩm"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={reasons.technical_issue}
                                            onChange={handleReasonChange}
                                            name="technical_issue"
                                        />
                                    }
                                    label="Lỗi kỹ thuật"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={reasons.not_as_described}
                                            onChange={handleReasonChange}
                                            name="not_as_described"
                                        />
                                    }
                                    label="Không đúng mô tả"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={reasons.other}
                                            onChange={handleReasonChange}
                                            name="other"
                                        />
                                    }
                                    label="Khác"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Description */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Mô tả chi tiết:
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Vui lòng mô tả chi tiết vấn đề, ghi chú nếu cần"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* File Upload */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Tải lên hình ảnh minh chứng:
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            Chọn file
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                            />
                        </Button>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {files.map((file, index) => (
                                <Grid item key={index}>
                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`upload-${index}`}
                                            width={100}
                                            height={100}
                                            style={{ borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => handleImageClick(file)}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeFile(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                },
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        {/* Hộp thoại hiển thị ảnh khi người dùng click */}
                        <Dialog open={open} onClose={handleClose}>
                            <DialogContent
                                sx={{
                                    width: { xs: '90vw', sm: '600px' },
                                    height: { xs: '80vh', sm: '400px' },
                                    p: 0,           // Loại bỏ padding nếu cần,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',     // Giúp ảnh co giãn theo container mà không vượt ra ngoài
                                            maxHeight: '100%',
                                            objectFit: 'contain'  // Giữ tỷ lệ ảnh, toàn bộ ảnh được hiển thị
                                        }}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>


                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Handling Method */}
                    <Box sx={{ mb: 4 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                <Typography variant="h6">Phương thức xử lý:</Typography>
                            </FormLabel>
                            <RadioGroup
                                row
                                value={handlingMethod}
                                onChange={(e) => setHandlingMethod(e.target.value)}
                            >
                                <FormControlLabel value="refund" control={<Radio />} label="Hoàn tiền" />
                                <FormControlLabel value="exchange" control={<Radio />} label="Đổi sản phẩm" />
                                <FormControlLabel value="repair" control={<Radio />} label="Sửa chữa" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    {/* Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Gửi yêu cầu
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ReturnRequestPage;