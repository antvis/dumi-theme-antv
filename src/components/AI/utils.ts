
export function getFileExtension(filename: string) {
  // 查找最后一个点的位置
  const dotIndex = filename.lastIndexOf('.');

  // 如果没有找到点，返回空字符串
  if (dotIndex === -1) {
    return '';
  }

  // 提取后缀名，并返回
  return filename.slice(dotIndex + 1);
}

export function formatFileSize(fileSize?: number) {
  if (!fileSize) {
    return '0B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = fileSize;
  let unitIndex = 0;

  // 当文件大小大于等于1024且还有更大的单位可用时，进行转换
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // 如果小于1MB，强制使用KB为单位
  if (unitIndex === 0 && fileSize >= 1024) {
    size = fileSize / 1024;
    unitIndex = 1;
  }

  // 保留一位小数
  size = Number(size.toFixed(1));

  // 如果小数部分为0，则去掉小数部分
  return `${size % 1 === 0 ? Math.floor(size) : size}${units[unitIndex]}`;
}

