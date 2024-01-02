import CustomError from './custom-error';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';

class BadRequest extends CustomError {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = HttpResponseCodes.BAD_REQUEST;
  }
}

export default BadRequest;
