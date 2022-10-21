import React, { useMemo } from 'react';
import styles from '@/.dumi/theme/pages/examples/examples.module.less';
import { Announcement } from '@/.dumi/theme/pages/examples/components/Accouncement';
import i18n, { t } from 'i18next';
import { Link } from 'dumi';
import { Badge } from 'antd';
import { each, filter, groupBy, size } from 'lodash-es';
import { NewDemo } from '@/.dumi/theme/pages/examples/types';

const BANNER_LOCALSTORAGE_KEY = 'antv_gallery_banner';

export interface GalleryPageContentProps {
  // TODO: 优化类型定义
  exampleSections: Record<any, any>;

  /**
   * 所有 DEMO
   */
  allDemos: any[];
}

/**
 * GalleryPageContent
 *
 * @param {GalleryPageContentProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const GalleryPageContent: React.FC<GalleryPageContentProps> = (props) => {
  const { exampleSections, allDemos } = props;


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


  return <div className={styles.gallery}>
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
  </div>;
};
