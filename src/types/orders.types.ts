interface OrderRequestBody {
  items: string[];
  delivery: {
    address: string;
    receiver: string;
    contact: string;
  };
  totalQuantity: number;
  totalPrice: number;
  firstBookTitle: string;
}

export { OrderRequestBody };
