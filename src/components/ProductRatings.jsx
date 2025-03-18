import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import axios from "axios";

const ProductRatings = ({ productId }) => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`/api/ratings/${productId}`);
                setRatings(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (productId) {
            fetchRatings();
        }
    }, [productId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Đánh giá</Typography>
            <List>
                {ratings.map((rating) => (
                    <ListItem key={rating.UserId}>
                        <ListItemText
                            primary={`Rating: ${rating.RatingScore}`}
                            secondary={`Content: ${rating.RatingContent}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ProductRatings ;
