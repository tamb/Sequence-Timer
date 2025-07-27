# Testing on Android

This guide provides instructions on how to run and test the Capacitor app on a physical Android device.

## Prerequisites

1.  **Android Studio**: Ensure you have Android Studio installed and configured correctly. You can download it from the [official website](https://developer.android.com/studio).
2.  **Android Device**: You need a physical Android device.
3.  **Developer Mode & USB Debugging**: Enable Developer Mode and USB Debugging on your Android device. You can find instructions on how to do this [here](https://developer.android.com/studio/debug/dev-options).
4.  **Node.js and Bun**: Make sure you have Node.js and Bun installed.

## Build and Run Steps

1.  **Install Dependencies**:
    Open your terminal in the project root directory and run:
    ```bash
    bun install
    ```

2.  **Build the Web App**:
    Build the web assets that will be copied to your native project.
    ```bash
    bun run build
    ```

3.  **Sync with Android Project**:
    This command copies the web build into the native project and updates native dependencies.
    ```bash
    npx cap sync android
    ```

4.  **Open in Android Studio**:
    Open the native Android project in Android Studio.
    ```bash
    npx cap open android
    ```

5.  **Run on Device**:
    - Connect your Android device to your computer via USB.
    - In Android Studio, you should see your device listed in the toolbar.
    - Click the "Run" button (the green play icon) to build and run the app on your device.

## Live Reload (Optional)

For a better development experience with live reload on your device:

1.  Find your computer's local IP address.
2.  Update `capacitor.config.ts` to include a `server` configuration.
    ```typescript
    import { CapacitorConfig } from '@capacitor/cli';

    const config: CapacitorConfig = {
      // ... other configs
      server: {
        url: 'http://YOUR_LOCAL_IP:5173', // Vite's default port is 5173, check your vite.config.ts
        cleartext: true,
      },
    };

    export default config;
    ```
    Replace `YOUR_LOCAL_IP` with your actual local IP address. You may need to create this `server` object if it does not exist.

3.  Run the Vite development server:
    ```bash
    bun run dev
    ```

4.  In a separate terminal, run the app on your device with the `--livereload` flag. This command will point the native app to your development server.
    ```bash
    npx cap run android --livereload
    ```
    The app will open on your device and automatically reload when you make changes to your web code.
