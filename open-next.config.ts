import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue';

// 페이지 캐시 설정.
// - 완성된 페이지(메인, 메뉴, 회사소개 등)를 KV(NEXT_INC_CACHE_KV)에 저장하고, 지역 캐시로 KV 읽기도 줄인다.
// - 캐시된 페이지는 Next 서버를 띄우지 않고 바로 돌려준다(enableCacheInterception).
// - revalidate(1시간)가 지난 페이지는 memoryQueue가 WORKER_SELF_REFERENCE로 다시 만든다.
// - 예약 문의(/inquiry) 등 force-dynamic 페이지는 캐시하지 않는다.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: 'long-lived' }),
  queue: memoryQueue,
  enableCacheInterception: true,
});