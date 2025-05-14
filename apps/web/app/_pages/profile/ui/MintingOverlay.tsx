import {
  CheckCircle,
  CircleDollarSign,
  Gem,
  Loader2,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

export function MintingOverlay() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated icons */}
        <FloatingIcon Icon={Sparkles} size={24} speed={15} delay={0} />
        <FloatingIcon Icon={Zap} size={28} speed={12} delay={0.5} />
        <FloatingIcon Icon={Star} size={20} speed={18} delay={1} />
        <FloatingIcon
          Icon={CircleDollarSign}
          size={32}
          speed={20}
          delay={1.5}
        />
        <FloatingIcon Icon={Gem} size={36} speed={25} delay={2} />
        <FloatingIcon Icon={Sparkles} size={18} speed={14} delay={2.5} />
        <FloatingIcon Icon={Star} size={22} speed={16} delay={3} />
        <FloatingIcon Icon={Zap} size={26} speed={22} delay={3.5} />
      </div>

      <div className="bg-card border-primary/20 relative z-10 animate-pulse rounded-xl border p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full"></div>
            <div className="bg-primary text-primary-foreground relative rounded-full p-4">
              <Loader2 className="size-12 animate-spin" />
            </div>
          </div>
          <h2 className="text-foreground mt-4 text-2xl font-bold">
            Minting Your NFT
          </h2>
          <p className="text-muted-foreground max-w-md text-center">
            Please wait while we mint your unique digital asset on the
            blockchain...
          </p>

          {/* <div className="bg-muted mt-4 h-2.5 w-full max-w-xs overflow-hidden rounded-full">
            <div className="bg-primary animate-progress h-full rounded-full"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

interface FloatingIconProps {
  Icon: React.ElementType;
  size: number;
  speed: number;
  delay: number;
}

function FloatingIcon({ Icon, size, speed, delay }: FloatingIconProps) {
  const randomPosition = {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  };

  return (
    <div
      className="text-primary/40 animate-float absolute"
      style={{
        ...randomPosition,
        animationDuration: `${speed}s`,
        animationDelay: `${delay}s`,
        width: size,
        height: size,
      }}
    >
      <Icon size={size} />
    </div>
  );
}
