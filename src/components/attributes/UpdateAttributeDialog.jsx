import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { UpdateAttributeDetail } from "../../services/attributeService";

const UpdateAttributeDetailsDialog = ({ open, onClose, attribute, onSuccess }) => {
  const [editedDetails, setEditedDetails] = useState([]);

  useEffect(() => {
    if (attribute && attribute.details) {
      // Tạo bản sao của mảng details để chỉnh sửa
      setEditedDetails(attribute.details.map(detail => ({ ...detail })));
    }
  }, [attribute]);

  const handleChange = (index, field, value) => {
    setEditedDetails(prev => {
      const newDetails = [...prev];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return newDetails;
    });
  };

  const handleSubmit = async () => {
    // Duyệt qua các chi tiết để kiểm tra xem có thay đổi hay không
    for (let i = 0; i < editedDetails.length; i++) {
      const originalDetail = attribute.details[i];
      const editedDetail = editedDetails[i];
      // Nếu có thay đổi, gọi API cập nhật
      if (
        originalDetail.value !== editedDetail.value ||
        originalDetail.priceModifier !== editedDetail.priceModifier
      ) {
        try {
          await UpdateAttributeDetail(
            attribute.attributeId,
            editedDetail.attributeDetailId,
            {
              value: editedDetail.value,
              priceModifier: editedDetail.priceModifier,
            }
          );
        } catch (error) {
          console.error(
            "Error updating detail with id",
            editedDetail.attributeDetailId,
            error
          );
        }
      }
    }
    alert("Cập nhật chi tiết thuộc tính thành công!");
    onSuccess && onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Cập nhật chi tiết thuộc tính: {attribute.name}
      </DialogTitle>
      <DialogContent>
        {editedDetails.map((detail, index) => (
          <Grid container spacing={2} key={detail.attributeDetailId} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                label="Giá trị"
                fullWidth
                value={detail.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price Modifier"
                type="number"
                fullWidth
                value={detail.priceModifier}
                onChange={(e) =>
                  handleChange(index, "priceModifier", Number(e.target.value))
                }
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAttributeDetailsDialog;
