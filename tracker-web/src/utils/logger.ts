export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  source?: string;
  additionalData?: any;
  userId?: string;
  userEmail?: string;
  tenantId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addLog(level: LogLevel, message: string, source?: string, additionalData?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      source,
      additionalData
    };

    // Add to memory
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    if (this.isDevelopment) {
      const timestamp = logEntry.timestamp.toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`${prefix} ${message}`, additionalData || '');
          break;
        case LogLevel.INFO:
          console.info(`${prefix} ${message}`, additionalData || '');
          break;
        case LogLevel.WARN:
          console.warn(`${prefix} ${message}`, additionalData || '');
          break;
        case LogLevel.ERROR:
          console.error(`${prefix} ${message}`, additionalData || '');
          break;
      }
    }

    // Send to server in production
    if (!this.isDevelopment && level !== LogLevel.DEBUG) {
      this.sendToServer(logEntry);
    }
  }

  private async sendToServer(logEntry: LogEntry) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('http://localhost:5143/api/log/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Fallback to console if server is not available
      console.error('Failed to send log to server:', error);
    }
  }

  debug(message: string, source?: string, additionalData?: any) {
    this.addLog(LogLevel.DEBUG, message, source, additionalData);
  }

  info(message: string, source?: string, additionalData?: any) {
    this.addLog(LogLevel.INFO, message, source, additionalData);
  }

  warn(message: string, source?: string, additionalData?: any) {
    this.addLog(LogLevel.WARN, message, source, additionalData);
  }

  error(message: string, source?: string, additionalData?: any) {
    this.addLog(LogLevel.ERROR, message, source, additionalData);
  }

  logUserActivity(activity: string, userId?: string, userEmail?: string, tenantId?: string) {
    this.info(`User Activity: ${activity}`, 'UserActivity', { userId, userEmail, tenantId });
  }

  logApiRequest(method: string, url: string, userId?: string, userEmail?: string, tenantId?: string) {
    this.info(`API Request: ${method} ${url}`, 'ApiRequest', { userId, userEmail, tenantId });
  }

  logApiResponse(method: string, url: string, statusCode: number, userId?: string, userEmail?: string, tenantId?: string) {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.addLog(level, `API Response: ${method} ${url} - Status: ${statusCode}`, 'ApiResponse', { userId, userEmail, tenantId });
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('Unhandled error', 'GlobalErrorHandler', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.toString()
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', 'GlobalErrorHandler', {
      reason: event.reason?.toString()
    });
  });
} 