// ---------------------------------------------------------------------------
// The guideline videos, in the order somebody setting the software up would
// watch them: register, then the things everything else depends on (business
// profile, suppliers, products), then the day-to-day modules.
//
// A list rather than a table in the database, because these are ten links that
// change a handful of times a year and a settings screen for them would be more
// machinery than the thing it manages. When they need to be editable by the
// owner, this becomes the seed for that table.
//
// Kept out of the page so the ids can be checked by a test: a mistyped id does
// not throw, it renders a grey box and a video that will not play, which is the
// kind of thing nobody notices until a customer asks.
// ---------------------------------------------------------------------------

export interface GuidelineVideo {
  /** The YouTube id, not the whole URL - both the thumbnail and the embed need it alone. */
  id: string
  title: string
  titleBn: string
}

export const GUIDELINE_VIDEOS: GuidelineVideo[] = [
  { id: 'nbCstT2mxV8', title: 'LocalBiz registration', titleBn: 'লোকালবিজ রেজিস্ট্রেশন' },
  { id: 'xdozv2wlgo0', title: 'Update your business profile', titleBn: 'ব্যবসার প্রোফাইল হালনাগাদ' },
  { id: '3cP4blMD9Eo', title: 'Manage your suppliers', titleBn: 'সাপ্লায়ার ব্যবস্থাপনা' },
  { id: 'PRO04SrvEwE', title: 'Product list', titleBn: 'প্রোডাক্ট তালিকা' },
  { id: 'ISIV41rXAz0', title: 'Customers & wallet', titleBn: 'কাস্টমার ও ওয়ালেট' },
  { id: 'uRnE7Sl4o4U', title: 'Manage shareholders', titleBn: 'শেয়ারহোল্ডার ব্যবস্থাপনা' },
  { id: 'KFoQg5qVv0U', title: 'Loan management', titleBn: 'লোন ব্যবস্থাপনা' },
  { id: 'zzHdKciCnwQ', title: 'Expense management', titleBn: 'খরচ ব্যবস্থাপনা' },
  { id: 'qXF3CnPxOLc', title: 'Employee management & support', titleBn: 'কর্মী ব্যবস্থাপনা ও সাপোর্ট' },
  { id: 'QxOd2fdAAa0', title: 'Supplier, purchase & sale', titleBn: 'সাপ্লায়ার, ক্রয় ও বিক্রয়' },
]

/** A YouTube id is 11 characters of base64url. Anything else is a typo. */
export const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * The card's still image.
 *
 * hqdefault rather than maxresdefault: maxres only exists for videos uploaded
 * above 720p and silently 404s otherwise, which would leave some cards blank.
 * hqdefault is 480x360 with black bands top and bottom, so the card crops it to
 * 16:9 with object-cover and the bands go with the crop.
 */
export const thumbnailUrl = (id: string): string => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/**
 * The player, built only once somebody presses play.
 *
 * nocookie is YouTube's own no-tracking-until-playback host, and autoplay is on
 * because the press that swapped the image for this frame WAS the request to
 * watch - making them click play a second time is just a worse version of the
 * same card.
 */
export const embedUrl = (id: string): string =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`

/** What to open when somebody wants it on YouTube itself. */
export const watchUrl = (id: string): string => `https://www.youtube.com/watch?v=${id}`
