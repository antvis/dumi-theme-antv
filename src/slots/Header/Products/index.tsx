import React from 'react';
import cx from 'classnames';
import { useLocale, FormattedMessage } from 'dumi';
import Product from './Product';
import { CATEGORIES, getNewProducts, ProductType } from './getProducts';
import { useChinaMirrorHost } from '../../hooks';
import styles from './Product.module.less';

interface ProductsProps {
  show: boolean;
  rootDomain: string;
  language?: 'zh' | 'en';
  className?: string;
}

export const Products: React.FC<ProductsProps> = ({ show, language, className }) => {
  const locale = useLocale()
  const [isChinaMirrorHost] = useChinaMirrorHost();
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const lang = locale.id === 'zh' ? 'zh' : 'en';
  React.useEffect(() => {
    getNewProducts({
      language: lang,
      isChinaMirrorHost,
    }).then((data) => {
      setProducts(data);
    });
  }, [lang, isChinaMirrorHost]);

  return (
    <>
      <div
        className={cx(styles.products, className, {
          [styles.show]: !!show,
        })}
      >
        <div className={styles.container}>
          {CATEGORIES.map(({ name, type }, idx) => {
            return (
              <React.Fragment key={idx}>
                <h3><FormattedMessage id={name} /></h3>
                <ul>
                  {products
                    .filter((item) => item.category === type)
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
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className={styles.mask} />
    </>
  );
};

