import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PublicSettingsService {
  constructor(private settings: SettingsService) {}

  async getPublic() {
    return this.settings.getPublic();
  }
}
