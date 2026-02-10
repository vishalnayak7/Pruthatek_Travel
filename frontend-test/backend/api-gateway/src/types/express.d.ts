import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    validated?: {
      body?: any;
      query?: any;
      params?: any;
    };
  }

  interface Response {
    success: (
      message?: string | null,
      data?: any,
      statusCode?: number
    ) => void;

    fail: (
      message?: string | null,
      statusCode?: number,
      extra?: Record<string, any>
    ) => void;
  }
}

export {};
