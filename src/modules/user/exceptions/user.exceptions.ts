import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerException } from 'src/common/loggers/logger-exceptions';

@Catch(HttpException)
export class UserLoggerExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const data = exception.getResponse();
        const infoError = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            data: data
        }
        LoggerException(infoError, status)
        response
            .status(status)
            .json({
                statusCode: status,
                data: data
            });
    }
}