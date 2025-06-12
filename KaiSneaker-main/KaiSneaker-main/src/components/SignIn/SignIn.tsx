import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './signIn.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '~/context/AuthContext';
import { registerUser } from '~/service/api';

const cx = classNames.bind(styles);

interface SignInType {
    username: string;
    password: string;
}

interface SignUpType {
    signUpusername: string;
    signUppassword: string;
    signUprepassword: string;
}

const SignIn = () => {

    useEffect(() => {
        document.title = `Đăng nhập & Đăng ký`; // cập nhật tiêu đề
    }, []);

    const { login } = useAuth();

    // Dùng để reset giá trị cho formSignIn và formSignUp
    const initSignInValues: SignInType = {
        username: "",
        password: "",
    }

    const initSignUpValues: SignUpType = {
        signUpusername: "",
        signUppassword: "",
        signUprepassword: ""
    }

    // Form State
    const [formSignIn, setFormSignIn] = useState<SignInType>(initSignInValues);
    const [formSignUp, setFormSignUp] = useState<SignUpType>(initSignUpValues);

    // Form Error
    const [errors, setErrors] = useState<{
        signUpusername?: string;
        signUppassword?: string;
        signUprepassword?: string;
        username?: string;
        password?: string;
    }>({});

    // Active Form nào hiển thị
    const [isContainerActive, setIsContainerActive] = useState(false);

    // Navigate
    let navigate = useNavigate();

    // Thay đổi giá trị của formSignIn và formSignUp
    const handleChangeSignIn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormSignIn({ ...formSignIn, [name]: value });
    };

    const handleChangeSignUp = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormSignUp({ ...formSignUp, [name]: value });
    };

    // Hàm Submit của SignIn, SignUp
    const handleSubmitSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        validateForm(formSignIn).then((validationErrors) => {
            setErrors(validationErrors);
        });
    };

    const handleSubmitSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        validateForm(formSignUp).then((validationErrors) => {
            setErrors(validationErrors);
        });
    };

    // Validate function
    const validateForm = async (data: any) => {
        const errors: any = {};
        if (isContainerActive) {
            if (!data.signUpusername) {
                errors.signUpusername = "Vui lòng nhập tên tài khoản!";
            }
            if (!data.signUppassword) {
                errors.signUppassword = "Vui lòng nhập mật khẩu";
            } else if (data.signUppassword.length < 6) {
                errors.signUppassword = "Mật Khẩu không được ít hơn 4 ký tự";
            } else if (data.signUppassword.length > 18) {
                errors.signUppassword = "Mật khẩu không dài quá 18 ký tự";
            } else if (data.signUprepassword !== data.signUppassword) {
                errors.signUprepassword = "Mật khẩu không giống nhau!";
            } else {
                try {
                    const res = await registerUser(formSignUp.signUpusername, formSignUp.signUppassword);
                    if (res.data.success) {
                        toast.success("Đăng ký thành công!");
                        signInButton()
                    }

                } catch (error) {
                    toast.error('Đăng ký thất bại!');
                }
            }
        } else {
            //check không bỏ trống
            if (!data.username) {
                errors.username = "Vui lòng nhập tên tài khoản!";
            }
            if (!data.password) {
                errors.password = "Vui lòng nhập mật khẩu";
            } else if (data.password.length < 4) {
                errors.password = "Mật Khẩu không được ít hơn 4 ký tự";
            } else if (data.password.length > 18) {
                errors.password = "Mật khẩu không dài quá 18 ký tự";
            } else {
                //check đăng nhập
                try {
                    await login(formSignIn.username, formSignIn.password);
                    toast.success('Đăng nhập thành công!');
                    navigate('/');
                } catch (error) {
                    toast.error('Đăng nhập thất bại!');
                }
            }
        }

        return errors;
    };

    const resetForm = () => {
        setFormSignIn(initSignInValues);
        setFormSignUp(initSignUpValues);
        setErrors({});
    }

    const signUpButton = () => {
        setIsContainerActive(true);
        resetForm()
    };
    const signInButton = () => {
        setIsContainerActive(false);
        resetForm()
    };

    return (
        <div className={cx('login')}>
            {/* <!-- Begin Trigger --> */}
            <Link to="/" className={cx('logo')} data-target="#login" data-toggle="modal">
                <img src={images.logo} alt="" className={cx('logo_img')} />
            </Link>
            <div className={cx('wrapper', `${isContainerActive ? 'right-panel-active' : ''}`)}>
                <div className={cx('inner', 'sign_up')}>
                    <form action="#" className={cx('morri-container')}
                        onSubmit={handleSubmitSignUp}
                    >
                        <h1 className={cx('heading')}>Tạo tài khoản</h1>
                        <div className={cx('social')}>
                            <Link to="" className={cx('social_item')}>
                                <FontAwesomeIcon icon={faFacebook} />
                            </Link>
                            <Link to="" className={cx('social_item')}>
                                <FontAwesomeIcon icon={faGoogle} />
                            </Link>
                        </div>
                        <input
                            type="text"
                            placeholder="Tên tài khoản"
                            className={cx('morri_input')}
                            name='signUpusername'
                            value={formSignUp?.signUpusername}
                            autoComplete="new-username"
                            onChange={(e) => {
                                handleChangeSignUp(e);
                            }}
                        />
                        {errors.signUpusername && <small className={cx("errors_txt")}>{errors.signUpusername}</small>}
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className={cx('morri_input')}
                            name='signUppassword'
                            value={formSignUp?.signUppassword}
                            autoComplete="new-password"
                            onChange={(e) => {
                                handleChangeSignUp(e);
                            }}
                        />
                        {errors.signUppassword && <small className={cx("errors_txt")}>{errors.signUppassword}</small>}
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className={cx('morri_input')}
                            name='signUprepassword'
                            value={formSignUp?.signUprepassword}
                            autoComplete="new-password"
                            onChange={(e) => {
                                handleChangeSignUp(e);
                            }}
                        />
                        {errors.signUprepassword && <small className={cx("errors_txt")}>{errors.signUprepassword}</small>}
                        <button type='submit' className={cx('btn')}>Đăng kí</button>
                    </form>
                </div>
                <div className={cx('inner', 'sign_in')}>
                    <form className={cx('morri-container')} onSubmit={handleSubmitSignIn}>
                        <h1 className={cx('heading')}>Đăng nhập</h1>
                        <div className={cx('social')}>
                            <Link to="" className={cx('social_item')}>
                                <FontAwesomeIcon icon={faFacebook} />
                            </Link>
                            <Link to="" className={cx('social_item')}>
                                <FontAwesomeIcon icon={faGoogle} />
                            </Link>
                        </div>
                        <span className={cx('subcontent')}>hoặc sử dụng tài khoản của bạn</span>
                        <input
                            type="text"
                            placeholder="Email"
                            className={cx('morri_input')}
                            name='username'
                            value={formSignIn.username}
                            autoComplete="current-username"
                            onChange={(e) => {
                                handleChangeSignIn(e);
                            }}
                        />
                        {errors.username && <small className={cx("errors_txt")}>{errors.username}</small>}
                        <input
                            type="password"
                            placeholder="Password"
                            className={cx('morri_input')}
                            name='password'
                            value={formSignIn.password}
                            autoComplete="current-password"
                            onChange={(e) => {
                                handleChangeSignIn(e);
                            }}
                        />
                        {errors.password && <small className={cx("errors_txt")}>{errors.password}</small>}
                        <Link to="/forgot-password" className={cx('forgot')}>
                            Quên mật khẩu?
                        </Link>
                        <button type='submit' className={cx('btn')}>Đăng nhập</button>
                    </form>
                </div>
                <div className={cx('overlay-container')}>
                    <div className={cx('overlay')}>
                        <div className={cx('overlay-panel', 'overlay-left')}>
                            <h1 className={cx('heading')}>Chào mừng trở lại!</h1>
                            <p className={cx('overlay-content')}>
                                Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
                            </p>
                            <button className={cx('btn', 'ghost')} onClick={signInButton} id="signIn">
                                Đăng nhập
                            </button>
                        </div>
                        <div className={cx('overlay-panel', 'overlay-right')}>
                            <h1 className={cx('heading')}>Chào bạn!</h1>
                            <p className={cx('overlay-content')}>
                                Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi
                            </p>
                            <button className={cx('btn', 'ghost')} onClick={signUpButton} id="signUp">
                                Đăng kí
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End Trigger --> */}
        </div>
    );
}

export default SignIn;
