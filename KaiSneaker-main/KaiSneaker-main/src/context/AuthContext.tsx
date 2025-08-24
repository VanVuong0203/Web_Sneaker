import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; //Thư viện để đọc/ghi cookie trong JS
import { jwtDecode, JwtPayload } from "jwt-decode"; //Thư viện giải mã JWT
import axios from "axios";
import { User } from "~/models/User";
import { fetchCartByUserId, fetchUserByName } from "~/service/api";

//Định nghĩa kiểu dữ liệu cho Context
type AuthContextType = {
  isAuthenticated: boolean; // Người dùng đã đăng nhập chưa?
  userData: User | null; // Dữ liệu người dùng (nếu có)
  login: (username: string, password: string) => Promise<void>; // Hàm đăng nhập
  logout: () => void; // Hàm đăng xuất
  shoppingCartLength: number; // Số lượng sản phẩm trong giỏ hàng
  fetchUserShoppingCart: () => Promise<void>; // Hàm lấy giỏ hàng của người dùng
  fetchUserData: () => Promise<void>; // Hàm lấy thông tin của người dùng
};


//Tạo context để chia sẻ trạng thái đăng nhập
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái đăng nhập
  const [userData, setUserData] = useState<User | null>(null); // Dữ liệu người dùng (nếu có)
  const [shoppingCartLength, setShoppingCartLength] = useState<number>(0); // Số lượng sản phẩm trong giỏ hàng]


  //Kiểm tra khi load trang lần đầu: nếu có token trong cookie => đã đăng nhập
  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token); //true nếu token tồn tại
  }, []);


  const fetchUserData = async () => {
    if (isAuthenticated) {
      const token = Cookies.get("token");
      if (token) {
        type DecodedToken = JwtPayload & { username?: string, role?: string }; // Custom type with username
        const decoded = await jwtDecode<DecodedToken>(token);

        const res = await fetchUserByName(decoded.sub || "");

        if (res.data.success) {
          console.log(res.data.result);

          setUserData(res.data.result);
        }
      }
    } else {
      setUserData(null); // Nếu chưa đăng nhập thì xóa thông tin người dùng
    }
  };

  const fetchUserShoppingCart = async () => {
    if (isAuthenticated) {
      try {
        if (userData?.idAccount) {
          const res = await fetchCartByUserId(userData.idAccount);
          if (res.data.success) {
            setShoppingCartLength(res.data.result.length);
          }
        }
      } catch (error: unknown) {
        setShoppingCartLength(0);

      }
    }
  }


  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserShoppingCart();
  }, [userData]);

  //Hàm login: gọi API, nếu thành công thì lưu token vào cookie
  const login = async (username: string, password: string) => {
    const response = await axios.post("http://localhost:8088/login", {
      username,
      password,
    }, {
      withCredentials: true, //Cho phép gửi & nhận cookie giữa frontend/backend
    });

    Cookies.set("token".trim(), response.data.result.token); //Ghi cookie nếu server không set tự động
    setIsAuthenticated(true); //Đánh dấu đã đăng nhập
  };

  //Hàm logout: xóa token khỏi cookie
  const logout = () => {
    Cookies.remove("token"); //Xóa JWT
    setIsAuthenticated(false); //Cập nhật trạng thái
  };

  return (
    <AuthContext.Provider value={{ userData, isAuthenticated, login, logout, shoppingCartLength, fetchUserShoppingCart, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

//Hook tiện dùng để lấy thông tin auth ở các component khác
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth buộc phải được sử dụng trong AuthProvider");
  return context;
};
