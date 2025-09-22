import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { AxiosResponse } from 'axios';

export interface CustomWorld extends World {
  response?: AxiosResponse;
}

class ApiWorld extends World implements CustomWorld {
  response?: AxiosResponse;
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(ApiWorld);
