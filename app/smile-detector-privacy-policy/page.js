export const metadata = {
  title: "Privacy Policy - Smile Detector Chrome Extension",
  description: "Learn how the Smile Detector Chrome Extension handles your data: We do NOT collect, store, or transmit any personal information. All processing happens locally in your browser.",
};

export default function SmileDetectorPrivacyPolicy() {
  return (
    <main
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        lineHeight: 1.6,
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        color: "#333",
      }}
    >
      <h1
        style={{
          color: "#667eea",
          borderBottom: "3px solid #667eea",
          paddingBottom: "10px",
        }}
      >
        Privacy Policy for Smile Detector Chrome Extension
      </h1>

      <p
        style={{
          color: "#666",
          fontStyle: "italic",
          marginBottom: "30px",
        }}
        className="last-updated"
      >
        Last Updated: November 2024
      </p>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Introduction</h2>
        <p>
          This Privacy Policy describes how the Smile Detector Chrome Extension
          ("we", "our", or "the Extension") handles information when you use our
          extension. We are committed to protecting your privacy and ensuring
          transparency about our data practices.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Data Collection</h2>
        <div
          style={{
            backgroundColor: "#f0f4ff",
            padding: "15px",
            borderLeft: "4px solid #667eea",
            margin: "20px 0",
          }}
          className="highlight"
        >
          <strong>
            The Smile Detector extension does NOT collect, store, or transmit any
            personal data or user information.
          </strong>
        </div>
        <p>Specifically, we do NOT:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Collect or store your webcam video feed</li>
          <li>Transmit any video or image data to external servers</li>
          <li>Collect face detection results or facial recognition data</li>
          <li>Track your browsing activity or website visits</li>
          <li>Share any data with third parties</li>
          <li>Use analytics or tracking services</li>
        </ul>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Local Processing</h2>
        <p>All processing happens entirely on your device:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Webcam Feed:</strong> Your webcam video is processed locally in
            your browser using the face-api.js library. No video data leaves your
            device.
          </li>
          <li>
            <strong>Face Detection:</strong> All face detection and expression
            recognition occurs locally using AI models loaded from a public CDN.
            Detection results are never stored or transmitted.
          </li>
          <li>
            <strong>User Preferences:</strong> Settings such as whitelisted sites
            and display preferences are stored locally in your browser using
            Chrome's storage API. This data never leaves your device.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Third-Party Services</h2>
        <p>The extension uses the following third-party resources:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>face-api.js:</strong> An open-source JavaScript library for
            face detection. The library code is bundled with the extension.
          </li>
          <li>
            <strong>Model Weights (CDN):</strong> AI model files are loaded from
            jsdelivr.net CDN (GitHub-hosted). These are public model files - no
            user data is sent to this CDN.
          </li>
        </ul>
        <p>
          No user data is shared with these services. The CDN is only used to
          download public AI model files, similar to loading a JavaScript library.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Permissions Used</h2>
        <p>The extension requests the following permissions:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>activeTab:</strong> Allows the extension to inject the overlay
            interface when you click the extension icon.
          </li>
          <li>
            <strong>storage:</strong> Stores your preferences (whitelist,
            settings) locally in your browser.
          </li>
          <li>
            <strong>scripting:</strong> Enables dynamic injection of the overlay
            interface on demand.
          </li>
          <li>
            <strong>host_permissions:</strong> Allows the extension to work on any
            website where you choose to use it.
          </li>
        </ul>
        <p>
          These permissions are used solely to provide the extension's
          functionality. No data collected through these permissions is
          transmitted externally.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Camera Access</h2>
        <p>
          The extension requires access to your camera to display your webcam
          feed and perform face detection. This access is:
        </p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Requested only when you activate the overlay</li>
          <li>Used exclusively for local processing</li>
          <li>Never recorded, stored, or transmitted</li>
          <li>
            Can be revoked at any time through Chrome&apos;s settings
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Data Storage</h2>
        <p>The only data stored locally on your device includes:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Your whitelist of websites where the overlay should auto-open</li>
          <li>Your preference for showing/hiding face landmarks</li>
        </ul>
        <p>
          This data is stored using Chrome&apos;s built-in storage API and
          remains on your device. You can clear this data at any time by
          uninstalling the extension or clearing extension data in Chrome
          settings.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Children&apos;s Privacy</h2>
        <p>
          Our extension does not knowingly collect information from children.
          Since we do not collect any data, this is not applicable. However,
          parents should be aware that the extension requires camera access.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>
          Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated &quot;Last Updated&quot; date.
          We encourage you to review this policy periodically.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Contact</h2>
        <p>
          If you have any questions about this Privacy Policy or the extension&apos;s
          data practices, please contact us through the Chrome Web Store listing
          or GitHub repository (if applicable).
        </p>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Your Rights</h2>
        <p>
          Since we do not collect any personal data, there is no data to access,
          modify, or delete. You have full control over:
        </p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Camera access permissions (manageable through Chrome settings)</li>
          <li>Extension installation and removal</li>
          <li>
            Local storage data (cleared when extension is removed)
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "25px" }} className="section">
        <h2 style={{ color: "#555", marginTop: "30px" }}>Summary</h2>
        <div
          style={{
            backgroundColor: "#f0f4ff",
            padding: "15px",
            borderLeft: "4px solid #667eea",
            margin: "20px 0",
          }}
          className="highlight"
        >
          <p>
            <strong>In summary:</strong> The Smile Detector extension processes your
            webcam feed locally on your device. No video data, face detection
            results, or personal information is collected, stored, or transmitted to
            any external servers. All processing happens in your browser, and you
            maintain complete control over the extension&apos;s access to your
            camera and data.
          </p>
        </div>
      </section>
    </main>
  );
}
