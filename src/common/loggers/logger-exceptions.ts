import { Logger } from "@nestjs/common";
import { NOT_FOUND } from "../constants/exceptions";
const logger = new Logger();

export function LoggerException(content: any, status: number) {
    if (status !== NOT_FOUND) {
        logger.log(JSON.stringify(content))
    }
}