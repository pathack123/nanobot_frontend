// WebSocket utility for real-time user notifications

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
  }

  connect() {
    if (this.ws || this.isConnecting) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
    
    try {
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyListeners({
          type: 'connection',
          message: 'Connected to server',
          status: 'connected'
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);
          this.notifyListeners(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
        this.notifyListeners({
          type: 'error',
          message: 'WebSocket error occurred',
          status: 'error'
        });
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.ws = null;
        this.isConnecting = false;
        
        this.notifyListeners({
          type: 'connection',
          message: 'Disconnected from server',
          status: 'disconnected'
        });

        // Auto reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
      this.ws.close();
      this.ws = null;
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
const wsClient = new WebSocketClient();

export default wsClient;

