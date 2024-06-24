import React from 'react';
import cx from 'classnames';
import { useLocale, FormattedMessage } from 'dumi';
import Product from './Product';
import { CATEGORIES, getNewProducts, ProductCategory } from './getProducts';
import { useChinaMirrorHost } from '../../hooks';
import styles from './Product.module.less';

interface ProductsProps {
  show: boolean;
  rootDomain: string;
  language?: 'zh' | 'en';
  className?: string;
  bannerVisible?: boolean;
}

export const Products: React.FC<ProductsProps> = ({ show, language, className, bannerVisible }) => {
  const locale = useLocale();
  const [isChinaMirrorHost] = useChinaMirrorHost();
  const [productsCategoty, setProducts] = React.useState<ProductCategory[]>(CATEGORIES);
  const lang = locale.id === 'zh' ? 'zh' : 'en';

  React.useEffect(() => {
    getNewProducts({
      language: lang,
      isChinaMirrorHost,
    }).then((data) => {
      const newProducts = CATEGORIES.map(({ name, type }) => {
        return {
          name,
          type,
          products: data.filter((item) => item.category === type),
        };
      })

      setProducts(newProducts);
    });
  }, [lang, isChinaMirrorHost]);

  return (
    <>
      <div
        className={cx(styles.products, className, {
          [styles.show]: !!show,
          [styles.bannerVisible]: !!bannerVisible,
        })}
      >
        <div className={styles.container}>
          {productsCategoty.map(({ name, type, products }, idx) => {
            return (
              products.length ? <React.Fragment key={idx}>
                <h3><FormattedMessage id={name} /></h3>
                <ul>
                  {products
                    .map((product) => (
                      <Product
                        key={product.title}
                        name={product.title}
                        slogan={product.slogan || ''}
                        description={product.description}
                        url={product.links?.home?.url}
                        icon={product.icon as string}
                        links={product.links}
                        language={language || locale.id}
                      />
                    ))}
                </ul>
              </React.Fragment> : null
            );
          })}
        </div>
      </div>
      <div className={styles.mask} />
    </>
  );
};

