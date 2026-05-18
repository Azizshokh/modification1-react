import { Member } from "./member";
import { Product } from "./product";

/*** React App State ***/
export interface AppRootState {
    homePage: HomePageState;
    productsPage: ProductsPageState;
}

/*** HomePage ***/
export interface HomePageState {
    popularProducts: Product[];
    newProducts: Product[];
    topUsers: Member[];
}

/*** ProductsPage ***/
export interface ProductsPageState {
    market: Member | null;
    chosenProduct: Product | null;
    products: Product[];
}

/*** OrdersPage ***/