// import React, { useState, useEffect } from "react";
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     TextField,
//     Grid,
// } from "@mui/material";

// const UpdateRating = ({ open, onClose, onSubmit, reason }) => {
//     const [ratingScore, setRatingScore] = useState("");
//     const [ratingContent, setRatingContent] = useState("");
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (reason) {
//             setRatingScore(reason.ratingScore);
//             setRatingContent(reason.ratingContent);
//         }
//     }, [reason]);

//     const handleSubmit = () => {
//         if (ratingScore.trim() === "") {
//             setError("Vui lòng nhập nội dung lý do hoàn trả.");
//             return;
//         }
//         // Chuẩn bị DTO cho rating
//         const updatedRating = {
//             score: ratingScore.trim(),
//             content: ratingContent.trim(),
//         };

//         onSubmit(updatedRating);
//         setRatingScore("");
//         setRatingContent("");
//         setError("");
//     };

//     const handleCancel = () => {
//         setError("");
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
//             <DialogTitle>Cập nhật đánh giá</DialogTitle>
//             <DialogContent dividers>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                         <TextField
//                             label="Nội dung đánh giá"
//                             fullWidth
//                             value={ratingScore}
//                             onChange={(e) => setRatingScore(e.target.value)}
//                             error={!!error}
//                             helperText={error || "Tối đa 5 ký tự"}
//                         />
//                     </Grid>
//                     <Grid item xs={12}>
//                         <TextField
//                             label="Nội dung đánh giá"
//                             fullWidth
//                             value={ratingContent}
//                             onChange={(e) => setRatingContent(e.target.value)}
//                             error={!!error}
//                             helperText={error || "Tối đa 255 ký tự"}
//                         />
//                     </Grid>
//                 </Grid>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleCancel} color="secondary">
//                     Huỷ
//                 </Button>
//                 <Button onClick={handleSubmit} variant="contained" color="primary">
//                     Cập nhật
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default UpdateRating;
