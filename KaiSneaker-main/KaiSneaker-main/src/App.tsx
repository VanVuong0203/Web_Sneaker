import { Route, Routes } from "react-router"
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout"
import HomePage from "./page/Home/HomePage"
import Sneaker from "./page/Sneaker/Sneaker"
import DefaultWithSidebar from "./layouts/DefaultWithSidebar/DefaultWithSideBar"
import DetailProduct from "./components/DetailProduct/DetailProduct"
import BrandSneaker from "./page/Sneaker/BrandSneaker/BrandSneaker"
import SignIn from "./components/SignIn/SignIn"
import Admin from "./layouts/Admin/Admin"
import Dashboard from "./components/Dashboard/Dashboard"
import AdminBill from "./components/AdminBill/AdminBill"
import AdminSlider from "./components/AdminSlider/AdminSlider"
import AdminProduct from "./components/AdminProduct/AdminProduct"
import AdminStock from "./components/AdminStock/AdminStock"
import CategoryAdmin from "./components/CategoryAdmin/CategoryAdmin"
import AddProduct from "./components/AddProduct/AddProduct"
import UpdateBrand from "./components/UpdateBrand/UpdateBrand"
import { useBrand } from "./context/BrandContext"
import { ScrollToTop } from "./hooks"
// Các route bảo vệ
import PublicRoute from "./routes/PublicRoute"
import AdminRoute from "./routes/AdminRoutes"
import PrivateRoute from "./routes/PrivateRoute"
import ProfileAccount from "./layouts/ProfileAccount/ProfileAccount"
import { useAuth } from "./context/AuthContext"
import Profile from "./page/Profile/Profile"
import AddressProfile from "./page/AddressProfile/AddressProfile"
import Shopping from "./components/Shopping/Shopping"
import ShoppingCart from "./page/ShoppingCart/ShoppingCart"
import Checkout from "./components/Checkout/Checkout"
import ViewBill from "./components/ViewBill/ViewBill"

const App = () => {
  const { brandData } = useBrand(); // Lấy danh sách brand từ context
  const { isAuthenticated } = useAuth();
  return (
    <>
      <ScrollToTop /> {/* Auto scroll lên đầu khi chuyển route */}
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} /> {/* Trang chủ */}
          <Route path="sneaker" element={<DefaultWithSidebar />}>
            <Route index element={<Sneaker />} /> {/* Tất cả sneaker */}

            {/* Các route động theo brand */}
            {brandData &&
              brandData.map((brandData) => (
                <Route
                  key={brandData.brandName}
                  path={brandData.brandName} // /sneaker/nike, /sneaker/adidas
                  element={<BrandSneaker brandName={brandData.brandName} />}
                />
              ))}
          </Route>

          <Route path="sneaker/:product" element={<DetailProduct />} /> {/* Chi tiết sản phẩm */}
        </Route>

        {/* LOGIN-ONLY ROUTES - Nếu đã login thì bị redirect */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<SignIn />} />
        </Route>
        {
          isAuthenticated &&
          <>
            {/* USER-ONLY ROUTES - Đã đăng nhập mới vào được */}
            <Route element={<PrivateRoute />}>
              <Route path="" element={<ProfileAccount />}>
                <Route path="/:nickname/profile" element={<Profile />} /> {/* Thông tin tài khoản */}
                <Route path="/:nickname/address-shipping" element={<AddressProfile />} /> {/* Địa chỉ giao hàng */}
                <Route path="/:nickname/address-shipping" element={<AddressProfile />} /> {/* Địa chỉ giao hàng */}
              </Route>
              <Route path="/:nickname" element={<ShoppingCart />} >
                <Route path="shopping-cart" element={<Shopping />} /> {/* Giỏ hàng */}
                <Route path="checkout" element={<Checkout />} /> {/* Thanh toan */}
              </Route>
            </Route>

            {/* ADMIN-ONLY ROUTES - Kiểm tra quyền admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="bill" element={<AdminBill />} />
                <Route path="bill/:id" element={<ViewBill />} />
                <Route path="stock" element={<AdminStock />} />
                <Route path="brand" element={<CategoryAdmin />} />
                <Route path="products" element={<AdminProduct />} />
                <Route path="products/new-item" element={<AddProduct />} />
                <Route path="products/:product" element={<AddProduct />} />
                <Route path="brand/:id" element={<UpdateBrand />} />
                <Route path="slider" element={<AdminSlider />} />
              </Route>
            </Route>
          </>
        }

      </Routes >
    </>
  )
}

export default App
