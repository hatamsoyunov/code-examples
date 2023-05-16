import AbstractApiRepository from '../../base/api/AbstractApiRepository';
import WaterDto from './dto/WaterDto';

export default class WaterApiRepository extends AbstractApiRepository {
  getWaterInfo = () => {
    return this.apiClient.get({ url: `/water` });
  };

  addWaterDrunk = (data: WaterDto) => {
    return this.apiClient.post({ url: `/water`, data });
  };
}
