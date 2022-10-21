import { useContext, useMemo, useState } from 'react';
import { BackTop, Badge, Layout as AntLayout } from 'antd';
import { ThemeAntVContext } from '@/.dumi/theme/context';
import { Header } from '../../slots/Header';
import { Footer } from '../../slots/Footer';
import { LeftMenu } from '@/.dumi/theme/pages/examples/components/LeftMenu';
import { Article } from '@/.dumi/theme/pages/examples/components/Article';
import styles from './examples.module.less';
import NavigatorBanner from '../../slots/Header/Products/NavigatorBanner';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { each, filter, groupBy, size } from 'lodash-es';
import i18n, { t } from 'i18next';
import { Link } from 'dumi';
import { usePrevAndNext } from '@/.dumi/theme/slots/Header/Products/hooks';
import { NewDemo } from '@/.dumi/theme/pages/examples/types';
import { Announcement } from './components/Accouncement';

const BANNER_LOCALSTORAGE_KEY = 'antv_gallery_banner';


/**
 * Examples 页面
 *
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const Example = () => {
  /** 示例页面的元数据信息 */
  const metaData: any = useContext(ThemeAntVContext);

  const { allMarkdownRemark, site } = metaData.meta.result.data;
  const {
    siteMetadata: { examples = [] },
  } = site;

  const { exampleSections = {}, allDemos = [] } = metaData.meta.result.pageContext;

  const { edges = [] } = allMarkdownRemark;

  const currentPath = location.pathname.replace(/\/$/, '');

  const isGalleryView = currentPath.includes('/examples/gallery');

  const { node: markdownRemark } =
  edges.find((edge: any) => {
    const {
      fields: { slug },
    } = edge.node;

    if (
      /\/examples\/.*\/API$/.test(currentPath) ||
      /\/examples\/.*\/design$/.test(currentPath)
    ) {
      return currentPath.indexOf(slug) >= 0;
    }
    return (
      currentPath === slug ||
      currentPath.endsWith(slug)
    );
  }) || {};


  // 获取 demo 的 Category 分类
  const getDemoCategory = (demo: any, lang = i18n.language) => {
    if (!demo.postFrontmatter || !demo.postFrontmatter[lang]) {
      return 'OTHER';
    }
    return demo.postFrontmatter[lang].title;
  };

  const allDemosInCategory = groupBy(allDemos || [], getDemoCategory);


  /** 获取上新的 demo. 直接用英文 title 作为 id */
  const demosOnTheNew = useMemo((): Array<NewDemo> => {
    const result: NewDemo[] = [];

    each(allDemosInCategory, (categoryDemos, category) => {
      const newDemos = filter(categoryDemos, (d) => d.new);
      // 大于4个新增 demo 或全部新增，则直接使用 category 作为代替
      if (
        size(newDemos) > 6 ||
        (size(newDemos) && size(newDemos) === size(categoryDemos))
      ) {
        result.push({
          title: category,
          id: getDemoCategory(newDemos[0], 'en'),
          category,
        });
      } else {
        each(newDemos, (demo) =>
          result.push({
            title: demo.title[i18n.language],
            id: demo.title.en,
            category: getDemoCategory(demo),
          }),
        );
      }
    });
    return result;
  }, [allDemosInCategory, allDemos, i18n.language]);

  const [prev, next] = usePrevAndNext();

  /** 公告 id */
  const bannerId = useMemo(() => {
    return demosOnTheNew.map((d) => d.id).join('-');
  }, [demosOnTheNew]);

  const Categories = Object.keys(allDemosInCategory).sort(
    (a: string, b: string) => {
      if (a === 'OTHER') {
        return -1;
      }
      if (b === 'OTHER') {
        return 1;
      }
      return (
        allDemosInCategory[a][0].postFrontmatter[i18n.language].order -
        allDemosInCategory[b][0].postFrontmatter[i18n.language].order
      );
    },
  );

  const galleryPageContent = (
    <div className={styles.gallery}>
      <div className={styles.galleryContent}>
        <div
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{
            __html: exampleSections.description,
          }}
        />
        {/* 是否展示上新公告  */}
        {demosOnTheNew.length > 0 ? (
          <Announcement
            message={
              // @ts-ignore
              <div>
                {t('上新啦，点击直达：')}
                {demosOnTheNew.map((demo, idx) => (
                  <span key={demo.title}>
                    {idx !== 0 && '，'}
                    <a href={`#category-${demo.category.replace(/\s/g, '')}`}>
                      {demo.title}
                    </a>
                  </span>
                ))}
              </div>
            }
            localStorageId={BANNER_LOCALSTORAGE_KEY}
            bannerId={bannerId}
          />
        ) : null}
        {Categories.map((category: string, i) => (
          <div key={i}>
            {category !== 'OTHER' && (
              <h2 id={`category-${category.replace(/\s/g, '')}`}>{category}</h2>
            )}
            <ul className={styles.galleryList}>
              {allDemosInCategory[category]
                .sort((a, b) => {
                  return (a.order || -1) - (b.order || -1);
                })
                .map((demo) => {
                  let cardTitle;
                  if (typeof demo.title === 'string') {
                    cardTitle = demo.title;
                  } else {
                    cardTitle = demo.title
                      ? demo.title[i18n.language]
                      : demo.filename;
                  }
                  const demoSlug = demo.relativePath.replace(
                    /\/demo\/(.*)\..*/,
                    (_: string, filename: string) => {
                      return `#${filename}`;
                    },
                  );
                  const card = (
                    <div>
                      <img
                        src={
                          demo.screenshot ||
                          'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/screenshot-placeholder-b8e70.png'
                        }
                        alt={cardTitle}
                      />
                    </div>
                  );
                  return (
                    <li
                      className={styles.galleryCard}
                      key={demo.relativePath}
                      title={cardTitle}
                    >
                      <Link
                        className={styles.galleryCardLink}
                        to={`/${i18n.language}/examples/${demoSlug}`}
                      >
                        {demo.new ? (
                          <Badge.Ribbon
                            text='new'
                            className={styles.customRibbon}
                          >
                            {card}
                          </Badge.Ribbon>
                        ) : (
                          card
                        )}
                        <h4>{cardTitle}</h4>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <>
      <Header isHomePage={false} />
      <AntLayout>
        <LeftMenu edges={edges} examples={examples} />
        <Article className={styles.markdown}>
          <div className={styles.main} style={{ width: '100%' }}>
            {galleryPageContent}
            <div>
              <NavigatorBanner type='prev' post={prev} />
              <NavigatorBanner type='next' post={next} />
            </div>
            <BackTop style={{ right: 32 }}>
              <div className={styles.backTop}>
                <VerticalAlignTopOutlined />
              </div>
            </BackTop>
          </div>
        </Article>
      </AntLayout>
      <Footer />
    </>
  );
};

export default Example;
