import { createSignal, onMount, For, Show } from "solid-js";
import { listPost } from "../api/archive";
import type { PostMeta } from "../types/archive";

interface YearGroup {
  label: string;
  value: PostMeta[];
}

export default function Archive() {
  const [yearList, setYearList] = createSignal<YearGroup[]>([]);
  const [amount, setAmount] = createSignal(0);
  const [loaded, setLoaded] = createSignal(false);
  const [message, setMessage] = createSignal("归档页面加载中……");

  const init = async () => {
    const res = await listPost();
    setAmount(res.data.length);

    // Sort by time descending
    res.data.sort((a, b) => {
      if (a.Time > b.Time) return -1;
      if (a.Time < b.Time) return 1;
      return 0;
    });

    const yearMap = new Map<number, PostMeta[]>();

    res.data.forEach(e => {
      const year = new Date(e.Time * 1000).getFullYear();
      let handle = yearMap.get(year);
      if (!handle) {
        handle = [];
        yearMap.set(year, handle);
      }
      handle.push(e);
    });

    const newYearList: YearGroup[] = [];
    yearMap.forEach((v, k) => {
      newYearList.push({
        label: `${k} 年`,
        value: v,
      });
    });

    setYearList(newYearList);
  };

  onMount(() => {
    (async () => {
      try {
        await init();
        setLoaded(true);
      } catch (e) {
        setMessage((e as any)?.message || "加载失败");
      }
    })();
  });

  return (
    <Show when={loaded()} fallback={<p>{message()}</p>}>
      <p>如今，本博客已经有 {amount()} 篇文章了呢。</p>
      <For each={yearList()}>
        {yearGroup => (
          <>
            <h2>{yearGroup.label}</h2>
            <ul>
              <For each={yearGroup.value}>
                {post => (
                  <li>
                    <a href={`/post/${post.Name}`}>{post.Title}</a>
                  </li>
                )}
              </For>
            </ul>
          </>
        )}
      </For>
    </Show>
  );
}
