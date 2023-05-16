import { Dto } from '../../base/Dto';
import { modelFactory } from '../../base/ModelFactory';
import { isTrue } from '../../base/utils/baseUtil';
import WaterApiRepository from './WaterApiRepository';
import WaterDto from './dto/WaterDto';
import { IWaterForm } from './forms/WaterForm';
import { WaterInfo } from './models/WaterInfo';

export default class WaterService {
  apiRepository: WaterApiRepository;

  constructor() {
    this.apiRepository = new WaterApiRepository();
  }

  // API

  getWaterInfo = async (): Promise<WaterInfo> => {
    const { data } = await this.apiRepository.getWaterInfo();

    return modelFactory.create(WaterInfo, this.prepareWaterInfo(data.data));
  };

  addWaterDrunk = async (form: IWaterForm): Promise<WaterInfo> => {
    const waterDto = Dto.populate(WaterDto, { value: Number(form.waterVolume) });

    const { data } = await this.apiRepository.addWaterDrunk(waterDto);

    return modelFactory.create(WaterInfo, this.prepareWaterInfo(data.data));
  };

  // OTHERS

  prepareWaterInfo = (data: any) => {
    return {
      ...data,
      currentDayCompleted: isTrue(data?.currentDayCompleted),
    };
  };
}
