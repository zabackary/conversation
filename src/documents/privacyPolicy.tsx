import BaseDocument from "./base";

export default function PrivacyPolicy() {
  return (
    <BaseDocument>
      <p>
        I don&apos;t have time to write a full document. Here&apos;s the basics:
      </p>
      <ul>
        <li>
          Your data is not private. I can see all user data and am able disclose
          it to others at will.
        </li>
        <li>Your usage is not private.</li>
        <li>
          While I have taken steps to ensure the security of your account, it
          may be hacked.
        </li>
        <li>
          More applies: ask me (the developer) in person for more details.
        </li>
      </ul>
      <p>If you don&apos;t like this, don&apos;t use the service.</p>
    </BaseDocument>
  );
}
