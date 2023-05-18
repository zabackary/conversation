# Conversation 4

Conversation is a chat app built from the ground up to be safe for students to
use for communicating with peers about projects, life, and more.

## Features

### _Simple_

Anytime, anywhere. Even on a school chromebook. Conversation utilizes Google Scripts for uncensorable communication.

### _Safe_

Built to be moderated, from the ground up. State-of-the-art automated filtering combined with real humans can catch everything.

### _Beautiful_

Wonderfully designed using Google's latest styles. Pretty pretty, if you know what I mean.

### _Powerful_

Easily invite members and chat using not just text but images, bots, and more.

## Deployment

Simply run `pnpm run deploy` to first build the app from source then upload it
to Google Apps Script as a web app. You can then deploy it from the web UI or
preview it from the `/dev` URL.
[Learn more at the official documentation](https://developers.google.com/apps-script/guides/web).

## Installation

- Conversation utilizes the [`pnpm`](https://www.pnpm.io) package manager to
  load dependencies. Install this if you don't have it already.

- Run `pnpm install` to install dependencies.

- Set up `.gitignore`'d files

  - [`.clasp.json`](/.clasp.json): [Clasp](https://github.com/google/clasp)
    config file

    Should be set up as follows:

    ```json
    {
      "scriptId": "{{ Google Script project ID }}",
      "rootDir": "{{ Path to `/dist` }}"
    }
    ```

    [Log in](https://github.com/google/clasp#login) to your Google Account via
    `pnpm clasp login` before running `pnpm run upload`

  - [`.env.local`](/.env.local): [.env](https://www.npmjs.com/package/dotenv)
    file containing Supabase keys

    Should be set up as follows:

    ```env
    CLIENT_SUPABASE_URL=https://{{ Supabase project ID }}.supabase.co/
    CLIENT_SUPABASE_ANON_KEY={{ Supabase anon key (not service role!) }}
    CLIENT_FEEDBACK_EMAIL={{ Your email, for the 'send feedback' option }}
    CLIENT_TOS_URL={{ The URL of a gdoc with the TOS }}
    CLIENT_PRIVACY_POLICY_URL={{ The URL of a gdoc w/ privacy policy }}
    ```

- (optional) Set up Supabase emails

  Using the Supabase admin panel, navigate to Authentication > Email Templates,
  then copy and paste the corresponding email template in [`/emails`](/emails)
  into each email template.

- You're all set to start developing. Run `pnpm serve` to start the dev server.
