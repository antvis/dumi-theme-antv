import { Header } from '../slots/Header';
import { NotFound as NotFoundPage } from '../slots/404';
import { Footer } from '../slots/Footer';

/**
 * 404 页面
 */
const NotFound = () => (
  <>
    <Header />
    <NotFoundPage />
    <Footer />
  </>
);

export default NotFound;
