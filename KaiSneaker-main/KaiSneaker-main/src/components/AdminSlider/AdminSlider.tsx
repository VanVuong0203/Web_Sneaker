import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './adminSlider.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';
import { Slide } from '~/models/Slide';
import { createSlide, deleteSlide, fetchAllSlide, SliderDTO } from '~/service/api';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';

const cx = classNames.bind(styles);

const AdminSlider = () => {

    useEffect(() => {
        document.title = `Slider`; // cập nhật tiêu đề
    }, []);

    const [sliderModal, setSliderModal] = useState(false);
    const [sliderData, setSliderData] = useState<Slide[]>([]);
    const [sliderDataState, setSliderDataState] = useState<SliderDTO>({
        imageUrl: "",
        description: "",
        slideOrder: 1,
    });

    // State lưu trữ lỗi
    const [errors, setErrors] = useState({
        imageUrl: '',
        slideOrder: '',
    });
    //------ sài ticket
    const showBuyTickets = () => {
        setSliderModal(true);

    }
    const hideBuyTickets = () => {
        setSliderModal(false);
        setSliderDataState({
            imageUrl: "",
            description: "",
            slideOrder: 1,
        })
        setErrors({
            slideOrder: "",
            imageUrl: ""
        })
    }
    //------



    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertBase64(file);
                setSliderDataState((prev) => ({
                    ...prev,
                    imageUrl: base64 as string,
                }));
                setErrors(prev => ({ ...prev, imageUrl: "" }));
            } catch (error) {
                console.log(error);
            }
        } else {
            return;
        }
    }

    useEffect(() => {
        getSlide()
    }, []);

    const getSlide = async () => {
        try {
            const res = await fetchAllSlide();
            if (res.data.success) {
                setSliderData(res.data.result)
            }
        } catch (error) {
            console.log(error);

        }
    }

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra nếu order < 1
        if (sliderDataState.slideOrder < 1) {
            setErrors(prev => ({ ...prev, slideOrder: "Vị trí ưu tiên phải lớn hơn hoặc bằng 1" }));
            return;
        } else {
            setErrors(prev => ({ ...prev, slideOrder: '' })); // Xóa lỗi khi order hợp lệ
        }

        // Kiểm tra nếu không có ảnh
        if (!sliderDataState.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: "Ảnh không được để trống" }));
            return;
        } else {
            setErrors(prev => ({ ...prev, imageUrl: "" }));
        }


        await handleSubmitSlide(
            sliderDataState
        );
    };

    const handleSubmitSlide = async (data: SliderDTO) => {
        try {
            const res = await createSlide(data)
            console.log(data);

            if (res.data.success) {
                getSlide();

                hideBuyTickets();
                toast.success("Thêm slider thành công");
            }
        } catch (error) {
            toast.error("Thêm slider thất bại");
        }
    };


    const handleDeleteSlider = async (idSlide: UUID) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa Slide này ? ')) {
            const res = await deleteSlide(idSlide);
            if (res.data.success) {
                toast.success("Xóa Slide thành công");
                hideBuyTickets();
                getSlide();
            } else {
                toast.success("Xóa Slide thất bại");
            }

        }
    }

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <h2 className={cx('heading')}>
                        Chỉnh sửa Slider
                    </h2>
                    <button className={cx('slider-create-btn')} onClick={showBuyTickets}>
                        Thêm mới
                    </button>
                </div>
                <table className={cx('details-table')}>
                    <thead className={cx('details-thead')}>
                        <tr className={cx('details-title-list')}>
                            <td className={cx('details-title-item')}>Vị trí ưu tiên</td>
                            <td className={cx('details-title-item')}>Ảnh</td>
                            <td className={cx('details-title-item')}>Hành động</td>
                        </tr>
                    </thead>
                    <tbody className={cx('details-tbody')} >
                        {sliderData ?
                            sliderData.map((item: Slide) => {
                                return (
                                    <tr className={cx('details-content-list')} key={item.slideId}>
                                        <td className={cx('details-content-item')}>
                                            <div className={cx('details-content-item-priority')}>
                                                {item.slideOrder}
                                            </div>
                                        </td>
                                        <td className={cx('details-content-item')}>
                                            <img
                                                className={cx('details-content-item-img')}
                                                src={item?.imageUrl}
                                            ></img>
                                        </td>
                                        <td className={cx('details-content-item')}>
                                            <Button
                                                className={cx('details-content-item-btn')}
                                                onClick={() => handleDeleteSlider(item.slideId)}
                                            >
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }) : <></>}
                    </tbody>
                </table>
            </div>
            {/* <!-- End adminCategoriesTable --> */}
            {/* <!--Begin Modal --> */}
            <div
                className={cx('modal', sliderModal ? 'open' : '')}
                // lắng nge ra ngoài ; khi click vào khoảng không của modal
                // (ở ngoài cái ticket) sẽ ĐÓNG ticket lại
                onClick={hideBuyTickets}
            >
                <div
                    className={cx('modal-papes')}
                    // ngừng việc nỗi bọt lại;  sẽ không đóng modal container lại nửa (tới đó nó bị công an chặn lại)
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('modal-header')}>
                        <h2 className={cx('modal__heading')}>Vui lòng chọn ảnh slider</h2>
                        <FontAwesomeIcon
                            className={cx('modal-header-icon--close')}
                            // nghe hành vi click vào button close
                            onClick={hideBuyTickets}
                            icon={faXmark}
                        />
                    </div>
                    <form className={cx('category-list')}
                        onSubmit={handleSubmit}
                    >
                        <div className={cx('slider_img')}>
                            <div className={cx('img_item')}>
                                <div className={cx('file_upload')}>
                                    <input
                                        className={cx('upload')}
                                        type="file"
                                        accept="image/*" // Chỉ chấp nhận hình ảnh

                                        disabled={sliderDataState?.imageUrl ? true : false}
                                        onChange={(e) => uploadImage(e)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faArrowUp}
                                        className={cx(sliderDataState?.imageUrl ? 'fadeout' : '')}
                                    ></FontAwesomeIcon>
                                    <div className={cx('img_box',
                                        sliderDataState?.imageUrl ? 'fadein' : ''
                                    )}>
                                        <img
                                            alt={sliderDataState?.description ? sliderDataState?.description : ''}
                                            className={cx('img')}
                                            src={sliderDataState?.imageUrl ? sliderDataState.imageUrl : ''}
                                        />
                                        <div className={cx('delete_box',
                                            sliderDataState?.imageUrl ? 'active' : ''
                                        )}>
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                className={cx('btn_delete')}
                                                onClick={() => setSliderDataState({ ...sliderDataState, imageUrl: "" })}
                                            />

                                        </div>
                                    </div>
                                </div>
                                {errors.imageUrl && <p className={cx('error-message')}>{errors.imageUrl}</p>}

                            </div>
                        </div>
                        <label htmlFor="" className={cx('input-label')}>
                            Vị trí ưu tiên <b>*</b>
                        </label>
                        <input
                            className={cx('input-item')}
                            type="number"
                            required
                            maxLength={2}
                            value={sliderDataState.slideOrder}
                            name='slideOrder'
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                setSliderDataState({ ...sliderDataState, slideOrder: +e.target.value });
                                if (+e.target.value < 1) {
                                    setErrors(prev => ({ ...prev, slideOrder: "Vị trí ưu tiên phải lớn hơn hoặc bằng 1" }));
                                } else {
                                    setErrors(prev => ({ ...prev, slideOrder: '' }));
                                }
                            }}
                        />
                        {errors.slideOrder && <p className={cx('error-message')}>{errors.slideOrder}</p>}
                        <label htmlFor="" className={cx('input-label')}>
                            Mô tả Slider
                        </label>
                        <textarea
                            className={cx('input-item-description')}
                            cols={54}
                            rows={10}
                            value={sliderDataState.description}

                            onChange={(e) => {
                                setSliderDataState({ ...sliderDataState, description: e.target.value })
                            }} />
                        <button className={cx('btn')} type='submit'>Save</button>
                    </form>
                </div>
            </div>
            {/* <!--End Modal --> */}
        </>
    );
}

export default AdminSlider;
