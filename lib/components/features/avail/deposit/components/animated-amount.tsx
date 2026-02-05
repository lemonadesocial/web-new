"use client";

type AnimationDirection = "up" | "down" | "none";

/**
 * Determine animation direction for a single character
 */
function getCharDirection(
  prevChar: string | undefined,
  currChar: string
): AnimationDirection {
  // Non-digit characters (like $, comma, period) don't animate
  if (!/\d/.test(currChar)) return "none";

  // New digit that didn't exist before - animate up
  if (prevChar === undefined) return "up";

  // Previous wasn't a digit - animate based on new value
  if (!/\d/.test(prevChar)) return "up";

  const prev = parseInt(prevChar, 10);
  const curr = parseInt(currChar, 10);

  if (curr > prev) return "up";
  if (curr < prev) return "down";
  return "none";
}

/**
 * Align strings from decimal point for proper digit comparison
 */
function alignStringsForComparison(
  prev: string,
  curr: string
): { prevAligned: string[]; currAligned: string[] } {
  // Extract parts before and after decimal
  const [prevInt, prevDec = ""] = prev.replace(/[^0-9.]/g, "").split(".");
  const [currInt, currDec = ""] = curr.replace(/[^0-9.]/g, "").split(".");

  // Pad integer parts from the left
  const maxIntLen = Math.max(prevInt.length, currInt.length);
  const prevIntPadded = prevInt.padStart(maxIntLen, " ");
  const currIntPadded = currInt.padStart(maxIntLen, " ");

  // Pad decimal parts from the right
  const maxDecLen = Math.max(prevDec.length, currDec.length);
  const prevDecPadded = prevDec.padEnd(maxDecLen, " ");
  const currDecPadded = currDec.padEnd(maxDecLen, " ");

  // Reconstruct with formatting characters from current value
  const currChars = curr.split("");
  const prevAligned: string[] = [];

  let intIdx = 0;
  let decIdx = 0;
  let inDecimal = false;

  for (const char of currChars) {
    if (char === ".") {
      inDecimal = true;
      prevAligned.push(".");
    } else if (/\d/.test(char)) {
      if (inDecimal) {
        prevAligned.push(prevDecPadded[decIdx] || " ");
        decIdx++;
      } else {
        prevAligned.push(prevIntPadded[intIdx] || " ");
        intIdx++;
      }
    } else {
      // Non-digit, non-decimal (like $ or ,)
      prevAligned.push(char);
    }
  }

  return { prevAligned, currAligned: currChars };
}

interface AnimatedDigitProps {
  char: string;
  direction: AnimationDirection;
  delay: number;
}

function AnimatedDigit({ char, direction, delay }: AnimatedDigitProps) {
  const animationClass =
    direction === "up"
      ? "animate-digit-up"
      : direction === "down"
      ? "animate-digit-down"
      : "";

  return (
    <span
      className={`inline-block ${animationClass}`}
      style={{
        animationDelay: direction !== "none" ? `${delay}ms` : undefined,
        animationFillMode: "both",
        willChange: direction !== "none" ? "transform, opacity" : undefined,
      }}
    >
      {char}
    </span>
  );
}

export interface AnimatedAmountProps {
  value: string;
  previousValue: string;
  className?: string;
}

export function AnimatedAmount({
  value,
  previousValue,
  className,
}: AnimatedAmountProps) {
  const { prevAligned, currAligned } = alignStringsForComparison(
    previousValue,
    value
  );

  let animatingIndex = 0;

  return (
    <span className={`${className} tabular-nums`}>
      {currAligned.map((char, index) => {
        const prevChar = prevAligned[index];
        const direction = getCharDirection(prevChar, char);
        const delay = direction !== "none" ? animatingIndex * 20 : 0;
        if (direction !== "none") animatingIndex++;

        return (
          <AnimatedDigit
            key={`${index}-${char}-${value}`}
            char={char}
            direction={direction}
            delay={delay}
          />
        );
      })}
    </span>
  );
}

