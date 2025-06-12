import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './profile.module.scss';
import { useAuth } from '~/context/AuthContext';
import { updateUser, UserDTO } from '~/service/api';
import Image from '~/components/Image/Image';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const Profile = () => {
    useEffect(() => {
        document.title = `Thông tin tài khoản`; // cập nhật tiêu đề
    }, []);

    const { userData, fetchUserData } = useAuth();
    const [stateUser, setStateUser] = useState<UserDTO>(
        {
            username: "",
            fullName: "",
            gender: "",
            cccd: "",
            numberPhone: "",
            dateOfBirth: "",
            imageUser: "",
            email: "",
            roleName: "",
        }
    );

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        gender: '',
        numberPhone: '',
        cccd: '',
        dateOfBirth: '',
    });

    useEffect(() => {

        setStateUser({
            username: userData?.username || "",
            fullName: userData?.fullName || "",
            gender: userData?.gender || "",
            cccd: userData?.cccd || "",
            numberPhone: userData?.numberPhone || "",
            dateOfBirth: userData?.dateOfBirth || "",
            imageUser: userData?.imageUser || "",
            email: userData?.email || "",
            roleName: userData?.role?.roleName || "",

        });
    }, [userData]);

    const handleSubmit = (async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let newErrors = { fullName: '', email: '', gender: '', numberPhone: '', cccd: '', dateOfBirth: '' };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stateUser.email) && stateUser.email) {
            newErrors.email = 'Email không hợp lệ!';
        }

        if (stateUser.cccd.length < 12 && stateUser.cccd) {
            newErrors.cccd = 'CCCD phải có đúng 12 số!';
        }

        if (!/^\d{10}$/.test(stateUser.numberPhone) && stateUser.numberPhone) {
            newErrors.numberPhone = 'Số điện thoại phải có đúng 10 số!';
        }

        if (!(stateUser.gender === 'Nam' || stateUser.gender === 'Nữ') && stateUser.gender) {
            newErrors.gender = 'Giới tính chỉ được phép là "Nam" hoặc "Nữ"!';
        }

        if (stateUser.dateOfBirth) {
            const today = new Date();
            const birthDate = new Date(stateUser.dateOfBirth);
            if (birthDate >= today) {
                newErrors.dateOfBirth = 'Ngày sinh phải nhỏ hơn ngày hiện tại!';
            }
        }

        // Nếu có lỗi thì không submit
        if (Object.values(newErrors).some(error => error !== '')) {
            setErrors(newErrors);
            return;
        }

        // Nếu không lỗi, reset errors và submit
        setErrors({ fullName: '', email: '', gender: '', numberPhone: '', cccd: '', dateOfBirth: '' })

        if (userData?.idAccount) {
            console.log(stateUser);

            try {
                const res = await updateUser(userData.idAccount, stateUser);
                if (res.data.success) {
                    toast.success('Cập nhật thành công!');
                    fetchUserData();
                }
            } catch (error) {
                toast.error('Cập nhật thất bại!');
            }
        } else {
            console.error('User ID không tồn tại!');
        }
    })


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStateUser({ ...stateUser, [name]: value });
    }

    // // Convert input sang base 64
    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertBase64(file);
                setStateUser({ ...stateUser, imageUser: base64 as string });

            } catch (error) {
                console.log(error);
            }
        } else {
            return;
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
    return (
        <>
            <h2 className={cx('title')}>Thông tin cá nhân</h2>
            <form className={cx('profile')} onSubmit={handleSubmit}>
                <div className={cx('product_img')}>
                    <div className={cx('img_item')}>
                        <div className={cx('file_upload')}>
                            <input
                                className={cx('upload')}
                                type="file"
                                accept="image/*" // Chỉ chấp nhận hình ảnh
                                disabled={stateUser?.imageUser ? true : false}
                                onChange={(e) => uploadImage(e)}
                            />
                            <FontAwesomeIcon
                                icon={faArrowUp}
                                className={cx(stateUser?.imageUser ? 'fadeout' : '')}
                            ></FontAwesomeIcon>
                            <div className={cx('img_box', stateUser?.imageUser ? 'fadein' : '')}>
                                <Image
                                    alt={stateUser?.fullName || ""}
                                    className={cx('img')}
                                    src={stateUser?.imageUser || ""}
                                />
                                <div className={cx('delete_box', stateUser?.imageUser ? 'active' : '')}>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className={cx('btn_delete')}
                                        name=''
                                        onClick={() => setStateUser({ ...stateUser, imageUser: "" })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('info')}>
                    <input
                        type="text"
                        className={cx('info_txt', { active: stateUser?.fullName && stateUser.fullName.trim() !== "" })}
                        id="full-name"
                        value={stateUser?.fullName || ""}
                        name='fullName'
                        onChange={(e) => handleChangeInput(e)}
                    />
                    <label htmlFor="full-name" className={cx('info_label')}>
                        Họ và Tên
                    </label>
                </div>
                <div className={cx('info')}>
                    <input
                        type="text"
                        className={cx('info_txt', { active: stateUser?.email })}
                        id="user_email"
                        value={stateUser?.email || ""}
                        name='email'
                        onChange={(e) => handleChangeInput(e)}
                    />
                    <label htmlFor="user_email" className={cx('info_label')}>
                        Email
                    </label>
                    {errors.email && <span className={cx('error_message')}>{errors.email}</span>}
                </div>
                <div className={cx('info')}>
                    <input
                        type="text"
                        className={cx('info_txt', { active: stateUser?.gender })}
                        id="gender"
                        maxLength={5}
                        value={stateUser?.gender || ""}
                        name='gender'
                        onChange={(e) => handleChangeInput(e)}
                    />
                    <label htmlFor="gender" className={cx('info_label')}>
                        Giới tính
                    </label>
                    {errors.gender && <span className={cx('error_message')}>{errors.gender}</span>}
                </div>
                <div className={cx('info')}>
                    <input
                        type="text"
                        className={cx('info_txt', { active: stateUser?.numberPhone })}
                        id="phone-number"
                        maxLength={10}
                        value={stateUser?.numberPhone || ""}
                        name='numberPhone'
                        onChange={(e) => handleChangeInput(e)}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />
                    <label htmlFor="phone-number" className={cx('info_label')}>
                        Số điện thoại
                    </label>
                    {errors.numberPhone && <span className={cx('error_message')}>{errors.numberPhone}</span>}
                </div>
                <div className={cx('info')}>
                    {/* cmt = chứng minh thư */}
                    <input
                        type="text"
                        className={cx('info_txt', { active: stateUser?.cccd })}
                        id="user_cmt"
                        maxLength={12}
                        value={stateUser?.cccd || ""}
                        name='cccd'
                        onChange={(e) => handleChangeInput(e)}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />
                    <label htmlFor="user_cmt" className={cx('info_label')}>
                        CCCD/CMND
                    </label>
                    {errors.cccd && <span className={cx('error_message')}>{errors.cccd}</span>}
                </div>
                <div className={cx('info')}>
                    <input
                        type="date"
                        className={cx('info_txt', 'active')}
                        id="user_date"
                        value={stateUser?.dateOfBirth} // 👈 Sửa chỗ value nè
                        name='dateOfBirth'
                        onChange={(e) => handleChangeInput(e)}
                        onKeyDown={(e) => e.preventDefault()}
                    />
                    <label className={cx('info_label')}>
                        Ngày sinh
                    </label>
                    {errors.dateOfBirth && <span className={cx('error_message')}>{errors.dateOfBirth}</span>}
                </div>
                <button className={cx('update_btn')} type="submit">
                    Cập nhật
                </button>
            </form >
        </>
    );
}

export default Profile;
