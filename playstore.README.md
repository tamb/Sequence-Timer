# Deploying to the Google Play Store

This guide provides instructions on how to build and deploy your Capacitor application to the Google Play Store.

## Prerequisites

1.  **Google Play Developer Account**: You must have a Google Play Developer account. If you don't have one, you can register [here](https://play.google.com/apps/publish/signup/).
2.  **Completed App Information**: Before you can publish, you'll need to fill out all the required information in the Google Play Console, including app details, store listing, content rating, and pricing.

## Step 1: Generate a Signing Key

You need to sign your app with a key that you'll use for all future updates.

1.  Open your terminal and run the following command to generate a new keystore. This command will prompt you for passwords for the keystore and key, and for the Distinguished Name fields for your key.

    ```bash
    keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
    ```

    -   Replace `my-release-key.keystore` with your desired keystore file name.
    -   Replace `alias_name` with your desired alias.
    -   Keep this file safe and back it up. **If you lose this key, you will not be able to publish updates to your app.**

2.  Move the generated `my-release-key.keystore` file into the `android/app` directory of your project.

## Step 2: Configure Gradle for Signing

To avoid storing your keystore passwords in plain text in your build file, you should create a `keystore.properties` file.

1.  Create a new file named `keystore.properties` in the `android` directory.

2.  Add the following content to `android/keystore.properties`. Replace the values with your actual keystore details from the previous step.

    ```properties
    storePassword=YOUR_KEYSTORE_PASSWORD
    keyAlias=alias_name
    keyPassword=YOUR_KEY_PASSWORD
    storeFile=app/my-release-key.keystore
    ```

3.  **IMPORTANT**: Add this file to your `.gitignore` file to prevent your keys from being checked into source control. Add this line to your root `.gitignore` file:

    ```
    # Keystore file
    /android/keystore.properties
    ```

4.  Now, open `android/app/build.gradle` and configure it to use these properties.

    First, add this code at the top of the file to load the properties:
    ```gradle
    def keystorePropertiesFile = rootProject.file("../keystore.properties")
    def keystoreProperties = new Properties()
    if (keystorePropertiesFile.exists()) {
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
    }
    ```

    Then, find the `android` block and add a `signingConfigs` block inside it. Also, update the `release` build type to use this new signing configuration.

    ```gradle
    android {
        // ... other configurations

        signingConfigs {
            release {
                if (keystorePropertiesFile.exists()) {
                    storeFile file(keystoreProperties.storeFile)
                    storePassword keystoreProperties.storePassword
                    keyAlias keystoreProperties.keyAlias
                    keyPassword keystoreProperties.keyPassword
                }
            }
        }

        buildTypes {
            release {
                // ... other release configs
                signingConfig signingConfigs.release
            }
        }
    }
    ```

## Step 3: Build the Production App

Before building the native app, make sure your web assets are up-to-date.

1.  **Build Web Assets**:
    ```bash
    bun run build
    ```

2.  **Sync with Android**:
    ```bash
    npx cap sync android
    ```

3.  **Build the Android App Bundle**:
    Navigate to the `android` directory and run the `bundleRelease` Gradle task. This will generate a signed Android App Bundle (`.aab` file).

    ```bash
    cd android
    ./gradlew bundleRelease
    cd ..
    ```

    The generated App Bundle will be located at `android/app/build/outputs/bundle/release/app-release.aab`. This is the file you will upload to the Google Play Store.

## Step 4: Deploy to Google Play Store

1.  **Go to the Google Play Console**.
2.  **Select your app**.
3.  Navigate to **Production** under the **Release** section in the left-hand menu.
4.  Click **Create new release**.
5.  Upload the `app-release.aab` file you generated.
6.  Fill in the release notes and other details.
7.  Click **Save**, then **Review release**, and finally, **Start rollout to production**.

The review process can take a few hours to a few days. Once approved, your app will be live on the Google Play Store. 