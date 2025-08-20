import { useDialog } from "./DialogContext";

export function useCustomDialog() {
    const { openAlert, openConfirm } = useDialog();

    const alert = (title: string, description: string): Promise<void> => {
        return openAlert(title, description);
    };

    const confirm = (title: string, description: string): Promise<boolean> => {
        return openConfirm(title, description);
    };

    return {
        alert,
        confirm,
    };
}
