// src/components/DataUploader.tsx
import React from 'react';
import { Upload, message, Tooltip } from 'antd';
import type { UploadProps } from 'antd';
import { useRequest } from 'ahooks';
import { AIMode, FileIcons } from '../../../constant';

// 定义文件元信息类型，与父组件保持一致
export interface FileMeta {
  type: 'FILE' | 'IMAGE';
  fileName?: string;
  fileSize?: string; // 使用string类型来表示，例如 "123 KB"
}

// 定义回调函数返回的完整数据类型
export interface AnalyzedData {
  fileMeta: FileMeta | null;
  dataSummary: string;
}

// 定义组件Props
interface DataUploaderProps {
  onDataAnalyzed: (data: AnalyzedData) => void;
  isCompact?: boolean;
  tooltipText: string;
}

// 新增：直接发送给AI的原始内容最大字符数阈值
const DIRECT_FEED_CHAR_THRESHOLD = 4000; // 约1k tokens，这是一个比较保守和经济的阈值
const MAX_FILE_SIZE_MB = 5;
const MAX_CONTEXT_CHARS = 5000;
const ALLOWED_FILE_TYPES = ['csv', 'json', 'tsv', 'txt'];
const MAX_LINES = 10;

// --- 辅助函数（与之前相同） ---
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// 这些函数负责将文件内容转换成给AI看的摘要
function getTableSummary(content: string, fileType: 'csv' | 'tsv' | 'txt'): string {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  if (lines.length === 0) return "文件为空。";

  const delimiter = fileType === 'csv' ? ',' : '\t';
  const header = lines[0];
  // 取前MAX_LINES行有效数据作为样本
  const sampleRows = lines.slice(1).filter(line => line.trim() !== '').slice(0, MAX_LINES).join('\n');
  const columnCount = header.split(delimiter).length;
  const rowCount = lines.filter(line => line.trim() !== '').length;

  return `这是一个包含约 ${rowCount} 行和 ${columnCount} 列的表格数据。
列名（Header）是: ${header}
前${MAX_LINES}行样本数据如下:
${sampleRows}`;
}

function getJsonSummary(data: any): string {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const keys = Object.keys(data[0]);
    const sampleData = data.slice(0, MAX_LINES).map(item => JSON.stringify(item)).join('\n');
    return `这是一个包含 ${data.length} 个对象的JSON数组。
每个对象的键（Keys）是: ${keys.join(', ')}
前${MAX_LINES}个样本对象如下:
${sampleData}`;
  }
  return `这是一个JSON对象。其结构和部分数据如下：\n` + JSON.stringify(data, null, 2);
}

// --- 文件解析服务函数 ---
async function parseFile(file: File): Promise<AnalyzedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        let dataSummary: string;

        // --- 智能策略判断 ---
        if (fileContent.length <= DIRECT_FEED_CHAR_THRESHOLD) {
          // 策略1：文件内容足够小，直接作为上下文
          dataSummary = `用户上传了一个数据文件，其完整内容如下：\n\n${fileContent}`;
        } else {
          // 策略2：文件内容过大，执行摘要算法
          const fileType = file.name.split('.').pop()?.toLowerCase() || '';

          if (fileType === 'json') {
            const jsonData = JSON.parse(fileContent);
            dataSummary = getJsonSummary(jsonData);
          } else if (['csv', 'tsv', 'txt'].includes(fileType)) {
            dataSummary = getTableSummary(fileContent as any, fileType as any);
          } else {
            reject(new Error('不支持的文件解析类型'));
            return;
          }

          if (dataSummary.length > MAX_CONTEXT_CHARS) {
            dataSummary = dataSummary.substring(0, MAX_CONTEXT_CHARS) + "\n... (数据摘要已截断)";
          }
        }

        resolve({
          dataSummary,
          fileMeta: {
            type: 'FILE',
            fileName: file.name,
            fileSize: formatBytes(file.size),
          },
        });
      } catch (e) {
        reject(new Error('文件内容格式错误，无法解析。'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败。'));
    reader.readAsText(file);
  });
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onDataAnalyzed, isCompact, tooltipText }) => {
  const { run: runParse, loading } = useRequest(parseFile, {
    manual: true,
    onSuccess: (result) => {
      // message.success(`${result.fileMeta?.fileName} 分析成功！`);
      onDataAnalyzed(result);
    },
    onError: (e) => {
      message.error(e.message);
      // 如果解析失败，也需要通知父组件清空数据
      onDataAnalyzed({ fileMeta: null, dataSummary: '' });
    },
  });

  const uploadProps: UploadProps = {
    showUploadList: false, // 我们用自己的DatasourceCard来回显，所以隐藏默认列表
    accept: ALLOWED_FILE_TYPES.map(ext => `.${ext}`).join(','),
    beforeUpload: (file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        message.error(`不支持的文件类型。请上传 ${ALLOWED_FILE_TYPES.join(', ')} 文件。`);
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        message.error(`文件大小不能超过 ${MAX_FILE_SIZE_MB}MB!`);
        return Upload.LIST_IGNORE;
      }
      runParse(file);
      return false; // 总是返回 false 来手动控制
    },
  };

  return (
    <Tooltip title={isCompact ? `上传数据。${tooltipText}` : tooltipText}>
      <Upload {...uploadProps}>
        <button type="button" disabled={loading}>
          {loading ? (
            '分析中...'
          ) : (
            <>
              <img src={FileIcons.FILE} alt="file-icon" /> {!isCompact && '上传数据'}
            </>
          )}
        </button>
      </Upload>
    </Tooltip>
  );
};
