import CustomError from './custom-error';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';

class NotFound extends CustomError {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = HttpResponseCodes.NOT_FOUND;
  }
}

export default NotFound;
