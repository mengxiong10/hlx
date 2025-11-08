import { request } from 'src/request';
import { TextbookType } from './textbook';

export const enum AttachType {
  Audio = '002001',
  Video = '002002',
  Image = '002003',
}

export interface Tips {
  type: string;
  attach?: Attach;
  content?: string;
}

export interface Attach {
  attachType: AttachType;
  attachUrl: string;
}

export interface SortOption {
  content: string;
  value: string; // 对的顺序
  sort: string; // 乱的顺序
  attachUrl?: string;
}

export interface SelectOption {
  label: string;
  type: string;
  content: string;
  value: string;
}

export interface ReadInfo {
  id: string;
  sort: string;
  content: string;
  translation: string;
  analysis?: string;
  audioAttach?: Attach;
  imageAttach?: Attach;
  videoAttach?: Attach;
}

export interface WriteWordInfo {
  id: string;
  sort: string;
  content: string;
  tips: Tips;
  answer: string;
  audioAttach?: Attach;
  imageAttach?: Attach;
  videoAttach?: Attach;
}

export interface SortingInfo extends ReadInfo {
  options: SortOption[];
}

export interface SelectionInfo extends ReadInfo {
  tips?: Tips;
  answer: string;
  options: SelectOption[];
}

export type WriteSentenceInfo = ReadInfo;
export type SpeakingInfo = ReadInfo;

export interface FullTextInfo extends ReadInfo {
  character?: string;
}

/**  无限重做
 *  stepValue == '005001' ||
    stepValue == '005002' ||
    stepValue == '005003' ||
    stepValue == '005004' ||
    stepValue == '005005' ||
    stepValue == '005015' ||
    stepValue == '005018' ||
    stepValue == '005007' ||
    stepValue == '005022'

  (
    // 3 遍重做
    stepValue == '005011' ||
    stepValue == '005012' ||
    stepValue == '005016' ||
    stepValue == '005017' ||
    stepValue == '005021'
  )
 */

export const enum StepValue {
  Reading = '005006', // 看和听
  WriteWord = '005001', // 填空
  WriteSentenceByAudio = '005015', // 句子听写
  WriteSentenceByTranslation = '005018', // 据译写文
  WriteFullText = '005020', // 默写
  SortSentence = '005009', // 排句成篇
  SortTranslation = '005010', // 译文排序
  SortSentenceByAudio = '005008', // 据音排句
  SortWordByAudio = '005007', // 据音排词
  SortWordByTranslation = '005022', // 据译排词
  Selection = '005005', // 常规选择
  SelectionByAudio = '005002', // 据音选文
  SelectionByContent = '005004', // 据文选择
  SelectionImageByAudio = '005003', // 据音选图
  SpeakingByTranslation = '005017', // 据译说文
  SpeakingByImage = '005012', // 说图
  SpeakingByContent = '005011', // 读句子
  SpeakingByFullword = '005019', // 背诵
  SpeakingRepeat = '005016', // 句子复述
}

export type StudyInfoMap = {
  [StepValue.Reading]: ReadInfo[];
  [StepValue.WriteWord]: WriteWordInfo[];
  [StepValue.WriteSentenceByAudio]: WriteSentenceInfo[];
  [StepValue.WriteSentenceByTranslation]: WriteSentenceInfo[];
  [StepValue.WriteFullText]: FullTextInfo[];
  [StepValue.SortSentence]: SortingInfo[];
  [StepValue.SortTranslation]: SortingInfo[];
  [StepValue.SortSentenceByAudio]: SortingInfo[];
  [StepValue.SortWordByAudio]: SortingInfo[];
  [StepValue.SortWordByTranslation]: SortingInfo[];
  [StepValue.Selection]: SelectionInfo[];
  [StepValue.SelectionByAudio]: SelectionInfo[];
  [StepValue.SelectionByContent]: SelectionInfo[];
  [StepValue.SelectionImageByAudio]: SelectionInfo[];
  [StepValue.SpeakingByTranslation]: SpeakingInfo[];
  [StepValue.SpeakingByImage]: SpeakingInfo[];
  [StepValue.SpeakingByContent]: SpeakingInfo[];
  [StepValue.SpeakingRepeat]: SpeakingInfo[];
  [StepValue.SpeakingByFullword]: FullTextInfo[];
};

export type StudyParams<T extends StepValue = StepValue> = {
  textbookId: string;
  unitId: string;
  stepId: string;
  stepValue: T;
};

export function getStudyInfo<T extends StepValue>(values: StudyParams<T>) {
  return request.post<any, StudyInfoMap[T]>('/study/info/search', values);
}

export interface RecordStudyParams {
  endTime: string;
  startTime: string; // 'YYYY-MM-DD HH:mm:ss'
  studyTime: number; // 秒 endTime - startTime
  stepNum: string;
  stepValue: string;
  textbookId: string;
  unitId: string;
}

export function recordStudy(values: RecordStudyParams) {
  return request.post('/study/confirm', values);
}

export interface SentenceScore {
  status: '0' | '1'; // 0 不通过
  score: string;
  words?: SentenceScoreWord[];
}

export interface SentenceScoreWord {
  word: string;
  audioUrl: string;
  translation: string;
  dpMessage: string;
}

interface CheckVoiceParams {
  type: number;
  audioBase64: string;
  id: string;
  language: string;
}

export function checkVoice({ language, id, audioBase64, type }: CheckVoiceParams) {
  language = language === TextbookType.English ? 'en_us' : 'zh-cn';
  audioBase64 = audioBase64.replace(/^data:audio\/.*;base64,/, '');
  // /study/check/5019
  return request.post<any, SentenceScore>(`/study/check/${type}`, {
    language,
    audioBase64,
    id,
  });
}
