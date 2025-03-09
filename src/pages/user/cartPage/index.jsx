import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import Footer from "../../../components/Footer";
import { useState } from "react";

const CartItem = ({ item, onUpdateQuantity, onRemove, isSelected, onSelect }) => {
  return (
    <div className="flex items-center justify-between border border-gray-300 p-4 h-40 mb-4">
      <input
        type="checkbox"
        className="mr-12"
        checked={isSelected}
        onChange={() => onSelect(item.id)}
      />
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover p-4" style={{ paddingTop: '15px', paddingBottom: '15px' }} />
      <div className="flex-1 ml-8">
        <p className="font-semibold">{item.name}</p>
        <p className="text-gray-500 mt-2">{item.price} đ</p>
      </div>
      <div className="flex flex-col justify-between items-end h-full" style={{ paddingTop: '10px', paddingBottom: '10px', paddingRight: '10px' }}>
        <button className="text-red-500" onClick={() => onRemove(item.id)}>✖</button>
        <div className="flex items-center mt-2">
          <button className="px-2 py-1 border border-gray-300" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
          <span className="px-3">{item.quantity}</span>
          <button className="px-2 py-1 border border-gray-300" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Chuột không dây Rapoo M310 Silent",
      price: "165.000",
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Bàn phím cơ Razer BlackWidow V3 Tenkeyless RGB",
      price: "1.590.000",
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    const updatedSelected = selectedItems.includes(id)
      ? selectedItems.filter((itemId) => itemId !== id)
      : [...selectedItems, id];

    setSelectedItems(updatedSelected);
    setSelectAll(updatedSelected.length === cartItems.length);
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce(
      (sum, item) => sum + Number(item.price.replace(/\./g, "")) * item.quantity,
      0
    );

return (
    <div className="max-w-4xl mx-auto p-4"> 
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectAll}
                    onChange={handleSelectAll}
                />
                <span className="font-semibold">Chọn tất cả</span>
            </div>
            <button
                className="text-[#4cceac] font-semibold"
                onClick={() => setCartItems([])}
            >
                Xóa tất cả
            </button>
        </div>
        {cartItems.map((item) => (
            <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleSelectItem}
            />
        ))}
        <div className="flex justify-between items-center p-4 border-t border-gray-300 mt-4">
            <span className="text-lg font-semibold">Tạm tính</span>
            <span className="text-[#4cceac] font-bold">{totalPrice.toLocaleString()} đ</span>
        </div>
        <button
            className="w-full bg-[#4cceac] text-white py-2 mt-2 rounded-lg"
            disabled={selectedItems.length === 0}
        >
            Thanh Toán ({selectedItems.length})
        </button>
    </div>
);
};

export default Cart;

