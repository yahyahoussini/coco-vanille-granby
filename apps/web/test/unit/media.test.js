// lib/media: public URLs for uploads (/media/<file>, never /api) and the safe path join of the dev route.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { mediaFile, mediaUrl, safeMediaPath } from '../../src/lib/media.js'

const photo = {
  filename: 'vitrine-31-oct.avif',
  width: 1600,
  height: 1200,
  url: '/api/media/file/vitrine-31-oct.avif',
  sizes: { card: { filename: 'vitrine-31-oct-640x800.avif', width: 640, height: 800, url: '/api/media/file/vitrine-31-oct-640x800.avif' }, hero: { filename: null } },
}

describe('public media URLs', () => {
  test('a size when it exists, the original otherwise; never the /api URL', () => {
    assert.deepEqual(mediaFile(photo, 'card'), { path: '/media/vitrine-31-oct-640x800.avif', width: 640, height: 800 })
    assert.deepEqual(mediaFile(photo, 'hero'), { path: '/media/vitrine-31-oct.avif', width: 1600, height: 1200 })
    assert.equal(mediaUrl(photo, 'card'), 'https://cocovanillegranby.com/media/vitrine-31-oct-640x800.avif')
  })

  test('file names are URL-encoded; no file, no URL', () => {
    assert.equal(mediaFile({ filename: 'gâteau 1.avif', width: 1, height: 1 }).path, '/media/g%C3%A2teau%201.avif')
    assert.equal(mediaFile(null), null)
    assert.equal(mediaFile(42), null)
    assert.equal(mediaUrl({ url: '/api/media/file/x.avif' }), null)
  })
})

describe('safeMediaPath', () => {
  const root = '/srv/app/media'

  test('a plain upload resolves inside the media folder', () => {
    assert.equal(safeMediaPath(root, ['photo.avif']), join(root, 'photo.avif'))
    assert.equal(safeMediaPath(root, ['photo.JPG']), join(root, 'photo.JPG'))
  })

  test('traversal, hidden files, separators and NUL are refused', () => {
    for (const segs of [['..', 'secret.png'], ['.', 'x.png'], ['.env'], ['a/../../x.png'], ['a\\..\\x.png'], ['x\0.png'], [''], []]) {
      assert.equal(safeMediaPath(root, segs), null, JSON.stringify(segs))
    }
  })

  test('request photos (demandes/) are never served publicly', () => {
    assert.equal(safeMediaPath(root, ['demandes', 'demande-1.jpg']), null)
  })

  test('only image types', () => {
    assert.equal(safeMediaPath(root, ['notes.txt']), null)
    assert.equal(safeMediaPath(root, ['page.html']), null)
    assert.equal(safeMediaPath(root, ['photo']), null)
  })
})
