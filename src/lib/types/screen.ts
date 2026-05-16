import { Member } from "./member";
import { Product } from "./product";

/*** React App State ***/
export interface AppRootState {
    homePage: HomePageState;
}

/*** HomePage ***/
export interface HomePageState {
    popularProducts: Product[];
    newProducts: Product[];
    topUsers: Member[];
}

/*** ProductsPage ***/

/*** OrdersPage ***/