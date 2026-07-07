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

            return this.normalizeOrders(result.data);
        } catch (err) {
            throw err;
        }
    }

    private normalizeOrders(data: unknown): Order[] {
        if (Array.isArray(data)) return data;

        if (data && typeof data === "object") {
            const response = data as {
                data?: unknown;
                orders?: unknown;
                list?: unknown;
            };

            if (Array.isArray(response.data)) return response.data;
            if (Array.isArray(response.orders)) return response.orders;
            if (Array.isArray(response.list)) return response.list;

            if (response.data && typeof response.data === "object") {
                const nested = response.data as {
                    orders?: unknown;
                    list?: unknown;
                };

                if (Array.isArray(nested.orders)) return nested.orders;
                if (Array.isArray(nested.list)) return nested.list;
            }
        }

        return [];
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
