import classNames from 'classnames/bind';
import styles from './addProduct.module.scss';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faChevronDown, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Image from '~/components/Image/Image';
import { createProduct, fetchAllBrand, ProductDTO, updateProduct } from '~/service/api';
import { Brand } from '~/models/Brand';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const AddProduct = () => {
    const [brandData, setBrandData] = useState<Brand[]>([]);
    let location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        document.title = `Thêm sản phẩm`;
    }, []);

    const [dataProduct, setDataProduct] = useState<ProductDTO>({
        shoesName: "",
        shoesPrice: 0,
        shoesDescription: "",
        shoesImg: [],
        brand: {
            idBrand: '----',
        }
    });

    const [errVal, setErrVal] = useState({
        shoesName: "",
        shoesPrice: "",
        brand: ""
    })
    const validateForm = () => {
        const errors = {
            shoesName: "",
            shoesPrice: "",
            brand: ""
        };
        if (!dataProduct.shoesName.trim()) {
            errors.shoesName = "Tên sản phẩm không được để trống nhé";
        }
        if (!dataProduct.shoesPrice) {
            errors.shoesPrice = "Giá sản phẩm không được để trống nhé";
        } else if (dataProduct.shoesPrice <= 0) {
            errors.shoesPrice = "Giá sản phẩm phải lớn hơn 0";
        }

        if (dataProduct.brand.idBrand === '----') {
            errors.brand = "Vui lòng chọn thương hiệu";
        }

        return errors;
    };

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataProduct({ ...dataProduct, [name]: value })
    }


    const getBrand = async () => {
        try {
            const isNewItemPage = location.pathname.endsWith('/new-item');

            if (!isNewItemPage && location.state?.data) {
                setDataProduct({
                    ...dataProduct,
                    shoesName: location.state.data.shoesName,
                    shoesPrice: location.state.data.shoesPrice,
                    shoesDescription: location.state.data.shoesDescription,
                    shoesImg: location.state.data.shoesImg,
                    brand: { ...dataProduct.brand, idBrand: location.state.data.brand.idBrand }
                });
            }

            const res = await fetchAllBrand();

            if (res.data?.success) {
                setBrandData(res.data.result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        if (!location.state?.data?.shoesId && !location.pathname.endsWith('/new-item')) {
            navigate("/admin/products")
        }
        getBrand();
    }, [])

    const handleCreateProduct = async (data: ProductDTO) => {

        try {
            const res = await createProduct(data)
            if (res.data.success) {
                toast.success("Thêm sản phẩm thành công!!!");
                setErrVal({
                    shoesName: "",
                    shoesPrice: "",
                    brand: ""
                })
                navigate('/admin/products');
            }

        } catch (error: any) {
            console.log(error.response.data.message);
            toast.error('Thêm sản phẩm thất bại !!!');

        }
    };

    const handleSubmitUpdateProduct = async (idProduct: UUID, data: ProductDTO) => {

        try {
            const res = await updateProduct(idProduct, data)
            if (res.data.success) {
                toast.success('Cập nhật sản phẩm thành công !!!');
                setErrVal({
                    shoesName: "",
                    shoesPrice: "",
                    brand: ""
                })
                navigate('/admin/products');
            }

        } catch (error) {
            console.log(error);
            toast.error('Cập nhật sản phẩm thất bại !!!');

        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const idProduct: UUID = location?.state?.data.shoesId;

        const newErrors = validateForm();
        setErrVal(newErrors);

        // Nếu có lỗi thì không submit
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }

        if (location.state?.data.shoesId) {
            handleSubmitUpdateProduct(idProduct, dataProduct)
        }
        else {
            handleCreateProduct(dataProduct);
        }
    };



    // Convert input sang base 64
    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const base64 = await convertBase64(file);
            const updatedImages = [...dataProduct.shoesImg];
            updatedImages[index] = base64 as string; // 👈 cập nhật đúng index

            setDataProduct({
                ...dataProduct,
                shoesImg: updatedImages
            });
        } catch (error) {
            console.error("Error converting image:", error);
        }
    };

    const convertBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const loadViewImgItem = () => {
        const elements = [];
        for (let i = 0; i < 4; i++) {
            elements.push(
                <div className={cx('img_item')} key={`${dataProduct?.shoesImg[i]} + [${i}]`}>
                    <div className={cx('file_upload')}>
                        <input
                            className={cx('upload')}
                            type="file"
                            accept="image/png" // Chỉ chấp nhận hình ảnh
                            disabled={dataProduct?.shoesImg[i] ? true : false}
                            onChange={(e) => uploadImage(e, i)}
                        />
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            className={cx(dataProduct?.shoesImg[i] ? 'fadeout' : '')}
                        ></FontAwesomeIcon>
                        <div className={cx('img_box',
                            dataProduct?.shoesImg[i] ? 'fadein' : ''
                        )}>
                            {dataProduct?.shoesImg[i] && (
                                <Image
                                    alt={dataProduct?.shoesName}
                                    className={cx('img')}
                                    src={dataProduct?.shoesImg[i]}
                                />
                            )}
                            <div className={cx('delete_box',
                                dataProduct?.shoesImg[i] ? 'active' : ''
                            )}>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className={cx('btn_delete')}
                                    onClick={() => {
                                        const newShoesImg = [...dataProduct.shoesImg];
                                        newShoesImg[i] = "";
                                        setDataProduct({
                                            ...dataProduct,
                                            shoesImg: newShoesImg
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            );
        }

        return <>{elements}</>;
    }

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <h2 className={cx('heading')}>
                        {location.state?.data ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                    </h2>
                    <Button
                        rightIcon={<FontAwesomeIcon icon={faXmark} />}
                        to={"/admin/products"}
                        className={cx('close-btn')}
                    >
                        Hủy
                    </Button>
                </div>
                <form className={cx('product')}
                    onSubmit={handleSubmit}
                >
                    <div className={cx('group')}>
                        <div className={cx('info')}>
                            <label htmlFor="name" className={cx('info-heading')}>
                                Tên sản phẩm
                            </label>
                            <input
                                className={cx('info-txt')}
                                type="text"
                                id="name"
                                value={dataProduct.shoesName}
                                name='shoesName'
                                onChange={(e) => handleChangeInput(e)}
                            />
                            {errVal.shoesName && <small className={cx("error_message")}>{errVal.shoesName}</small>}
                        </div>
                    </div>
                    <div className={cx('group')}>
                        <div className={cx('info')}>
                            <label htmlFor="price" className={cx('info-heading')}>
                                Giá tiền
                            </label>
                            <input
                                className={cx('info-txt')}
                                type="number"
                                id="price"
                                name='shoesPrice'
                                min={0}
                                value={dataProduct.shoesPrice}
                                onChange={(e) => handleChangeInput(e)}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                            {errVal.shoesPrice && <small className={cx("error_message")}>{errVal.shoesPrice}</small>}

                        </div>
                        <div className={cx('select-box')}>
                            <input type="checkbox" className={cx('select_view')} />
                            <div className={cx('select-button')}>
                                <div className={cx('selected-value')}>
                                    <span>
                                        {location.state?.data
                                            ? location?.state.brandName
                                            : brandData.length > 0
                                                ? 'Chọn thương hiệu'
                                                : 'Chưa có thương hiệu'}
                                    </span>
                                </div>
                                <div className={cx('chevrons')}>
                                    <FontAwesomeIcon className={cx('action-show')} icon={faChevronUp} />
                                    <FontAwesomeIcon className={cx('action-show')} icon={faChevronDown} />
                                </div>
                            </div>
                            <div className={cx('options')}>
                                {brandData.length > 0 ? (
                                    brandData.map((brand) => {
                                        return (
                                            <div className={cx('option')}
                                                key={brand.idBrand}
                                            >
                                                <input
                                                    className={cx('s-c', 'top')}
                                                    type="radio"
                                                    name="brand"
                                                    value={brand.idBrand}
                                                    checked={dataProduct.brand.idBrand === brand.idBrand}
                                                    onChange={(e) => setDataProduct({ ...dataProduct, brand: { ...dataProduct.brand, idBrand: e.target.value as UUID } })}
                                                />
                                                <input
                                                    className={cx('s-c', 'bottom')}
                                                    type="radio"
                                                    name="brand"
                                                    value={brand.idBrand}
                                                    checked={dataProduct.brand.idBrand === brand.idBrand}

                                                    onChange={(e) => setDataProduct({ ...dataProduct, brand: { ...dataProduct.brand, idBrand: e.target.value as UUID } })}
                                                />
                                                <Image
                                                    src={brand.imageBrand !== null ? brand.imageBrand : ''}
                                                    className={cx('logo_brand')}
                                                ></Image>
                                                <span className={cx('item_label')}>
                                                    {brand.brandName}
                                                </span>
                                                <span className={cx('opt-val')}>
                                                    {brand.brandName}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <></>
                                )}
                                <div className={cx('option-bg')}></div>
                            </div>
                            {errVal.brand && <small className={cx("error_message")}>{errVal.brand}</small>}
                        </div>
                    </div>
                    <div className={cx('description')}>
                        <div className={cx('description_item')}>
                            <h2 className={cx('item_heading')}>Mô tả sản phẩm</h2>
                            <div className={cx('item_content')}>
                                <CKEditor
                                    editor={ClassicEditor as any}
                                    data={location.state?.data ? location.state?.data?.shoesDescription : ''}
                                    onChange={( editor: any) => {
                                        const data = editor.getData();
                                        setDataProduct({ ...dataProduct, shoesDescription: data });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('product_img')}>
                        {loadViewImgItem()}
                    </div>
                    <button type="submit" className={cx('btn_add')}>Save</button>
                </form>
            </div >
        </>
    );
}

export default AddProduct;
