import { createContext, useContext, useEffect, useState } from "react";
import { Brand } from "~/models/Brand";
import { fetchAllBrand } from "~/service/api";


//Định nghĩa kiểu dữ liệu cho Context
type BrandContextType = {
    brandData: Brand[]; // Dữ liệu thương hiệu 
    fetchBrandData: () => Promise<void>; // Hàm lấy thương hiệu
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [brandData, setBrandData] = useState<Brand[]>([]);

    const fetchBrandData = async () => {
        try {
            await fetchAllBrand()
                .then((res) => {
                    return res.data.result;

                }).then((data) => setBrandData(data))
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchBrandData()
    }, []);

    return (
        <BrandContext.Provider value={{ brandData, fetchBrandData }}>
            {children}
        </BrandContext.Provider>
    );
}

//Hook tiện dùng để lấy thông tin auth ở các component khác
export const useBrand = () => {
    const context = useContext(BrandContext);
    if (!context) throw new Error("useBrand buộc phải được sử dụng trong BrandProvider");
    return context;
};


export { BrandContext, BrandProvider }