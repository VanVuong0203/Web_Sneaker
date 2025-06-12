import { useState, forwardRef, ImgHTMLAttributes } from 'react';
import classNames from 'classnames';
import images from '~/assets/images';
import styles from './image.module.scss';

// Định nghĩa kiểu cho props
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
    className?: string;
    fallback?: string;
}


const Image = forwardRef<HTMLImageElement, ImageProps>(({
    src,
    alt,
    className,
    fallback: customFallback = images.noImage,
    ...props
}, ref) => {
    const [fallback, setFallback] = useState<string>('');

    const handleError = () => {
        setFallback(customFallback);
    };

    const finalSrc = fallback || src;

    // Nếu src rỗng hoặc null thì render fallback luôn
    if (!finalSrc) {
        return (
            <img
                className={classNames(styles.wrapper, className)}
                ref={ref}
                src={customFallback}
                alt={alt}
                {...props}
            />
        );
    }

    return (
        <img
            className={classNames(styles.wrapper, className)}
            ref={ref}
            src={finalSrc}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
});

export default Image;
