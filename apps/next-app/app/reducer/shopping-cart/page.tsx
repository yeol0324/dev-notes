"use client";
import { useReducer, useMemo } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

type Coupon = {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
};

type CartState = {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  shippingMethod: "standard" | "express" | null;
  isLoading: boolean;
  error: string | null;
};

// 액션 타입 정의
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "APPLY_COUPON"; payload: Coupon }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_SHIPPING"; payload: "standard" | "express" }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "BATCH_UPDATE"; payload: Partial<CartState> };

// Reducer 함수
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        if (existingItem.quantity >= action.payload.stock) {
          return {
            ...state,
            error: "재고가 부족합니다.",
          };
        }

        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          error: null,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        error: null,
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        error: null,
      };

    case "UPDATE_QUANTITY": {
      const item = state.items.find((i) => i.id === action.payload.id);

      if (!item) return state;

      if (action.payload.quantity > item.stock) {
        return {
          ...state,
          error: `최대 ${item.stock}개까지 구매 가능합니다.`,
        };
      }

      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: action.payload.id,
        });
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        error: null,
      };
    }

    case "APPLY_COUPON": {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      if (subtotal < 10000 && action.payload.type === "percentage") {
        return {
          ...state,
          error: "쿠폰 사용을 위한 최소 금액은 10,000원입니다.",
        };
      }

      return {
        ...state,
        appliedCoupon: action.payload,
        error: null,
      };
    }

    case "REMOVE_COUPON":
      return {
        ...state,
        appliedCoupon: null,
      };

    case "SET_SHIPPING":
      return {
        ...state,
        shippingMethod: action.payload,
      };

    case "CLEAR_CART":
      return {
        items: [],
        appliedCoupon: null,
        shippingMethod: null,
        isLoading: false,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "BATCH_UPDATE":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
  shippingMethod: null,
  isLoading: false,
  error: null,
};

export default function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const calculations = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    if (state.appliedCoupon) {
      discount =
        state.appliedCoupon.type === "percentage"
          ? subtotal * (state.appliedCoupon.discount / 100)
          : state.appliedCoupon.discount;
    }

    const shippingCost = state.shippingMethod === "express" ? 5000 : 3000;
    const total =
      subtotal - discount + (state.items.length > 0 ? shippingCost : 0);

    return { subtotal, discount, shippingCost, total };
  }, [state.items, state.appliedCoupon, state.shippingMethod]);

  const handleAddItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const handleCheckout = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({ type: "CLEAR_CART" });
      alert("주문이 완료되었습니다!");
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "주문 처리 중 오류가 발생했습니다.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const sampleProducts: Product[] = [
    { id: "1", name: "노트북", price: 1500000, stock: 5 },
    { id: "2", name: "마우스", price: 50000, stock: 10 },
    { id: "3", name: "키보드", price: 120000, stock: 7 },
  ];

  const sampleCoupon: Coupon = {
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>장바구니</h1>

      {state.error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {state.error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h2>상품 추가</h2>
        {sampleProducts.map((product) => (
          <div
            key={product.id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{product.name}</strong> - {product.price.toLocaleString()}
              원
              <br />
              <small>재고: {product.stock}개</small>
            </div>
            <button onClick={() => handleAddItem(product)}>추가</button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>장바구니 ({state.items.length})</h2>
        {state.items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <br />
                {item.price.toLocaleString()}원 × {item.quantity}개 ={" "}
                {(item.price * item.quantity).toLocaleString()}원
              </div>
              <div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_QUANTITY",
                      payload: {
                        id: item.id,
                        quantity: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  style={{ width: "60px", marginRight: "10px" }}
                  min="0"
                  max={item.stock}
                />
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_ITEM", payload: item.id })
                  }
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {state.items.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h3>쿠폰</h3>
            {state.appliedCoupon ? (
              <div>
                적용된 쿠폰: {state.appliedCoupon.code}(
                {state.appliedCoupon.discount}
                {state.appliedCoupon.type === "percentage" ? "%" : "원"} 할인)
                <button
                  onClick={() => dispatch({ type: "REMOVE_COUPON" })}
                  style={{ marginLeft: "10px" }}
                >
                  제거
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  dispatch({ type: "APPLY_COUPON", payload: sampleCoupon })
                }
              >
                WELCOME10 쿠폰 적용 (10% 할인)
              </button>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>배송 방법</h3>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                checked={state.shippingMethod === "standard"}
                onChange={() =>
                  dispatch({ type: "SET_SHIPPING", payload: "standard" })
                }
              />
              일반 배송 (3,000원)
            </label>
            <label>
              <input
                type="radio"
                checked={state.shippingMethod === "express"}
                onChange={() =>
                  dispatch({ type: "SET_SHIPPING", payload: "express" })
                }
              />
              빠른 배송 (5,000원)
            </label>
          </div>
        </>
      )}

      {state.items.length > 0 && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>소계:</span>
            <span>{calculations.subtotal.toLocaleString()}원</span>
          </div>
          {calculations.discount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "red",
              }}
            >
              <span>할인:</span>
              <span>-{calculations.discount.toLocaleString()}원</span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>배송비:</span>
            <span>
              {state.shippingMethod
                ? calculations.shippingCost.toLocaleString()
                : 0}
              원
            </span>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <span>총액:</span>
            <span>{calculations.total.toLocaleString()}원</span>
          </div>
        </div>
      )}

      {state.items.length > 0 && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleCheckout}
            disabled={state.isLoading || !state.shippingMethod}
            style={{
              flex: 1,
              padding: "15px",
              fontSize: "16px",
              backgroundColor: state.shippingMethod ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: state.shippingMethod ? "pointer" : "not-allowed",
            }}
          >
            {state.isLoading ? "처리중..." : "주문하기"}
          </button>
          <button
            onClick={() => dispatch({ type: "CLEAR_CART" })}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            비우기
          </button>
        </div>
      )}

      {state.items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          장바구니가 비어있습니다.
        </div>
      )}
    </div>
  );
}
