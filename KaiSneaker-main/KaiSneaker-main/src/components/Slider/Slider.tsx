import styles from './slider.module.scss';
import Image from '~/components/Image/Image';
import classNames from 'classnames/bind';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { useState, useEffect } from 'react';
import { Slide } from '~/models/Slide';
import { fetchAllSlide } from '~/service/api';

const cx = classNames.bind(styles);

const Slider = () => {
    const [slideData, setSlideData] = useState<Slide[]>([]);

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        await fetchAllSlide()
            .then((res) => {
                return res.data.result;
            }).then((data) => setSlideData(data))
            .catch((err) => {
                console.log(err.data.message);
            })

    };

    return (
        <div className={cx('slide-container')}>
            {slideData.length > 0 &&
                <Fade>
                    {slideData.map((slide) => {
                        return (
                            slide && (
                                <div className="each-fade" key={slide.slideId}>
                                    <div className={cx('image-container')}>
                                        <Image className={cx('fill')} src={slide.imageUrl} alt={slide.description} />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </Fade>
            }

        </div>
    );
}
export default Slider;
