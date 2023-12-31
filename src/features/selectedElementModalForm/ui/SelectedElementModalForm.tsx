import { FC } from 'react';
import get from 'lodash.get';
import { initialCirElementList } from '@/entities/cirElement/model/InitialCirElementList';
import { ICirElement } from '@/entities/cirElement/model/types';
import { useAppDispatch } from '@/shared/model';
import { updateSelectedElementFieldAction } from '../model/updateSelectedElementFieldAction';

interface ISelectedElementModalFormProps {
  selectedElement: ICirElement;
}

export const SelectedElementModalForm: FC<ISelectedElementModalFormProps> = ({
  selectedElement,
}) => {
  const dispatch = useAppDispatch();

  const fields = [
    {
      path: 'personalName',
      title: 'Имя',
    },
    ...Object.keys(selectedElement.physData)
      .filter((physDataKey) => {
        return initialCirElementList[selectedElement.type].physData[physDataKey].isChangeable;
      })
      .map((physDataKey) => ({
        path: `physData.${physDataKey}.value`,
        title: initialCirElementList[selectedElement.type].physData[physDataKey].title,
      })),
  ];

  const handleInputChange = ({ path, value }: { path: string; value: string }) => {
    dispatch(
      updateSelectedElementFieldAction({
        path,
        value,
      })
    );
  };

  return (
    <form>
      {fields.map(({ path, title }) => (
        <div
          key={path}
          className="h-[45px] flex justify-between mb-2 rounded border-2 border-blue-400"
        >
          <div className="h-full flex items-center justify-center bg-blue-400 text-white px-2">
            <span>{title}</span>
          </div>
          <input
            type="text"
            className="h-full w-full pl-2 text-blue-400"
            value={get(selectedElement, path)}
            name={path}
            onChange={(e) => handleInputChange({ path, value: e.target.value })}
          />
        </div>
      ))}
    </form>
  );
};
