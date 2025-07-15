import Repository from "../../../common/Repository";
import RefundModel from "../model";
import { IRefund } from "../types";

class RefundRepository extends Repository<IRefund> {
    constructor() {
        super(RefundModel);
    }
}

export default RefundRepository;