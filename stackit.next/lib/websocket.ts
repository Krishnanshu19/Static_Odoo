import type { WebSocketRegister, WebSocketNotification, Notification } from '../types/apis'

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private onNotificationCallback: ((notification: Notification) => void) | null = null

  constructor(private baseUrl: string = 'ws://localhost:5001') {}

  connect(username: string, onNotification?: (notification: Notification) => void) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.ws = new WebSocket(this.baseUrl)
      this.onNotificationCallback = onNotification || null

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        
        // Register for notifications
        this.register(username)
      }

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketNotification = JSON.parse(event.data)
          
          if (data.type === 'notification' && this.onNotificationCallback) {
            this.onNotificationCallback(data.notification)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.handleReconnect(username)
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.handleReconnect(username)
    }
  }

  private register(username: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const registerMessage: WebSocketRegister = {
        type: 'register',
        username
      }
      this.ws.send(JSON.stringify(registerMessage))
    }
  }

  private handleReconnect(username: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      
      setTimeout(() => {
        this.connect(username, this.onNotificationCallback || undefined)
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.onNotificationCallback = null
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  setNotificationCallback(callback: (notification: Notification) => void) {
    this.onNotificationCallback = callback
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService()

// Export the class for testing or custom instances
export default WebSocketService 