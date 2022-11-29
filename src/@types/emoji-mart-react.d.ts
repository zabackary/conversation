declare module "@emoji-mart/react" {
  import type { FunctionComponent } from "react";

  type Category =
    | "frequent"
    | "people"
    | "nature"
    | "foods"
    | "activity"
    | "places"
    | "objects"
    | "symbols"
    | "flags";

  type EmojiVersion = 1 | 2 | 3 | 4 | 5 | 11 | 12 | 12.1 | 13 | 13.1 | 14;
  type PickerLocale =
    | "en"
    | "ar"
    | "be"
    | "cs"
    | "de"
    | "es"
    | "fa"
    | "fi"
    | "fr"
    | "hi"
    | "it"
    | "ja"
    | "kr"
    | "nl"
    | "pl"
    | "pt"
    | "ru"
    | "sa"
    | "tr"
    | "uk"
    | "vi"
    | "zh";
  type ElementPosition = "top" | "bottom" | "none";
  interface Emoji {
    id: string;
    keywords: string[];
    name: string;
    skins: {
      native: string;
      unified: string;
      x?: number;
      y?: number;
    }[];
    version: number;
  }
  interface EmojiPickerData {
    sheet: {
      cols: number;
      rows: number;
    };
    emojis: Record<string, Emoji>;
    categories: {
      id: string;
      emojis: string[];
    }[];
    aliases: Record<string, string>;
  }
  interface PickerI18n {
    search: string;
    search_no_results_1: string;
    search_no_results_2: string;
    pick: string;
    add_custom: string;
    categories: {
      activity: string;
      custom: string;
      flags: string;
      foods: string;
      frequent: string;
      nature: string;
      objects: string;
      people: string;
      places: string;
      search: string;
      symbols: string;
    };
    skins: {
      choose: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
    };
  }

  interface Props {
    /**
     * Data to use for the picker
     */
    data?: EmojiPickerData | (() => Promise<EmojiPickerData>);
    /**
     * Localization data to use for the picker
     */
    i18n?: PickerI18n;
    /**
     * Categories to show in the picker. Order is respected.
     */
    categories?: Category[];
    /**
     * [Custom emojis](https://github.com/missive/emoji-mart#custom-emojis)
     */
    custom?: Emoji[];
    /**
     * Callback when an emoji is selected
     */
    onEmojiSelect?: (selectedEmoji: Emoji) => void | null;
    /**
     * Callback when a click outside the picker happens
     */
    onClickOutside?: () => void | null;
    /**
     * Callback when the *Add custom emoji* button is clicked. The button will
     * only be displayed if this callback is provided. It is displayed when
     * search returns no results.
     */
    onAddCustomEmoji?: () => void | null;
    /**
     * Whether the picker should automatically focus on the search input
     */
    autoFocus?: boolean;
    /**
     * [Custom category icons](https://github.com/missive/emoji-mart#custom-category-icons)
     */
    categoryIcons?: Record<Category, { svg: string } | { src: string }>;
    /**
     * Whether the picker should calculate `perLine` dynamically based on the
     * width of `<em-emoji-picker>`. When enabled, `perLine` is ignored
     */
    dynamicWidth?: boolean;
    /**
     * An array of color that affects the hover background color
     */
    emojiButtonColors?: string[];
    /**
     * The radius of the emoji buttons
     */
    emojiButtonRadius?: string;
    /**
     * The size of the emoji buttons
     */
    emojiButtonSize?: number;
    /**
     * The size of the emojis (inside the buttons)
     */
    emojiSize?: number;
    /**
     * The version of the emoji data to use. Latest version supported in
     * `@emoji-mart/data` is currently [14](https://emojipedia.org/emoji-14.0)
     */
    emojiVersion?: EmojiVersion;
    /**
     * The type of icons to use for the picker. `outline` with light theme and
     * `solid` with dark theme.
     */
    icons?: "auto" | "outline" | "solid";
    /**
     * The locale to use for the picker
     */
    locale?: PickerLocale;
    /**
     * The maximum number of frequent rows to show. `0` will disable frequent
     * category
     */
    maxFrequentRows?: number;
    /**
     * The position of the navigation bar
     */
    navPosition?: ElementPosition;
    /**
     * Whether to show country flags or not. If not provided, tbhis is handled
     * automatically (Windows doesn’t support country flags)
     */
    noCountryFlags?: boolean;
    /**
     * The id of the emoji to use for the no results emoji
     */
    noResultsEmoji?: string;
    /**
     * The number of emojis to show per line
     */
    perLine?: number;
    /**
     * The id of the emoji to use for the preview when not hovering any emoji.
     * `point_up` when preview position is bottom and `point_down` when preview
     * position is top.
     */
    previewEmoji?: string;
    /**
     * The position of the preview
     */
    previewPosition?: ElementPosition;
    /**
     * The position of the search input
     */
    searchPosition?: "sticky" | "static" | "none";
    /**
     * The set of emojis to use for the picker. `native` being the most
     * performant, others rely on spritesheets.
     */
    set?: "native" | "apple" | "facebook" | "google" | "twitter";
    /**
     * The emojis skin tone
     */
    skin?: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * The position of the skin tone selector
     */
    skinTonePosition?: "preview" | "search" | "none";
    /**
     * The color theme of the picker
     */
    theme?: "auto" | "light" | "dark";
    /**
     * A function that returns the URL of the spritesheet to use for the picker. It should be compatible with the data provided.
     */
    getSpritesheetURL?: () => string | null;
  }
  /**
   * The Emoji component
   */
  const EmojiPicker: FunctionComponent<Props>;
  export = EmojiPicker;
}
