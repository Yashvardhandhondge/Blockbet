import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Waves, Clock } from 'lucide-react';
import { fetchWithRetry } from '@/utils/errorUtils';
import { formatSats } from '@/utils/formatters';

// Name of the event dispatched when a new block is mined
export const BLOCK_MINED_EVENT = 'blockMined';

interface LiveBlockDataProps {
  processBets?: (blockData: any) => void;
  pendingTransactions?: number | null;
  averageBlockTime?: string;
}

const LiveBlockData = ({ 
  processBets,
  pendingTransactions,
  averageBlockTime = "10.0"
}: LiveBlockDataProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [lastBlockHeight, setLastBlockHeight] = useState<number>(0);

  const dispatchBlockMinedEvent = (blockData: any) => {
    // Only dispatch if this is a new block
    if (blockData.height <= lastBlockHeight) {
      return;
    }

    console.log('New block detected:', blockData);
    setLastBlockHeight(blockData.height);

    // Create the event with the current timestamp
    const currentTimestamp = Date.now();
    const event = new CustomEvent(BLOCK_MINED_EVENT, { 
      detail: {
        ...blockData,
        timestamp: currentTimestamp
      }
    });
    
    console.log(`Dispatching block mined event at ${new Date(currentTimestamp).toISOString()}`, {
      height: blockData.height,
      minedBy: blockData.minedBy,
      timestamp: currentTimestamp
    });
    
    window.dispatchEvent(event);

    if (processBets) {
      processBets(blockData);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    wsRef.current = new WebSocket('wss://mempool.space/api/v1/ws');

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      wsRef.current?.send(JSON.stringify({ 
        action: 'want',
        data: ['blocks', 'mempool-blocks', 'mining']
      }));
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.block) {
          dispatchBlockMinedEvent({
            height: data.block.height,
            minedBy: data.block.pool,
            timestamp: new Date(),
            hash: data.block.id,
            difficulty: data.block.difficulty,
            size: data.block.size,
            weight: data.block.weight
          });
        }
      } catch (err) {
        console.error('Error processing websocket message:', err);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      wsRef.current?.close();
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return null;
};

export default LiveBlockData;
