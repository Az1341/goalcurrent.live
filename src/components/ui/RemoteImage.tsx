import Image, { type ImageProps } from "next/image";
import { shouldUseUnoptimizedImage } from "@/lib/images";

type RemoteImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: ImageProps["style"];
  priority?: boolean;
  sizes?: string;
  onError?: ImageProps["onError"];
};

/** Next.js Image wrapper — local /public assets + known remote CDNs; explicit dimensions for CLS. */
export default function RemoteImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  sizes,
  onError,
}: RemoteImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      sizes={sizes}
      onError={onError}
      unoptimized={shouldUseUnoptimizedImage(src)}
    />
  );
}
