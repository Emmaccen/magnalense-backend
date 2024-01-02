import CustomError from './custom-error';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';

class Unauthenticated extends CustomError {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = HttpResponseCodes.UNAUTHORIZED;
  }
}

export default Unauthenticated;
