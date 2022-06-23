/** @type {import('@sveltejs/kit').Handle} */
type MaybePromise<T> = T | Promise<T>
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
export async function handle({ event, resolve }: {event: RequestEvent, resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>}) {
  const response = await resolve(event, {
    ssr: false,
  });

  return response;
}