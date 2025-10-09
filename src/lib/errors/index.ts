export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      code: string;
      statusCode: number;
      details?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = "AppError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, {
      code: "VALIDATION_ERROR",
      statusCode: 400,
      details,
    });
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, {
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, {
      code: "FORBIDDEN",
      statusCode: 403,
    });
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, {
      code: "NOT_FOUND",
      statusCode: 404,
    });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, {
      code: "CONFLICT",
      statusCode: 409,
    });
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, {
      code: "RATE_LIMITED",
      statusCode: 429,
    });
    this.name = "RateLimitError";
  }
}

export class ProviderError extends AppError {
  constructor(provider: string, message: string) {
    super(`${provider} error: ${message}`, {
      code: "PROVIDER_ERROR",
      statusCode: 502,
      details: { provider },
    });
    this.name = "ProviderError";
  }
}

export class InternalError extends AppError {
  constructor(message = "An unexpected error occurred") {
    super(message, {
      code: "INTERNAL_ERROR",
      statusCode: 500,
    });
    this.name = "InternalError";
  }
}

export function handleApiError(error: unknown): ApiErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  console.error("Unhandled error:", error);

  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  };
}

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
