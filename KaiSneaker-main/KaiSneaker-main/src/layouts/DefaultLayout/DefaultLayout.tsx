import Header from '~/layouts/components/Header/Header';
import Footer from '~/layouts/components/Footer/Footer';
import styles from './defaultLayout.module.scss';
import { Outlet } from 'react-router';

const DefaultLayout = () => {
    return (
        <>
            <Header />
            <div className={styles.container}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default DefaultLayout;
