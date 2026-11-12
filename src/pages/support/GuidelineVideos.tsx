import React, { useState } from 'react'
import { PlayIcon as Play, ArrowSquareOutIcon as ArrowSquareOut } from '@phosphor-icons/react'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../context/LanguageContext'
import { GUIDELINE_VIDEOS, type GuidelineVideo, embedUrl, thumbnailUrl, watchUrl } from '../../lib/guidelineVideos'

/**
 * Guideline videos.
 *
 * Ten cards in the order somebody setting the software up would watch them -
 * the list and the urls live in lib/guidelineVideos.ts, where a mistyped id
 * fails a test instead of rendering a grey box.
 *
 * Nothing is embedded until it is asked for. Ten YouTube iframes on page open
 * is ten third-party players, their scripts and their cookies, for a page where
 * most visits watch one video or none; so each card paints a still image and
 * swaps itself for a player on the first press. Only one plays at a time,
 * because two soundtracks at once is never what was meant.
 */
export default function GuidelineVideos() {
  const { lang } = useLang()
  const bn = lang === 'bn'
  const [playing, setPlaying] = useState<string | null>(null)

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title={bn ? 'গাইডলাইন ভিডিও' : 'Guideline Video'}
        subtitle={bn ? 'সফটওয়্যার ব্যবহারের ভিডিও নির্দেশনা' : 'Short videos showing how to use the software'}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {GUIDELINE_VIDEOS.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            step={index + 1}
            bn={bn}
            playing={playing === video.id}
            onPlay={() => setPlaying(video.id)}
          />
        ))}
      </div>
    </div>
  )
}

function VideoCard({ video, step, bn, playing, onPlay }: {
  video: GuidelineVideo
  step: number
  bn: boolean
  playing: boolean
  onPlay: () => void
}) {
  const title = bn ? video.titleBn : video.title

  return (
    <article className="group overflow-hidden rounded-2xl border border-surface-border bg-surface transition hover:border-navy-900/20 hover:shadow-lg hover:shadow-navy-900/5">
      {/* 16:9 through aspect-video rather than a padding-top box, so the frame
          and the image can swap places without the card changing height. */}
      <div className="relative aspect-video w-full bg-navy-900">
        {playing ? (
          <iframe
            src={embedUrl(video.id)}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 h-full w-full"
            aria-label={bn ? `${title} - ভিডিও চালান` : `Play ${title}`}
          >
            {/* object-cover crops hqdefault's black bands away; lazy, because
                ten stills below the fold are ten requests nobody asked for. */}
            <img
              src={thumbnailUrl(video.id)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
            {/* Darkened from the bottom so the step chip and the play button
                keep their contrast whatever the frame underneath happens to be. */}
            <span className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent" />
            <span className="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-navy-900/80 px-2 text-xs font-bold text-white backdrop-blur-sm">
              {step}
            </span>
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white">
              <Play size={22} weight="fill" className="ml-0.5" />
            </span>
          </button>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 p-4">
        <h3 className="text-sm font-bold leading-snug text-slate-800">{title}</h3>
        {/* The way out to YouTube, for anyone who wants it full screen, at
            speed, or saved for later. */}
        <a
          href={watchUrl(video.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-navy-900"
          title={bn ? 'ইউটিউবে দেখুন' : 'Watch on YouTube'}
          aria-label={bn ? `${title} - ইউটিউবে দেখুন` : `Watch ${title} on YouTube`}
        >
          <ArrowSquareOut size={16} />
        </a>
      </div>
    </article>
  )
}
