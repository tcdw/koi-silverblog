<script lang="ts">
    import { onMount } from "svelte";
    import { listPost } from "../api/archive";
    import type { PostMeta } from "../types/archive";

    const yearMap = new Map<number, PostMeta[]>();

    let yearList: { label: string, value: PostMeta[] }[] = [];
    let amount = 0;
    let loaded = false;
    let message = "归档页面加载中……";

    async function init() {
        const res = await listPost();
        amount = res.data.length;
        res.data.sort((a, b) => {
            // 按时间降序
            if (a.Time > b.Time) {
                return -1;
            }
            if (a.Time < b.Time) {
                return 1;
            }
            return 0;
        });
        res.data.forEach((e) => {
            const year = new Date(e.Time * 1000).getFullYear();
            let handle = yearMap.get(year);
            if (!handle) {
                handle = [];
                yearMap.set(year, handle);
            }
            handle.push(e);
        });
        yearMap.forEach((v, k) => {
            yearList.push({
                label: `${k} 年`,
                value: v,
            });
        });
        yearList = yearList;
    }

    onMount(async () => {
        try {
            await init();
            loaded = true;
        } catch (e) {
            message = (e as any)?.message;
        }
    });
</script>

{#if (loaded)}
    <p>如今，本博客已经有 {amount} 篇文章了呢。</p>
    {#each yearList as e}
        <h2>{e.label}</h2>
        <ul>
            {#each e.value as f}
                <li><a href="/post/{f.Name}">{f.Title}</a></li>
            {/each}
        </ul>
    {/each}
{:else}
    <p>{message}</p>
{/if}
