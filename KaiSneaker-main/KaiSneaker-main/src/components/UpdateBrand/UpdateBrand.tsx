import classNames from 'classnames/bind';
import styles from './UpdateBrand.module.scss';
import { useLocation } from 'react-router-dom';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faArrowUp } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../Image/Image';
import { updateBrand } from '~/service/api';
import { toast } from 'react-toastify';
import { Brand } from '~/models/Brand';

const cx = classNames.bind(styles);

const UpdateBrand = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [stateBrand, setStateBrand] = useState<Brand>(location.state?.data);
    const brandData = [location.state?.data]


    useEffect(() => {
        if (!location.state?.data) {
            navigate("/admin/brand");
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSubmitUpdateBrand(stateBrand);
    };

    const handleSubmitUpdateBrand = (data: Brand) => {
        try {
            updateBrand(data.idBrand, {
                brandName: data.brandName,
                descriptionBrand: data.descriptionBrand,
                imageBrand: data.imageBrand
            })
                .then((res) => {
                    if (res.data?.success) {
                        toast.success('Cập nhật thương hiệu thành công!!');
                        navigate('/admin/brand');
                    } else if (!res.data?.success) {
                        toast.error('Cập nhật thương hiệu thất bại!!');
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    // check coi có thay đổi dữ liệu không
    const checkChangeDataBrand = () => {
        if (JSON.stringify(brandData[0]) === JSON.stringify(stateBrand)) {
            return true;
        } else {
            return false;
        }
    };

    // Convert input sang base 64
    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const base64 = await convertBase64(file);
            setStateBrand((prev) => ({
                ...prev,
                imageBrand: base64 as string,
            }));
        } catch (error) {
            console.error("Error converting image:", error);
        }
    };

    const convertBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <h2 className={cx('heading')}>Cập nhật thương hiệu</h2>
                    <Button
                        to={"/admin/brand"}
                        rightIcon={<FontAwesomeIcon icon={faXmark} />}
                        className={cx('btn_cancel')}
                    >
                        Hủy
                    </Button>
                </div>

                <div className={cx('update_form')}>
                    <form className={cx('category-list')}
                        onSubmit={handleSubmit}
                    >
                        <div className={cx('product_img')}>
                            <div className={cx('img_item')}>
                                <div className={cx('file_upload')}>
                                    <input
                                        className={cx('upload')}
                                        type="file"
                                        accept="image/*" // Chỉ chấp nhận hình ảnh
                                        disabled={stateBrand?.imageBrand ? true : false}
                                        onChange={(e) => uploadImage(e)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faArrowUp}
                                        className={cx(stateBrand?.imageBrand ? 'fadeout' : '')}
                                    ></FontAwesomeIcon>
                                    <div className={cx('img_box', stateBrand?.imageBrand ? 'fadein' : ''
                                    )}>
                                        <Image
                                            alt={stateBrand?.brandName ? stateBrand?.brandName : ''}
                                            className={cx('img')}
                                            src={stateBrand?.imageBrand ? stateBrand?.imageBrand : ''}
                                        />
                                        <div className={cx('delete_box', stateBrand?.imageBrand ? 'active' : ''
                                        )}>
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                className={cx('btn_delete')}
                                                onClick={() => setStateBrand({ ...stateBrand, imageBrand: "" })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('category_box')}>
                            <div className={cx('category-item')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Tên danh mục
                                </label>
                                <input
                                    className={cx('input-item')}
                                    type="text"
                                    value={stateBrand?.brandName}
                                    placeholder="Tên danh mục"
                                    onChange={(e) =>
                                        setStateBrand({ ...stateBrand, brandName: e.target.value })
                                    } />
                            </div>
                            <div className={cx('category-item')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Mô tả danh mục
                                </label>
                                <textarea
                                    className={cx('input-item-description')}
                                    cols={54}
                                    value={stateBrand?.descriptionBrand}
                                    rows={10}
                                    onChange={(e) => {
                                        setStateBrand({
                                            ...stateBrand,
                                            descriptionBrand: e.target.value
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <button className={cx('btn_update')}
                            disabled={checkChangeDataBrand()}
                        >
                            Update
                        </button>
                    </form>
                </div >
            </div >
        </>
    );
}

export default UpdateBrand;
