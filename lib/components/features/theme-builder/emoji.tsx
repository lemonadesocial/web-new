import { motion, useTime, useTransform } from 'framer-motion';
import { useEffect, useState, createContext, useContext } from 'react';
import { emojis } from './store';

interface EmojiState {
  id: string;
  emoji: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isActive: boolean;
}

// Context to share emoji states between components
const EmojiContext = createContext<{
  emojis: EmojiState[];
  updateEmoji: (id: string, newState: EmojiState) => void;
  removeEmoji: (id: string) => void;
  addEmoji: (emoji: EmojiState) => void;
}>({
  emojis: [],
  updateEmoji: () => {},
  removeEmoji: () => {},
  addEmoji: () => {},
});

// Provider component to manage all emojis
export function EmojiProvider({ children }: { children: React.ReactNode }) {
  const [emojis, setEmojis] = useState<EmojiState[]>([]);

  const updateEmoji = (id: string, newState: EmojiState) => {
    setEmojis((prev) => prev.map((emoji) => (emoji.id === id ? newState : emoji)));
  };

  const removeEmoji = (id: string) => {
    setEmojis((prev) => prev.filter((emoji) => emoji.id !== id));
  };

  const addEmoji = (emoji: EmojiState) => {
    setEmojis((prev) => [...prev, emoji]);
  };

  return (
    <EmojiContext.Provider value={{ emojis, updateEmoji, removeEmoji, addEmoji }}>{children}</EmojiContext.Provider>
  );
}

export function EmojiAnimateItem({
  emoji = '🚀',
  emojis = ['🚀', '✨', '🌟', '💫', '🎉', '⚡', '🔥', '💎', '🌈', '🦋'],
}: {
  emoji?: string;
  emojis?: string[];
}) {
  const time = useTime();
  const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false });
  const { emojis: allEmojis, updateEmoji, removeEmoji, addEmoji } = useContext(EmojiContext);

  // Function to create emoji starting from outside window
  const createNewEmoji = (): EmojiState => {
    if (typeof window === 'undefined') {
      return {
        id: Math.random().toString(),
        emoji: emoji,
        x: 100,
        y: 100,
        velocityX: 1,
        velocityY: 1,
        isActive: true,
      };
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Choose random side to start from (0=top, 1=right, 2=bottom, 3=left)
    const startSide = Math.floor(Math.random() * 4);
    let startX: number, startY: number, velX: number, velY: number;

    const speed = 2; // Consistent slow speed

    switch (startSide) {
      case 0: // Start from top
        startX = Math.random() * windowWidth;
        startY = -100;
        velX = (Math.random() - 0.5) * speed;
        velY = speed;
        break;
      case 1: // Start from right
        startX = windowWidth + 100;
        startY = Math.random() * windowHeight;
        velX = -speed;
        velY = (Math.random() - 0.5) * speed;
        break;
      case 2: // Start from bottom
        startX = Math.random() * windowWidth;
        startY = windowHeight + 100;
        velX = (Math.random() - 0.5) * speed;
        velY = -speed;
        break;
      case 3: // Start from left
        startX = -100;
        startY = Math.random() * windowHeight;
        velX = speed;
        velY = (Math.random() - 0.5) * speed;
        break;
      default:
        startX = -100;
        startY = windowHeight / 2;
        velX = speed;
        velY = 0;
    }

    return {
      id: Math.random().toString(),
      emoji: randomEmoji,
      x: startX,
      y: startY,
      velocityX: velX,
      velocityY: velY,
      isActive: true,
    };
  };

  const [emojiState, setEmojiState] = useState<EmojiState>(() => {
    const newEmoji = createNewEmoji();
    // Add to context on creation
    setTimeout(() => addEmoji(newEmoji), 0);
    return newEmoji;
  });

  // Collision detection function
  const checkCollisions = (currentEmoji: EmojiState, otherEmojis: EmojiState[]): EmojiState => {
    const emojiSize = 50; // Approximate emoji collision radius
    let newVelocityX = currentEmoji.velocityX;
    let newVelocityY = currentEmoji.velocityY;

    for (const other of otherEmojis) {
      if (other.id === currentEmoji.id || !other.isActive) continue;

      // Calculate distance between emojis
      const dx = currentEmoji.x - other.x;
      const dy = currentEmoji.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if collision occurred
      if (distance < emojiSize) {
        // Simple elastic collision - reverse velocities with some randomness
        const angle = Math.atan2(dy, dx);
        const speed = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY);

        // Add some randomness to prevent emojis from getting stuck
        const randomAngle = angle + (Math.random() - 0.5) * 0.5;

        newVelocityX = Math.cos(randomAngle) * speed;
        newVelocityY = Math.sin(randomAngle) * speed;

        // Ensure minimum speed
        const minSpeed = 1;
        const currentSpeed = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY);
        if (currentSpeed < minSpeed) {
          newVelocityX = (newVelocityX / currentSpeed) * minSpeed;
          newVelocityY = (newVelocityY / currentSpeed) * minSpeed;
        }

        break; // Only handle one collision per frame
      }
    }

    return {
      ...currentEmoji,
      velocityX: newVelocityX,
      velocityY: newVelocityY,
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updatePosition = () => {
      setEmojiState((prev) => {
        if (!prev.isActive) return prev;

        // Check for collisions with other emojis
        const afterCollision = checkCollisions(prev, allEmojis);

        // Move emoji with updated velocity
        const newX = afterCollision.x + afterCollision.velocityX;
        const newY = afterCollision.y + afterCollision.velocityY;

        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Check if emoji is completely off screen on the opposite side
        const isOffScreen =
          (afterCollision.velocityX > 0 && newX > windowWidth + 100) ||
          (afterCollision.velocityX < 0 && newX < -100) ||
          (afterCollision.velocityY > 0 && newY > windowHeight + 100) ||
          (afterCollision.velocityY < 0 && newY < -100);

        if (isOffScreen) {
          // Remove current emoji from context
          removeEmoji(prev.id);
          // Create new emoji starting from outside window
          const newEmoji = createNewEmoji();
          addEmoji(newEmoji);
          return newEmoji;
        }

        const updatedEmoji = {
          ...afterCollision,
          x: newX,
          y: newY,
        };

        // Update in context
        updateEmoji(prev.id, updatedEmoji);

        return updatedEmoji;
      });
    };

    const interval = setInterval(updatePosition, 8); // ~30fps
    return () => clearInterval(interval);
  }, [allEmojis, updateEmoji, removeEmoji, addEmoji, emojis]);

  if (!emojiState.isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      <motion.div
        key={emojiState.id}
        style={{
          rotate,
          x: emojiState.x,
          y: emojiState.y,
        }}
        className="absolute text-6xl select-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {emojiState.emoji}
      </motion.div>
    </div>
  );
}

// Component for multiple moving emojis with collision detection
export function EmojiAnimate({ emoji }: { emoji?: string }) {
  // just for fun
  // const emojis = ['🚀', '✨', '🌟', '💫', '🎉', '⚡', '🔥', '💎', '🌈', '🦋', '🎨', '🌙', '☀️', '🌊'];
  if (!emoji) return null;

  const emojis = Array.from({ length: 8 }, (_) => emoji);

  return (
    <EmojiProvider>
      {Array.from({ length: 8 }, (_, i) => (
        <EmojiAnimateItem key={i} emojis={emojis} />
      ))}
    </EmojiProvider>
  );
}
