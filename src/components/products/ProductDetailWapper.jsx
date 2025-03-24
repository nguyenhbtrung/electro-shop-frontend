import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { GetProduct } from '../../services/productService';
import { ProductPricing } from '../../services/attributeService';
import { CreateProductViewHistory } from '../../services/historyService';

const ProductDetailWrapper = () => {
  const { id } = useParams();
  const productId = parseInt(id, 10);

  const [product, setProduct] = useState(null);
  const [defaultSelectedAttributes, setDefaultSelectedAttributes] = useState({});
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const CreateHistory = async () => {

      const res = await CreateProductViewHistory(id);

    }

    CreateHistory();
    // Lấy dữ liệu sản phẩm
    GetProduct(productId)
      .then(response => {
        const productData = response.data;
        setProduct(productData);

        // Nhóm các attribute theo tên nhóm
        const grouped = productData.productAttributeDetail.reduce((acc, detail) => {
          const groupName = detail.productAttributeName;
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(detail);
          return acc;
        }, {});

        // Lấy lựa chọn mặc định: giá trị đầu tiên của mỗi nhóm
        const defaults = {};
        for (const groupName in grouped) {
          if (grouped[groupName].length > 0) {
            defaults[groupName] = grouped[groupName][0].attributeDetailId;
          }
        }
        setDefaultSelectedAttributes(defaults);

        // Chuyển đổi object thành mảng các id
        const defaultSelectedIds = Object.values(defaults);

        // Gọi API tính giá với các lựa chọn mặc định
        return ProductPricing(productId, defaultSelectedIds);
      })
      .then(response => {
        setPricingData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div>Loading...</div>;

  return (
    <ProductDetail
      product={product}
      defaultSelectedAttributes={defaultSelectedAttributes}
      pricingData={pricingData}
      productId={productId}
    />
  );
};

export default ProductDetailWrapper;
