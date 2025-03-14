import React, { useState } from 'react';
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

const ReturnRequestPage = () => {
    // Sample order data
    const orderData = {
        orderId: 'ORDER#12345',
        items: [
            { id: 1, name: 'Laptop HP', quantity: 1, maxQuantity: 1 },
            { id: 2, name: 'PC Dell Inspiron', quantity: 2, maxQuantity: 2 },
            { id: 3, name: 'Chuột Logitech', quantity: 1, maxQuantity: 1 }
        ]
    };

    // State for form
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
            const item = orderData.items.find(item => item.id === itemId);
            setReturnQuantities({
                ...returnQuantities,
                [itemId]: 1
            });
        }
    };

    // Handle quantity change
    const handleQuantityChange = (event, itemId) => {
        const item = orderData.items.find(item => item.id === itemId);
        let value = parseInt(event.target.value, 10);

        // Validate quantity
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > item.maxQuantity) {
            value = item.maxQuantity;
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
    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedReasons = Object.keys(reasons).filter(key => reasons[key]);
        const formData = {
            orderId: orderData.orderId,
            items: Object.keys(selectedItems)
                .filter(itemId => selectedItems[itemId])
                .map(itemId => ({
                    id: parseInt(itemId, 10),
                    name: orderData.items.find(item => item.id === parseInt(itemId, 10)).name,
                    quantity: returnQuantities[itemId] || 1
                })),
            reasons: selectedReasons,
            description,
            handlingMethod,
            evidenceFiles: files
        };
        console.log('Form submitted:', formData);
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

                        {orderData.items.map((item) => (
                            <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mb: 1 }}>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!selectedItems[item.id]}
                                                onChange={(e) => handleItemSelect(e, item.id)}
                                            />
                                        }
                                        label={item.name}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số lượng"
                                        type="number"
                                        size="small"
                                        disabled={!selectedItems[item.id]}
                                        value={returnQuantities[item.id] || ''}
                                        onChange={(e) => handleQuantityChange(e, item.id)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Typography variant="caption">
                                                        (Tối đa: {item.maxQuantity})
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                min: 1,
                                                max: item.maxQuantity
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