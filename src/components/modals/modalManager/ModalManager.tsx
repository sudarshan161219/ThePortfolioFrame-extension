import { useModalStore } from "../../../store/modalStore/useModalStore";
import { ExportModal } from "../exportModal/ExportModal";
import { SettingsModal } from "../settingsModal/SettingsModal";

export const ModalManager = () => {
  const { isOpen, type } = useModalStore();

  if (!isOpen) return null;

  switch (type) {
    case "EXPORT":
      return <ExportModal />;

    case "SETTINGS":
      return <SettingsModal />;

    default:
      return null;
  }
};
