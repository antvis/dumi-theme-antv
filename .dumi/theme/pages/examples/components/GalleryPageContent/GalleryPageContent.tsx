import React, { useMemo } from 'react';
import { Link, useLocale } from 'dumi';
import { Badge } from 'antd';
import { each, filter, groupBy, size } from 'lodash-es';
import { Announcement } from '../Accouncement/Announcement';
import { GalleryPageContentProps, NewDemo } from '../../types';
import styles from '../../index.module.less';
import { useT } from '@/.dumi/theme/slots/hooks';

const BANNER_LOCALSTORAGE_KEY = 'antv_gallery_banner';

/**
 * GalleryPageContent
 *
 * @param {GalleryPageContentProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const GalleryPageContent: React.FC<GalleryPageContentProps> = (props) => {
  const { exampleSections, allDemos } = props;
  const locale=useLocale()

  // 获取 demo 的 Category 分类
  const getDemoCategory = (demo: any, lang = locale.id) => {
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
            title: demo.title[locale.id],
            id: demo.title.en,
            category: getDemoCategory(demo),
          }),
        );
      }
    });
    return result;
  }, [allDemosInCategory, allDemos, locale.id]);

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
        allDemosInCategory[a][0].postFrontmatter[locale.id].order -
        allDemosInCategory[b][0].postFrontmatter[locale.id].order
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
      {demosOnTheNew.length > 0 && (
        <Announcement
          message={
            // @ts-ignore
            <div>
              {useT('上新啦，点击直达：')}
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
      )}
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
                    ? demo.title[locale.id]
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
                      to={`/${locale.id}/examples/${demoSlug}`}
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
