import { ElementTypesEnum } from '@/entities/cirElement/model/ElementTypesEnum';

export interface IPickerElement {
  type: ElementTypesEnum;
  name: string;
  previewImgPath: string;
}
