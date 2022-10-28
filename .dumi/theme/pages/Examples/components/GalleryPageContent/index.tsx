import React from 'react';
import { useLocale } from 'dumi';
import { GalleryPageContentProps, NewDemo } from '../../types';
import styles from '../../index.module.less';
import { DemoCard } from './DemoCard';

/**
 * Examples 首页内容预览组件
 *
 * @param {GalleryPageContentProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const GalleryPageContent: React.FC<GalleryPageContentProps> = (props) => {
  const { exampleTopics } = props;
  const locale = useLocale();

  // TODO: 公告功能待后续补充
  // /** 获取上新的 demo. 直接用英文 title 作为 id */
  // const demosOnTheNew = useMemo((): Array<NewDemo> => {
  //   const result: NewDemo[] = [];
  //   each(allDemosInCategory, (categoryDemos, category) => {
  //     const newDemos = filter(categoryDemos, (d) => d.new);
  //     // 大于4个新增 demo 或全部新增，则直接使用 category 作为代替
  //     if (
  //       size(newDemos) > 6 ||
  //       (size(newDemos) && size(newDemos) === size(categoryDemos))
  //     ) {
  //       result.push({
  //         title: category,
  //         id: getDemoCategory(newDemos[0], 'en'),
  //         category,
  //       });
  //     } else {
  //       each(newDemos, (demo) =>
  //         result.push({
  //           title: demo.title[locale.id],
  //           id: demo.title.en,
  //           category: getDemoCategory(demo),
  //         }),
  //       );
  //     }
  //   });
  //   return result;
  // }, [allDemosInCategory, allDemos, locale.id]);


  const flattenExamples = exampleTopics.reduce((prev, current) => {
    return prev.concat(current.examples);
  }, [] as ExamplesPage.Example[]);


  return (
    <div className={styles.gallery}>
      <div className={styles.galleryContent}>
        {flattenExamples.map((example, i) => {
          return (
            <div key={i}>
              <h2 id={`category-${example.id.replace(/\s/g, '')}`}>{example.title[locale.id]}</h2>
              <ul className={styles.galleryList}>
                {example.demos.map((demo) => {
                  return (
                    <li
                      className={styles.galleryCard}
                      key={demo.relativePath}
                      title={demo.title[locale.id]}>
                      <DemoCard demo={demo} />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
