import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionHandlerFilter } from 'src/exceptions/exception-handler.filter';

describe('ExceptionHandlerFilter', () => {
  let filter: ExceptionHandlerFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionHandlerFilter],
    }).compile();

    filter = module.get<ExceptionHandlerFilter>(ExceptionHandlerFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const mockException = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const mockArgumentsHost = createMockArgumentsHost();

    filter.catch(mockException, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(response.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/some-resource',
      error: 'Forbidden',
    });
  });

  it('should handle non-HttpException correctly', () => {
    const mockException = new Error('Unexpected error');
    const mockArgumentsHost = createMockArgumentsHost();

    filter.catch(mockException, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: '/some-resource',
      error: 'Internal server error',
    });
  });

  function createMockArgumentsHost(): ArgumentsHost {
    const getResponse = jest.fn().mockReturnValue({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    });

    const getRequest = jest.fn().mockReturnValue({
      url: '/some-resource',
    });

    return {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse,
        getRequest,
      }),
    } as unknown as ArgumentsHost;
  }
});
