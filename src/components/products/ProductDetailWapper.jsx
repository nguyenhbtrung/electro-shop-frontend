import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';

const ProductDetailWrapper = () => {
  const { id } = useParams();
  return <ProductDetail productId={parseInt(id, 10)} />;
};

export default ProductDetailWrapper;
