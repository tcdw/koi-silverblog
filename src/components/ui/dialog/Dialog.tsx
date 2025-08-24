import { createEffect } from "solid-js";
import * as Dialog from "@kobalte/core/dialog";
import { useDialog } from "./DialogContext";
import { twMerge } from "tailwind-merge";

export function DialogContainer() {
    const { state, closeDialog } = useDialog();

    const handleClose = () => {
        if (state.resolve && state.type === "alert") {
            state.resolve(true);
        }
        closeDialog();
    };

    const handleConfirm = () => {
        if (state.resolve) {
            state.resolve(true);
        }
        closeDialog();
    };

    const handleCancel = () => {
        if (state.resolve) {
            state.resolve(false);
        }
        closeDialog();
    };

    createEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && state.isOpen) {
                handleClose();
            }
        };

        if (state.isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    });

    return (
        <Dialog.Root open={state.isOpen} onOpenChange={closeDialog}>
            <Dialog.Portal>
                <Dialog.Overlay
                    class={twMerge(
                        "fixed inset-0 z-50 bg-black/50 animate-in fade-in-0",
                        "duration-300 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0",
                    )}
                />
                <Dialog.Content
                    class={twMerge(
                        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl dark:bg-gray-800",
                        "duration-300 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95",
                    )}
                >
                    <div class="flex flex-col gap-3">
                        <Dialog.Title class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{state.title}</Dialog.Title>
                        <Dialog.Description class="text-sm text-gray-500 dark:text-gray-400">{state.description}</Dialog.Description>
                    </div>
                    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-5">
                        {state.type === "confirm" && (
                            <Dialog.CloseButton
                                onClick={handleCancel}
                                class="block rounded-md px-4 py-2 text-center text-sm text-black dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                取消
                            </Dialog.CloseButton>
                        )}
                        <Dialog.CloseButton
                            onClick={state.type === "confirm" ? handleConfirm : handleClose}
                            class="block rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                            {state.type === "confirm" ? "确认" : "确定"}
                        </Dialog.CloseButton>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
