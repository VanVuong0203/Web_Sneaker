import Slider from '~/components/Slider/Slider';
import Brands from '~/components/Brands/Brands';
import Featured from '~/components/Featured/Featured';
import { useEffect } from 'react';

const HomePage = () => {

    useEffect(() => {
        document.title = `Trang chủ`;
    }, []);
    return (
        <>
            <Slider />
            <div className="content grid wide">
                <Featured />
                <Brands />
            </div>
        </>
    );
}

export default HomePage;
