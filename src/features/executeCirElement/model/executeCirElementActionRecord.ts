import { AppDispatch, RootState } from "@/app/appStore";
import { ElementTypesEnum } from "@/entities/cirElement/model/ElementTypesEnum";
import { relayExecuteAction } from "./relayExecuteAction";
import { switchExecuteAction } from "./switchExecuteAction";
import { basePowerExecuteAction } from "./basePowerExecuteAction";
import { motorExecuteAction } from "./motorExecuteAction";


type ExecuteCirElementActionRecord =  {
	[key in ElementTypesEnum]?: ((cirElemId: string) => (dispatch: AppDispatch, getState: () => RootState) => void)
}

export const executeCirElementActionRecord: ExecuteCirElementActionRecord = {
	[ElementTypesEnum.Lamp]: basePowerExecuteAction,
	[ElementTypesEnum.Motor]: motorExecuteAction,
	[ElementTypesEnum.Relay]: relayExecuteAction,
	[ElementTypesEnum.Switch]: switchExecuteAction,

}