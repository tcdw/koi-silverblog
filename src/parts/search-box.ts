import SearchBox from "../components/SearchBox.svelte";
import {mount} from "svelte";

mount(SearchBox, {
    target: document.getElementById("koi-search-box-host")!
})