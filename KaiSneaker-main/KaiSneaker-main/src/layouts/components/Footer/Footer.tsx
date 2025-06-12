import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapLocation, faMobile } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('grid', 'wide')}>
                <div className={cx('inner', 'row')}>
                    <div className={cx('brand', 'col', 'l-3')}>
                        <img src={images.logo} alt="Kai Sneaker" className={cx('logo')} />
                        <p className={cx('slogan')}>
                            Hãy mang những giấc mơ của bạn lên đôi chân để dẫn lối giấc mơ đó thành hiện thực.
                        </p>
                    </div>
                    <div className={cx('contacts', 'col', 'l-2')}>
                        <h2 className={cx('contacts-heading')}>Email</h2>
                        <div className={cx('contact')}>
                            <div className={cx('contact-item')}>
                                <FontAwesomeIcon icon={faEnvelope} className={cx('contact-logo')} />
                                <p className={cx('contact-content')}>huynhvanvuong0203@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('contacts', 'col', 'l-2')}>
                        <h2 className={cx('contacts-heading')}>Phone</h2>
                        <div className={cx('contact')}>
                            <div className={cx('contact-item')}>
                                <FontAwesomeIcon icon={faMobile} className={cx('contact-logo')} />
                                <p className={cx('contact-content')}>0363507149</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('contacts', 'col', 'l-2')}>
                        <h2 className={cx('contacts-heading')}>Address</h2>
                        <div className={cx('contact')}>
                            <div className={cx('contact-item')}>
                                <FontAwesomeIcon icon={faMapLocation} className={cx('contact-logo')} />
                                <p className={cx('contact-content')}>Quy Nhơn, Bình Định</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('copyright')}>
                <div className={cx('copyright_inner')}>
                    <div className={cx('copyright-text')}>
                        Copyright <span>&copy;</span> by Kai Sneaker. All right reserved
                    </div>
                    <div className={cx('copyright-contact')}>
                        <a href="https://www.instagram.com/_hv.vuong_/">
                            <FontAwesomeIcon icon={faInstagram} className={cx('copyright-logo')} />
                        </a>
                        <a href="https://www.facebook.com/VuongTapCode/">
                            <FontAwesomeIcon icon={faFacebook} className={cx('copyright-logo')} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
