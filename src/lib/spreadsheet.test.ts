import { describe, expect, it } from 'vitest'
import { csvEscape, csvSafeText, parseCsv } from './spreadsheet'

// A CSV export is opened in Excel by the owner. A name that starts with = + -
// or @ used to be written as it was typed, and Excel ran it as a formula.
describe('csvSafeText', () => {
  it('marks a formula-looking name as text', () => {
    expect(csvSafeText('=HYPERLINK("http://evil.example","Pay here")')).toBe(`'=HYPERLINK("http://evil.example","Pay here")`)
    expect(csvSafeText('+SUM(A1:A9)')).toBe(`'+SUM(A1:A9)`)
    expect(csvSafeText('-2+3+cmd|x')).toBe(`'-2+3+cmd|x`)
    expect(csvSafeText('@SUM(1,2)')).toBe(`'@SUM(1,2)`)
    expect(csvSafeText('\t=1+1')).toBe(`'\t=1+1`)
  })

  it('leaves ordinary text alone', () => {
    expect(csvSafeText('Rahman Store')).toBe('Rahman Store')
    expect(csvSafeText('A-12 = large')).toBe('A-12 = large')
    expect(csvSafeText('')).toBe('')
    expect(csvSafeText(null)).toBe('')
  })

  it('leaves numbers alone, whether typed as numbers or as text', () => {
    expect(csvSafeText(-500)).toBe('-500')
    expect(csvSafeText('-500')).toBe('-500')
    expect(csvSafeText('-1,250.50')).toBe('-1,250.50')
    expect(csvSafeText('+8801719731884')).toBe('+8801719731884')
    expect(csvSafeText('-15%')).toBe('-15%')
  })
})

describe('csvEscape', () => {
  it('quotes the cell and doubles quotes inside it', () => {
    expect(csvEscape('6" shelf, oak')).toBe('"6"" shelf, oak"')
  })

  it('survives a round trip through the importer', () => {
    const row = ['P-1', '6" shelf, oak', '+8801719731884', -500, '=1+1']
    const [parsed] = parseCsv(row.map(csvEscape).join(','))
    expect(parsed).toEqual(['P-1', '6" shelf, oak', '+8801719731884', '-500', `'=1+1`])
  })
})
