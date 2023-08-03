import { FC } from 'react';
import get from 'lodash.get';
import { updateSelectedElementField } from '@/entities/breadboard';
import { cirElementList } from '@/shared/api/__mock__/cirElementList';
import { useAppDispatch, useAppSelector } from '@/shared/model';

export const SelectedElementModal: FC = () => {
  const selectedElement = useAppSelector((state) =>
    state.breadboard.elements.find((element) => element.id === state.breadboard.selectedElementId)
  );

  const dispatch = useAppDispatch();

  if (!selectedElement) return null;

  const { name } = cirElementList[selectedElement.type];

  const fields = [
    {
      path: 'personalName',
      title: 'Имя',
    },
    ...Object.keys(selectedElement.physData)
      .filter((physDataKey) => {
        return cirElementList[selectedElement.type].physData[physDataKey].isChangeable;
      })
      .map((physDataKey) => ({
        path: `physData.${physDataKey}.value`,
        title: cirElementList[selectedElement.type].physData[physDataKey].title,
      })),
  ];

  const handleInputChange = ({ path, value }: { path: string; value: string }) => {
    dispatch(
      updateSelectedElementField({
        path,
        value,
      })
    );
  };

  return (
    <div className="absolute right-[310px] top-[10px] w-[260px] border-2 border-blue-400 rounded bg-white">
      <div className="py-3 bg-blue-400 px-2 text-xl text-white"> {name}</div>
      <div className="p-2">
        <ul>
          {Object.keys(selectedElement.physData).map((key) => {
            const { value } = selectedElement.physData[key];

            const { title, isChangeable } = cirElementList[selectedElement.type].physData[key];
            if (isChangeable) return;
            return (
              <li
                key={title}
                className="h-[45px] flex justify-between mb-2 rounded border-2 border-blue-400"
              >
                <div className="h-full flex items-center justify-center bg-blue-400 text-white px-2">
                  <span>{title}</span>
                </div>
                <div className="h-full w-full pl-2 text-blue-400 flex items-center justify-start">
                  <span> {value}</span>
                </div>
              </li>
            );
          })}
          {fields.map(({ path, title }) => (
            <li
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};