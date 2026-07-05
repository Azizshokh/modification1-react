import axios from "axios";
import { serverApi } from "../../lib/config";
import {
    Order,
    OrderInquiry,
    OrderItemInput,
    OrderUpdateInput,
} from "../../lib/types/order";
import { CartItem } from "../../lib/types/search";

class OrderService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async createOrder(input: CartItem[]): Promise<Order> {
        try {
            const orderItem: OrderItemInput[] = input.map((cartItem: CartItem) => ({
                itemQuantity: cartItem.quantity,
                itemPrice: cartItem.price,
                productId: cartItem._id,
            }));


            const url = `${this.path}/order/create`;
            const result = await axios.post(url, orderItem, { withCredentials: true });

            return result.data;
        } catch (err) {
            throw err;
        }
    }

    public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
        try {
            let url = `${this.path}/order/all?page=${input.page}&limit=${input.limit}`;
            if (input.orderStatus) url += `&orderStatus=${input.orderStatus}`;

            const result = await axios.get(url, {
                withCredentials: true,
                // Backend responds with 404 when the user has no orders for the
                // requested status. Accept it so axios does not reject the call.
                validateStatus: (status) =>
                    (status >= 200 && status < 300) || status === 404,
            });

            if (result.status === 404) return [];

            return result.data;
        } catch (err) {
            throw err;
        }
    }

    public async updateOrder(input: OrderUpdateInput): Promise<Order> {
        try {
            const url = `${this.path}/order/update`;
            const result = await axios.post(url, input, { withCredentials: true });

            return result.data;
        } catch (err) {
            throw err;
        }
    }
}

export default OrderService;
