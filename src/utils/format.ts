import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDateTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
}

export function createSrcsetString(sources: Array<{ size: string; src: string }>): string {
  return sources.map(source => `${source.src} ${source.size}`).join(", ");
}

export function getAvatarUrl(
  emailHashed: string,
  size: number,
  gravatarBaseUrl: string = "https://secure.gravatar.com/avatar/",
): string {
  return `${gravatarBaseUrl}${emailHashed}?s=${size}&d=identicon`;
}

export function getAvatarSrcset(
  emailHashed: string,
  size: number,
  gravatarBaseUrl: string = "https://secure.gravatar.com/avatar/",
): string {
  return createSrcsetString([
    { size: "1x", src: getAvatarUrl(emailHashed, size, gravatarBaseUrl) },
    { size: "2x", src: getAvatarUrl(emailHashed, size * 2, gravatarBaseUrl) },
  ]);
}
