import { describe, expect, it } from 'vitest'
import { GUIDELINE_VIDEOS, VIDEO_ID, embedUrl, thumbnailUrl, watchUrl } from './guidelineVideos'

/**
 * A mistyped video id does not throw. It renders a grey box and a player that
 * will not start, and nobody finds out until a customer says the page is
 * broken. These are the checks that turn that into a red test.
 */
describe('the video list', () => {
  it('gives every entry a well-formed YouTube id', () => {
    for (const video of GUIDELINE_VIDEOS) {
      expect(VIDEO_ID.test(video.id), `${video.title} has id "${video.id}"`).toBe(true)
    }
  })

  it('has no duplicate ids', () => {
    // Two cards playing the same video is a copy-paste slip, and on a page of
    // ten near-identical rows it is invisible by eye.
    const ids = GUIDELINE_VIDEOS.map(video => video.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('names every video in both languages', () => {
    // The page is bilingual; an entry with no Bangla title would fall back to
    // nothing and show an untitled card.
    for (const video of GUIDELINE_VIDEOS) {
      expect(video.title.trim(), `${video.id} has no English title`).not.toBe('')
      expect(video.titleBn.trim(), `${video.id} has no Bangla title`).not.toBe('')
    }
  })

  it('opens with registration, which is the one everything else assumes', () => {
    expect(GUIDELINE_VIDEOS[0].title).toMatch(/registration/i)
  })
})

describe('the urls', () => {
  it('points the thumbnail at hqdefault, which every video has', () => {
    // maxresdefault only exists above 720p and 404s silently otherwise, which
    // would leave some cards blank.
    expect(thumbnailUrl('nbCstT2mxV8')).toBe('https://i.ytimg.com/vi/nbCstT2mxV8/hqdefault.jpg')
  })

  it('embeds through the no-cookie host, and autoplays', () => {
    const url = embedUrl('nbCstT2mxV8')
    expect(url).toContain('youtube-nocookie.com/embed/nbCstT2mxV8')
    // The click that built the frame was the request to watch; a second click
    // on YouTube's own play button is the same card, worse.
    expect(url).toContain('autoplay=1')
    expect(url).toContain('rel=0')
  })

  it('links out to the normal watch page', () => {
    expect(watchUrl('nbCstT2mxV8')).toBe('https://www.youtube.com/watch?v=nbCstT2mxV8')
  })

  it('builds every url in the list without producing a broken one', () => {
    for (const video of GUIDELINE_VIDEOS) {
      expect(thumbnailUrl(video.id)).toContain(video.id)
      expect(embedUrl(video.id)).toContain(video.id)
      expect(watchUrl(video.id)).toContain(video.id)
    }
  })
})
