/**
 * 🐛 Frontend Debug Logger
 * Tüm API çağrılarını, hataları ve sistem olaylarını loglar
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true' || isDevelopment

// Renkli console log'ları için
const styles = {
  success: 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;',
  error: 'background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px;',
  warning: 'background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px;',
  info: 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;',
  api: 'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;',
  debug: 'background: #6366f1; color: white; padding: 2px 6px; border-radius: 3px;',
}

class Logger {
  private prefix = '🔍 [ElectricityTracker]'

  /**
   * ✅ Success log
   */
  success(message: string, ...args: any[]) {
    if (!isDebugEnabled) return
    console.log(`%c${this.prefix} SUCCESS`, styles.success, message, ...args)
  }

  /**
   * ❌ Error log
   */
  error(message: string, error?: any, ...args: any[]) {
    console.error(`%c${this.prefix} ERROR`, styles.error, message, error, ...args)
    
    // Error detaylarını göster
    if (error) {
      if (error.response) {
        console.error('📦 Response Data:', error.response.data)
        console.error('📊 Response Status:', error.response.status)
        console.error('📋 Response Headers:', error.response.headers)
      } else if (error.request) {
        console.error('📤 Request:', error.request)
      } else {
        console.error('💥 Error Message:', error.message)
      }
      
      if (error.stack) {
        console.error('📚 Stack Trace:', error.stack)
      }
    }
  }

  /**
   * ⚠️ Warning log
   */
  warning(message: string, ...args: any[]) {
    if (!isDebugEnabled) return
    console.warn(`%c${this.prefix} WARNING`, styles.warning, message, ...args)
  }

  /**
   * ℹ️ Info log
   */
  info(message: string, ...args: any[]) {
    if (!isDebugEnabled) return
    console.info(`%c${this.prefix} INFO`, styles.info, message, ...args)
  }

  /**
   * 🌐 API Request log
   */
  apiRequest(method: string, url: string, data?: any) {
    if (!isDebugEnabled) return
    console.group(`%c${this.prefix} API REQUEST`, styles.api)
    console.log('📍 Method:', method)
    console.log('🔗 URL:', url)
    if (data) {
      console.log('📦 Data:', data)
    }
    console.log('⏰ Time:', new Date().toLocaleTimeString())
    console.groupEnd()
  }

  /**
   * 📥 API Response log
   */
  apiResponse(method: string, url: string, status: number, data?: any, duration?: number) {
    if (!isDebugEnabled) return
    const isSuccess = status >= 200 && status < 300
    const style = isSuccess ? styles.success : styles.error
    const icon = isSuccess ? '✅' : '❌'
    
    console.group(`%c${this.prefix} API RESPONSE ${icon}`, style)
    console.log('📍 Method:', method)
    console.log('🔗 URL:', url)
    console.log('📊 Status:', status)
    if (data) {
      console.log('📦 Data:', data)
    }
    if (duration) {
      console.log('⏱️ Duration:', `${duration}ms`)
    }
    console.log('⏰ Time:', new Date().toLocaleTimeString())
    console.groupEnd()
  }

  /**
   * 🐛 Debug log
   */
  debug(message: string, ...args: any[]) {
    if (!isDebugEnabled) return
    console.log(`%c${this.prefix} DEBUG`, styles.debug, message, ...args)
  }

  /**
   * 📊 Table log (güzel formatlı data gösterimi)
   */
  table(data: any) {
    if (!isDebugEnabled) return
    console.table(data)
  }

  /**
   * 👤 User Action log
   */
  userAction(action: string, details?: any) {
    if (!isDebugEnabled) return
    console.log(`%c${this.prefix} USER ACTION`, 'background: #ec4899; color: white; padding: 2px 6px; border-radius: 3px;', action, details)
  }

  /**
   * 🚀 Navigation log
   */
  navigation(from: string, to: string) {
    if (!isDebugEnabled) return
    console.log(`%c${this.prefix} NAVIGATION`, 'background: #14b8a6; color: white; padding: 2px 6px; border-radius: 3px;', `${from} → ${to}`)
  }

  /**
   * 🔄 State Change log
   */
  stateChange(stateName: string, oldValue: any, newValue: any) {
    if (!isDebugEnabled) return
    console.group(`%c${this.prefix} STATE CHANGE`, 'background: #f97316; color: white; padding: 2px 6px; border-radius: 3px;')
    console.log('📝 State:', stateName)
    console.log('🔴 Old:', oldValue)
    console.log('🟢 New:', newValue)
    console.groupEnd()
  }
}

// Singleton instance
export const logger = new Logger()

// Global error handler
if (typeof window !== 'undefined' && isDebugEnabled) {
  window.addEventListener('error', (event) => {
    logger.error('💥 Global Error Caught', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('🚫 Unhandled Promise Rejection', {
      reason: event.reason,
      promise: event.promise,
    })
  })
}

export default logger
