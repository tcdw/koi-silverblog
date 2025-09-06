import { createContext, useContext, ParentProps } from "solid-js";
import { createStore } from "solid-js/store";

export interface DialogState {
  isOpen: boolean;
  title: string;
  description: string;
  type: "alert" | "confirm";
  resolve?: (value: boolean) => void;
}

interface DialogContextValue {
  state: DialogState;
  openAlert: (title: string, description: string) => Promise<void>;
  openConfirm: (title: string, description: string) => Promise<boolean>;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue>();

export function DialogProvider(props: ParentProps) {
  const [state, setState] = createStore<DialogState>({
    isOpen: false,
    title: "",
    description: "",
    type: "alert",
  });

  const openAlert = (title: string, description: string): Promise<void> => {
    return new Promise(resolve => {
      setState({
        isOpen: true,
        title,
        description,
        type: "alert",
        resolve: () => resolve(),
      });
    });
  };

  const openConfirm = (title: string, description: string): Promise<boolean> => {
    return new Promise(resolve => {
      setState({
        isOpen: true,
        title,
        description,
        type: "confirm",
        resolve: (value: boolean) => resolve(value),
      });
    });
  };

  const closeDialog = () => {
    setState("isOpen", false);
  };

  const contextValue: DialogContextValue = {
    state,
    openAlert,
    openConfirm,
    closeDialog,
  };

  return <DialogContext.Provider value={contextValue}>{props.children}</DialogContext.Provider>;
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
