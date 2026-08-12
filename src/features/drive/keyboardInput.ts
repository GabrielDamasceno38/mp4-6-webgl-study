import { driveKeys } from "./drive.config";

export type DriveInputState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

function hasAnyKey(pressed: Set<string>, keys: readonly string[]) {
  return keys.some((key) => pressed.has(key));
}

export class KeyboardInput {
  private readonly pressed = new Set<string>();
  private resetHandler: (() => void) | null = null;

  private readonly onKeyDown = (event: KeyboardEvent) => {
    this.pressed.add(event.code);

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
      event.preventDefault();
    }

    if (event.code === driveKeys.reset) {
      this.resetHandler?.();
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent) => {
    this.pressed.delete(event.code);
  };

  connect(onReset: () => void) {
    this.resetHandler = onReset;
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp);
  }

  disconnect() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.pressed.clear();
    this.resetHandler = null;
  }

  read(): DriveInputState {
    return {
      forward: hasAnyKey(this.pressed, driveKeys.forward),
      backward: hasAnyKey(this.pressed, driveKeys.backward),
      left: hasAnyKey(this.pressed, driveKeys.left),
      right: hasAnyKey(this.pressed, driveKeys.right),
    };
  }
}
