import { Routes, Route } from "react-router-dom";
import UserLayout from "../user/layout/UserLayout";

import Dashboard from "../user/view/Dashboard";
import AddCategory from "../user/view/AddCategory";
import CategoryList from "../user/view/CategoryList";
import AddSubCategory from "../user/view/AddSubCategory";
import SubCategoryList from "../user/view/SubCategoryList";
import AddUnit from "../user/view/AddUnit";
import UnitList from "../user/view/UnitList";
import AddProduct from "../user/view/AddProduct";
import ProductList from "../user/view/ProductList";
import AddSlider from "../user/view/AddSlider";
import SliderList from "../user/view/SliderList";
import PendingOrder from "../user/view/PendingOrder";
import ApproveOrder from "../user/view/ApproveOrder";
import CompleteOrder from "../user/view/CompleteOrder";
import CancelOrder from "../user/view/CancelOrder";
import Support from "../user/view/Support";
import Inbox from "../user/view/Inbox";
import Outbox from "../user/view/Outbox";
import Profile from "../user/view/Profile";
import NotFound from "../user/view/NotFound";
import EditProduct from "../user/view/EditProduct";

export default function UserRouting() {
    return (
        <Routes>
            <Route path="/user" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="add-category" element={<AddCategory />} />
                <Route path="category-list" element={<CategoryList />} />
                <Route path="add-subcategory" element={<AddSubCategory />} />
                <Route path="subcategory-list" element={<SubCategoryList />} />
                <Route path="add-unit" element={<AddUnit />} />
                <Route path="unit-list" element={<UnitList />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="add-slider" element={<AddSlider />} />
                <Route path="slider-list" element={<SliderList />} />
                <Route path="pending-orders" element={<PendingOrder />} />
                <Route path="confirm-orders" element={<ApproveOrder />} />
                <Route path="complete-orders" element={<CompleteOrder />} />
                <Route path="cancel-orders" element={<CancelOrder />} />
                <Route path="support" element={<Support />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="outbox" element={<Outbox />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}