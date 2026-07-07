import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async getProducts(input: ProductInquiry): Promise<Product[]> {
        try {
            const page = input.page ?? 1;
            const limit = input.limit ?? 8;
            const order = input.order ?? "createdAt";
            let url = `${this.path}/product/all?page=${page}&limit=${limit}&order=${order}`;
            if (input.productCollection)
                url += `&productCollection=${input.productCollection}`;
            if (input.search)
                url += `&search=${input.search}`;

            const result = await axios.get(url, { withCredentials: true });

            return this.normalizeProducts(result.data);
        } catch (err) {
            throw err;
        }
    }

    private normalizeProducts(data: unknown): Product[] {
        if (Array.isArray(data)) return data;

        if (data && typeof data === "object") {
            const response = data as {
                data?: unknown;
                products?: unknown;
                list?: unknown;
            };

            if (Array.isArray(response.data)) return response.data;
            if (Array.isArray(response.products)) return response.products;
            if (Array.isArray(response.list)) return response.list;

            if (response.data && typeof response.data === "object") {
                const nested = response.data as {
                    products?: unknown;
                    list?: unknown;
                };

                if (Array.isArray(nested.products)) return nested.products;
                if (Array.isArray(nested.list)) return nested.list;
            }
        }

        return [];
    }

    public async getProduct(productId: string): Promise<Product> {
        try {
            const url = `${this.path}/product/${productId}`;
            const result = await axios.get(url, { withCredentials: true });

            return result.data;
        } catch (err) {
            throw err;
        }
    }

}

export default ProductService;
