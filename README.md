# Conversation 4

Welcome to the source code for Conversation! I'll write something helpful here
later, but I don't have time now.

## Installation

- Conversation utilizes the [`pnpm`](https://www.pnpm.io) package manager to
  load dependencies. Install this if you don't have it already.

- Run `pnpm install` to install dependencies.

- Set up files

  - _`.clasp.json`: [Clasp](https://github.com/google/clasp) config file_

    Should be set up as follows:

    ```json
    {
      "scriptId": "{{ Google Script project ID }}",
      "rootDir": "{{ Path to `/dist` }}"
    }
    ```

    [Install Clasp](https://github.com/google/clasp#install) and [log in](https://github.com/google/clasp#login) before running `pnpm run upload`

  - _`jwt.key`: [JWT](https://www.jwt.io) private key_

    Generate a secure private key using a method [like this](https://stackoverflow.com/a/52996809):

    ```bash
    node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
    ```
