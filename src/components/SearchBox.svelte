<script lang="ts">
    import {createDialog} from 'svelte-headlessui'
    import Transition from 'svelte-transition'
    import {onMount} from "svelte";
    import {searchKeyword, type SearchResult} from "../utils/search.ts";

    const dialog = createDialog({label: '博客全文搜索'});

    $: if ($dialog.expanded) {
        document.body.classList.add("overflow-hidden");
    } else {
        document.body.classList.remove("overflow-hidden");
    }

    let loading = false;
    let queueText = '';
    let searchText = '';
    let searchResult: SearchResult[] = [];

    $: handleSearch(searchText);

    async function handleSearch(value: string) {
        if (loading) {
            queueText = value;
            return;
        }
        loading = true;
        searchResult = await searchKeyword(value);
        loading = false;
        if (queueText) {
            queueText = "";
            await handleSearch(queueText);
        }
    }

    function handleClose() {
        dialog.close();
    }

    onMount(() => {
        document.getElementById("koi-search-dialog-control")?.addEventListener?.("click", () => {
            dialog.open();
        });
    });
</script>

<div class="relative z-10">
    <Transition show={$dialog.expanded}>
        <Transition
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
        >
            <button class="fixed size-full left-0 top-0 bg-black/40 backdrop-blur-xl" on:click={dialog.close}/>
        </Transition>

        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex max-h-full justify-center px-4 py-12 text-center">
                <Transition
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                >
                    <div class="w-full max-w-2xl transform overflow-hidden flex flex-col items-start rounded-xl bg-white dark:bg-primary-950 text-black dark:text-white text-left align-middle shadow-xl transition-all"
                         use:dialog.modal>
                        <div class="relative flex-none w-full">
                            <div aria-hidden="true"
                                 class="size-16 flex items-center justify-center absolute left-0 top-0 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1664 1664"
                                     class="size-5">
                                    <path fill="currentColor"
                                          d="M1152 704q0-185-131.5-316.5T704 256T387.5 387.5T256 704t131.5 316.5T704 1152t316.5-131.5T1152 704m512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124q-143 0-273.5-55.5t-225-150t-150-225T0 704t55.5-273.5t150-225t225-150T704 0t273.5 55.5t225 150t150 225T1408 704q0 220-124 399l343 343q37 37 37 90"/>
                                </svg>
                            </div>
                            <label for="koi-search-keyword-input" class="sr-only">搜索关键词：</label>
                            <input id="koi-search-keyword-input"
                                   autocomplete="off"
                                   bind:value={searchText}
                                   class="block w-full h-16 ps-16 bg-transparent text-black dark:text-white focus:outline-0 focus:bg-gray-950/5 dark:focus:bg-gray-50/5 transition-colors placeholder-opacity-30 border-b border-gray-950/5 dark:border-gray-50/5 focus:border-transparent dark:focus:border-transparent"
                                   placeholder="输入搜索关键词……">
                        </div>
                        {#if searchResult && searchResult.length > 0}
                            <ul class="p-4 space-y-4 flex-auto w-full max-h-full overflow-y-auto">
                                {#each searchResult as item}
                                    <li>
                                        <a href={`/post/${item.name}`}
                                           on:click={handleClose}
                                           class="flex items-start bg-gray-950/5 dark:bg-gray-50/5 rounded-md hover:bg-primary-700 dark:hover:bg-primary-700 hover:text-white active:bg-primary-700 dark:active:bg-primary-700 active:text-white">
                                            <div class="flex-none size-14 flex items-center justify-center">
                                                <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="1em"
                                                     height="1em" viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                          d="M7 17h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"/>
                                                </svg>
                                            </div>
                                            <div class="flex-auto min-w-0 space-y-2 py-4 pe-4">
                                                <h2 class="truncate">{item.title}</h2>
                                                <p class="text-sm opacity-60">{item.excerpt}</p>
                                            </div>
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <div class="py-16 w-full flex items-center justify-center opacity-60">
                                {#if searchText.trim()}
                                    没有找到你需要的东西的说……
                                {:else}
                                    来搜索点什么吧w
                                {/if}
                            </div>
                        {/if}

                    </div>
                </Transition>
            </div>
        </div>
    </Transition>
</div>
