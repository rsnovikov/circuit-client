import { FC } from 'react';
import { Breadboard } from '@/widgets/Breadboard';
import { ElementPicker } from '@/widgets/ElementPicker/ui/ElementPicker';
import { SelectedElementModal } from '@/widgets/SelectedElementModal';
import { Toolbox } from '@/widgets/Toolbox';

export const CircuitPage: FC = () => (
  <div className="w-full h-full overflow-hidden relative text-[#34495e]">
    <div className="absolute inset-x-0 top-0 h-[50px]">
      <Toolbox />
    </div>
    <div className="absolute inset-x-0 bottom-0 top-[50px]">
      <Breadboard />
      <SelectedElementModal />
      <ElementPicker />
    </div>
  </div>
);
