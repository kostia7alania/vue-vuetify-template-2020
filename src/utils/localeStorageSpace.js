import sizeUnitsFormat from '@/utils/sizeUnitsFormat'

let allocated = 0
let tm

export default function localeStorageSpace(timeout = 3000) {
  const { size } = new Blob(Object.values(localStorage))
  if (size !== allocated) {
    allocated = size
    window.clearTimeout(tm)
    tm = window.setTimeout(() => {
      const space = 1024 * 1024 * 5
      const percent = ((size / space) * 100).toFixed(2)
      console.log('[LocStore]', `${sizeUnitsFormat(size)} / ${sizeUnitsFormat(space)} = ${percent}%`)
    }, timeout)
  }
}
